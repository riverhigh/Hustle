/**
 * Paystack Payment & Premium Gem Store Integration
 * Fully verified via backend server (/api/paystack/initialize and /api/paystack/verify)
 */

import { GEM_BUNDLES, GemBundle } from '../constants/gemBundles';

export { GEM_BUNDLES };
export type { GemBundle };

export interface GemCashExchangeOption {
  id: string;
  gemsCost: number;
  cashReward: number;
  title: string;
  description: string;
  badge?: string;
}

export interface GemPerkOption {
  id: string;
  name: string;
  gemsCost: number;
  description: string;
  iconName: 'zap' | 'credit' | 'crown';
  badge?: string;
}

export const GEM_CASH_EXCHANGES: GemCashExchangeOption[] = [
  {
    id: 'exchange_5k',
    gemsCost: 20,
    cashReward: 5000,
    title: '$5,000 Quick Cash',
    description: 'Great for grocery, tool upgrades, or security deposits.',
  },
  {
    id: 'exchange_15k',
    gemsCost: 50,
    cashReward: 15000,
    title: '$15,000 Business Starter',
    description: 'Provides upfront capital for your first pressure washing or detailing business.',
    badge: 'STARTER PACK',
  },
  {
    id: 'exchange_55k',
    gemsCost: 150,
    cashReward: 55000,
    title: '$55,000 Down Payment Fund',
    description: 'Sufficient to cover down payment + closing costs on your first rental property.',
    badge: 'REAL ESTATE FAVORITE',
  },
  {
    id: 'exchange_180k',
    gemsCost: 400,
    cashReward: 180000,
    title: '$180,000 Corporate Liquidity',
    description: 'Massive cash infusion to purchase properties outright or buy fleet vehicles.',
  },
  {
    id: 'exchange_500k',
    gemsCost: 1000,
    cashReward: 500000,
    title: '$500,000 Billionaire Wire',
    description: 'Supreme financial firepower to bid on luxury auction estates and REITs.',
    badge: 'WHALE TIER',
  },
];

export const GEM_PERKS: GemPerkOption[] = [
  {
    id: 'perk_full_energy',
    name: '100% Energy Supercharge',
    gemsCost: 10,
    description: 'Instantly restores your physical Energy to 100 max with zero fatigue penalties.',
    iconName: 'zap',
  },
  {
    id: 'perk_credit_cleanse',
    name: 'Credit Bureau Cleanse (+25 Score)',
    gemsCost: 25,
    description: 'Removes negative remarks from your credit file and adds an instant +25 points.',
    iconName: 'credit',
    badge: 'CREDIT BOOSTER',
  },
  {
    id: 'perk_vip_booster',
    name: 'VIP Prestige Booster (7 Days)',
    gemsCost: 40,
    description: 'Permanently increases all hustle gig and business payouts by +25% for 7 in-game days.',
    iconName: 'crown',
    badge: 'EARNINGS MULTIPLIER',
  },
];

/**
 * Loads Paystack Inline script (V2 preferred, V1 fallback)
 */
export const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      // Try fallback to v1
      const fallbackScript = document.createElement('script');
      fallbackScript.src = 'https://js.paystack.co/v1/inline.js';
      fallbackScript.async = true;
      fallbackScript.onload = () => resolve(true);
      fallbackScript.onerror = () => {
        console.warn('Paystack inline script could not be loaded from CDN');
        resolve(false);
      };
      document.body.appendChild(fallbackScript);
    };
    document.body.appendChild(script);
  });
};

export interface InitializePaymentResponse {
  success: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  reference?: string;
  totalGems?: number;
  bundle?: GemBundle;
  error?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  status?: string;
  reference?: string;
  totalGems?: number;
  bundleName?: string;
  amount?: number;
  currency?: string;
  paidAt?: string;
  error?: string;
  alreadyRedeemed?: boolean;
}

/**
 * Initializes a transaction securely via backend with Paystack API
 */
