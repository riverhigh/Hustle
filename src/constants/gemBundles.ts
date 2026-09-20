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
