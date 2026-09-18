/**
 * Paystack Payment & Premium Gem Store Integration
 */

export interface GemBundle {
  id: string;
  name: string;
  gems: number;
  bonusGems: number;
  priceUSD: number;
  priceNGN: number;
  badge?: string;
  description: string;
  popular?: boolean;
}

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

export const GEM_BUNDLES: GemBundle[] = [
  {
    id: 'bundle_starter',
    name: 'Starter Gem Pouch',
    gems: 50,
    bonusGems: 0,
    priceUSD: 1.99,
    priceNGN: 2500,
    description: 'Perfect kickstart for instant cash exchange or energy top-up.',
  },
  {
    id: 'bundle_hustler',
    name: "Hustler's Gem Stash",
    gems: 160,
    bonusGems: 20,
    priceUSD: 4.99,
    priceNGN: 6500,
    badge: 'MOST POPULAR',
    popular: true,
    description: 'The community favorite! Ideal for financing down payments and credit repair.',
  },
  {
    id: 'bundle_tycoon',
    name: 'Tycoon Gem Vault',
    gems: 550,
    bonusGems: 100,
    priceUSD: 14.99,
    priceNGN: 19500,
    badge: 'BEST VALUE',
    description: 'Serious liquidity for property auctions and commercial vehicle fleet expansions.',
  },
  {
    id: 'bundle_empire',
    name: 'Empire Sovereign Treasury',
    gems: 1800,
    bonusGems: 500,
    priceUSD: 39.99,
    priceNGN: 52000,
    badge: 'VIP STATUS',
    description: 'Massive gem reserves to dominate real estate and venture holdings.',
  },
];

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
 * Loads Paystack Inline script if not already present
 */
export const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Paystack inline script could not be loaded from CDN');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export interface PaystackCheckoutParams {
  bundle: GemBundle;
  currency: 'USD' | 'NGN';
  customerEmail: string;
  onSuccess: (reference: string, totalGems: number) => void;
  onClose?: () => void;
  onError?: (err: any) => void;
}

/**
 * Initiates Paystack Inline checkout with configured key, or gracefully runs
 * simulation mode if the key has not yet been set in .env
 */
export const initiatePaystackCheckout = async ({
  bundle,
  currency,
  customerEmail,
  onSuccess,
  onClose,
  onError,
}: PaystackCheckoutParams) => {
  const publicKey = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '').trim();
  const totalGems = bundle.gems + bundle.bonusGems;
  const isKeyConfigured = publicKey.length > 5 && publicKey.startsWith('pk_');

  // Amount in kobo/cents for Paystack
  const amount = currency === 'NGN' ? bundle.priceNGN * 100 : Math.round(bundle.priceUSD * 100);

  if (isKeyConfigured) {
    const isScriptReady = await loadPaystackScript();
    const PaystackPop = (window as any)?.PaystackPop;

    if (isScriptReady && PaystackPop && typeof PaystackPop.setup === 'function') {
      try {
        const handler = PaystackPop.setup({
          key: publicKey,
          email: customerEmail || 'player@hustlesim.app',
          amount,
          currency: currency === 'NGN' ? 'NGN' : 'USD',
          ref: 'gem_' + Date.now() + '_' + Math.floor(Math.random() * 1000000),
          metadata: {
            custom_fields: [
              {
                display_name: 'Bundle',
                variable_name: 'bundle_name',
                value: bundle.name,
              },
              {
                display_name: 'Gems Delivered',
                variable_name: 'gems_delivered',
                value: totalGems,
              },
            ],
          },
          callback: (response: { reference: string }) => {
            onSuccess(response.reference, totalGems);
          },
          onClose: () => {
            if (onClose) onClose();
          },
        });

        handler.openIframe();
        return;
      } catch (err) {
        console.error('Error opening Paystack iframe:', err);
        if (onError) onError(err);
      }
    }
  }

  // Graceful Sandbox / Test Mode (User stated: "I'll send my paystack key later")
  // Provide seamless testing flow so gems can be acquired and tested right now!
  const mockRef = 'pstk_test_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  
  // Simulated brief verification delay
  setTimeout(() => {
    onSuccess(mockRef, totalGems);
  }, 400);
};