export const initializePaystackTransaction = async (
  bundle: GemBundle,
  currency: 'USD' | 'NGN' = 'NGN',
  customerEmail: string = 'printblue436@gmail.com'
): Promise<InitializePaymentResponse> => {
  try {
    const res = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bundleId: bundle.id,
        currency,
        email: customerEmail || 'printblue436@gmail.com',
      }),
    });

    const raw = await res.text();
    let data: any = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      return {
        success: false,
        error: 'Payment server returned an invalid response. Please try again.',
      };
    }
    return data;
  } catch (error: any) {
    console.error('Network error initializing Paystack:', error);
    return {
      success: false,
      error: error?.message || 'Could not connect to payment server.',
    };
  }
};

/**
 * Verifies transaction with Paystack via server-side verification endpoint
 */
export const verifyPaystackPayment = async (reference: string): Promise<VerifyPaymentResponse> => {
  try {
    const res = await fetch('/api/paystack/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference: reference.trim() }),
    });

    const raw = await res.text();
    let data: any = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      return {
        success: false,
        error: 'Verification server returned an unreadable response. Please check reference manually.',
      };
    }
    return data;
  } catch (error: any) {
    console.error('Network error verifying Paystack payment:', error);
    return {
      success: false,
      error: error?.message || 'Could not connect to payment server for verification.',
    };
  }
};

export interface PaystackCheckoutParams {
  bundle: GemBundle;
  currency: 'USD' | 'NGN';
  customerEmail?: string;
  onSuccess: (reference: string, totalGems: number) => void;
  onClose?: () => void;
  onError?: (err: any) => void;
}

/**
 * Initiates Paystack checkout and confirms transaction verification before granting gems
 */
export const initiatePaystackCheckout = async ({
  bundle,
  currency,
  customerEmail = 'printblue436@gmail.com',
  onSuccess,
  onClose,
  onError,
}: PaystackCheckoutParams) => {
  // Step 1: Initialize transaction on backend with secret key
  const initResult = await initializePaystackTransaction(bundle, currency, customerEmail);

  if (!initResult.success || !initResult.accessCode || !initResult.authorizationUrl) {
    const errorMsg = initResult.error || 'Failed to initialize Paystack payment.';
    if (onError) onError(new Error(errorMsg));
    return;
  }

  const { accessCode, authorizationUrl, reference, totalGems = bundle.gems + bundle.bonusGems } = initResult;

  // Step 2: Try Paystack Inline Popup if supported
  await loadPaystackScript();
  const PaystackPop = (window as any)?.PaystackPop;

  // Verify function helper
  const verifyAndDeliver = async (refToVerify: string) => {
    const verifyRes = await verifyPaystackPayment(refToVerify);
    if (verifyRes.success && verifyRes.status === 'success') {
      const deliveredGems = verifyRes.totalGems || totalGems;
      onSuccess(refToVerify, deliveredGems);
      return true;
    } else {
      if (onError) onError(new Error(verifyRes.error || 'Payment was not confirmed by Paystack.'));
      return false;
    }
  };

  let popupLaunched = false;

  if (PaystackPop) {
    try {
      // Paystack V2 inline API: resumeTransaction(access_code)
      if (typeof PaystackPop === 'function') {
        const popup = new PaystackPop();
        if (typeof popup.resumeTransaction === 'function') {
          popup.resumeTransaction(accessCode, {
            onSuccess: async (transaction: any) => {
              const ref = transaction?.reference || reference!;
              await verifyAndDeliver(ref);
            },
            onCancel: () => {
              if (onClose) onClose();
            },
          });
          popupLaunched = true;
        }
      }

      // Paystack V1 inline API: PaystackPop.setup
      if (!popupLaunched && typeof PaystackPop.setup === 'function') {
        const publicKey = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '').trim();
        const handler = PaystackPop.setup({
          key: publicKey.startsWith('pk_') ? publicKey : undefined,
          access_code: accessCode,
          ref: reference,
          callback: async (response: { reference: string }) => {
            const ref = response.reference || reference!;
            await verifyAndDeliver(ref);
          },
          onClose: () => {
            if (onClose) onClose();
          },
        });
        handler.openIframe();
        popupLaunched = true;
      }
    } catch (popupErr) {
      console.warn('Paystack inline popup could not be initialized directly, falling back to window/modal:', popupErr);
    }
  }

  // If popup could not launch, open checkout URL in a popup window or tab
  if (!popupLaunched && authorizationUrl) {
    window.open(authorizationUrl, '_blank', 'width=500,height=700');
  }
};
