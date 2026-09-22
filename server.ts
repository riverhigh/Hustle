import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GEM_BUNDLES, GemBundle } from './src/constants/gemBundles';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory set to prevent double redemption of the same Paystack transaction reference
const redeemedReferences = new Set<string>();

/**
 * Safely resolves the Paystack Secret Key from environment variables.
 * Handles cases where user sets PAYSTACK_SECRET_KEY, or where sk_live / sk_test
 * was stored in VITE_PAYSTACK_PUBLIC_KEY.
 */
function getPaystackSecretKey(): string | null {
  const envSecret = process.env.PAYSTACK_SECRET_KEY || process.env.VITE_PAYSTACK_SECRET_KEY;
  if (envSecret && envSecret.trim().length > 0) {
    return envSecret.trim();
  }

  const pubKey = process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (pubKey && (pubKey.trim().startsWith('sk_live_') || pubKey.trim().startsWith('sk_test_'))) {
    return pubKey.trim();
  }

  return null;
}

/**
 * Resolves the Paystack Public Key if available
 */
function getPaystackPublicKey(): string | null {
  const pub = process.env.PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (pub && (pub.trim().startsWith('pk_live_') || pub.trim().startsWith('pk_test_'))) {
    return pub.trim();
  }
  return null;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Paystack Gateway Configuration endpoint
app.get('/api/paystack/config', (_req, res) => {
  const secretKey = getPaystackSecretKey();
  const publicKey = getPaystackPublicKey();

  res.json({
    configured: Boolean(secretKey),
    hasSecretKey: Boolean(secretKey),
    hasPublicKey: Boolean(publicKey),
    publicKey: publicKey || '',
  });
});

// Paystack Transaction Initialize endpoint
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const { bundleId, currency = 'NGN', email = 'printblue436@gmail.com', callbackUrl } = req.body;

    const bundle = GEM_BUNDLES.find((b) => b.id === bundleId);
    if (!bundle) {
      return res.status(400).json({ success: false, error: 'Invalid gem bundle selected.' });
    }

    const secretKey = getPaystackSecretKey();
    if (!secretKey) {
      return res.status(400).json({
        success: false,
        error: 'Paystack Secret Key is not configured. Please ensure PAYSTACK_SECRET_KEY is provided in your settings.',
      });
    }

    // Paystack amounts are in lowest currency unit (Kobo for NGN, Cents for USD)
    const amountInSubunits =
      currency === 'USD'
        ? Math.round(bundle.priceUSD * 100)
        : Math.round(bundle.priceNGN * 100);

    const totalGems = bundle.gems + bundle.bonusGems;
    const reference = `gem_${bundle.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const paystackPayload: Record<string, any> = {
      email,
      amount: amountInSubunits,
      currency: currency === 'USD' ? 'USD' : 'NGN',
      reference,
      metadata: {
        bundleId: bundle.id,
        bundleName: bundle.name,
        gems: bundle.gems,
        bonusGems: bundle.bonusGems,
        totalGems,
        custom_fields: [
          { display_name: 'Bundle Name', variable_name: 'bundle_name', value: bundle.name },
          { display_name: 'Gems Delivered', variable_name: 'gems_delivered', value: totalGems },
        ],
      },
    };

    if (callbackUrl) {
      paystackPayload.callback_url = callbackUrl;
    }

    let paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    });

    let rawText = await paystackRes.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      console.warn('Paystack initialize response was not valid JSON:', rawText);
    }

    // Fallback: If currency USD failed because merchant account only supports NGN, retry automatically with NGN
    if (!data.status && (data.code === 'unsupported_currency' || data.message?.toLowerCase().includes('currency'))) {
      console.log('Merchant account requires NGN. Automatically retrying with NGN currency...');
      paystackPayload.currency = 'NGN';
      paystackPayload.amount = Math.round(bundle.priceNGN * 100);

      paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paystackPayload),
      });

      rawText = await paystackRes.text();
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        console.warn('Paystack retry response was not valid JSON:', rawText);
      }
    }

    if (!data.status || !data.data) {
      return res.status(400).json({
        success: false,
        error: data.message || 'Paystack rejected initialization request.',
        details: data,
      });
    }

    return res.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
      totalGems,
      bundle,
    });
  } catch (error: any) {
    console.error('Error initializing Paystack transaction:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Server error initializing payment with Paystack.',
    });
  }
});

// Paystack Transaction Verification endpoint
app.post('/api/paystack/verify', async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ success: false, error: 'Payment reference is required.' });
    }

    const cleanRef = reference.trim();

    // Check anti-replay in memory
    if (redeemedReferences.has(cleanRef)) {
      return res.status(400).json({
        success: false,
        error: 'This transaction reference has already been verified and redeemed.',
        alreadyRedeemed: true,
      });
    }

    const secretKey = getPaystackSecretKey();
    if (!secretKey) {
      return res.status(400).json({
        success: false,
        error: 'Paystack Secret Key is not configured on the server.',
      });
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(cleanRef)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const rawVerifyText = await paystackRes.text();
    let data: any = {};
    try {
      data = rawVerifyText ? JSON.parse(rawVerifyText) : {};
    } catch {
      console.warn('Paystack verify response was not valid JSON:', rawVerifyText);
      return res.status(502).json({
        success: false,
        error: 'Paystack service returned an invalid response. Please wait a moment and retry verification.',
      });
    }

    if (!data.status || !data.data) {
      return res.status(400).json({
        success: false,
        error: data.message || 'Paystack could not find this transaction reference.',
      });
    }

    const tx = data.data;

    // Verify status is actually 'success'
    if (tx.status !== 'success') {
      return res.status(400).json({
        success: false,
        status: tx.status,
        error: `Payment is not successful. Current status: "${tx.status}". Gateway: "${tx.gateway_response || 'Incomplete'}"`,
      });
    }

    // Determine gem amount from metadata or match by amount
    let totalGems = 0;
    let bundleName = 'Gem Bundle';

    if (tx.metadata?.totalGems) {
      totalGems = Number(tx.metadata.totalGems);
      bundleName = tx.metadata.bundleName || bundleName;
    } else if (tx.metadata?.bundleId) {
      const match = GEM_BUNDLES.find((b) => b.id === tx.metadata.bundleId);
      if (match) {
        totalGems = match.gems + match.bonusGems;
        bundleName = match.name;
      }
    } else {
      // Infer from amount paid
      const amountPaid = tx.amount; // in kobo or cents
      if (tx.currency === 'NGN') {
        const ngn = Math.round(amountPaid / 100);
        const match = GEM_BUNDLES.find((b) => Math.abs(b.priceNGN - ngn) < 100);
        if (match) {
          totalGems = match.gems + match.bonusGems;
          bundleName = match.name;
        }
      } else {
        const usd = amountPaid / 100;
        const match = GEM_BUNDLES.find((b) => Math.abs(b.priceUSD - usd) < 0.5);
        if (match) {
          totalGems = match.gems + match.bonusGems;
          bundleName = match.name;
        }
      }
    }

    if (totalGems <= 0) {
      totalGems = 50; // Fallback minimum bundle
    }

    // Mark reference as redeemed
    redeemedReferences.add(cleanRef);

    return res.json({
      success: true,
      status: 'success',
      reference: tx.reference,
      totalGems,
      bundleName,
      amount: tx.amount,
      currency: tx.currency,
      paidAt: tx.paid_at,
      channel: tx.channel,
      message: 'Payment successfully verified and confirmed by Paystack!',
    });
  } catch (error: any) {
    console.error('Error verifying Paystack transaction:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Server error verifying payment with Paystack.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
