export interface FarbesBillionaire {
  rank: number;
  name: string;
  netWorth: number;
  wealthSource: string;
  industry: 'Tech' | 'Finance' | 'Real Estate' | 'Luxury & Fashion' | 'Energy' | 'Automotive' | 'Diversified';
  country: string;
  flag: string;
  changePercent: number; // e.g. +1.4%
  bio: string;
  isPlayer?: boolean;
}

// Fixed top icons and parody billionaires
const NOTABLE_NAMES = [
  { name: 'Elon Tusk', wealthSource: 'X-Space, Tesla Motors & NeuralNet', industry: 'Tech' as const, country: 'USA', flag: '🇺🇸', bio: 'Pioneered private space travel, multi-planetary colonization, and sentient AI robotics.' },
  { name: 'Jeff Besos', wealthSource: 'MegaStore Cloud & Prime Orbital', industry: 'Tech' as const, country: 'USA', flag: '🇺🇸', bio: 'Built the largest digital commerce platform and cloud data backbone on Earth.' },
  { name: 'Bernard Arnault-Pique', wealthSource: 'LVMG Luxury Fashion & Spirits', industry: 'Luxury & Fashion' as const, country: 'France', flag: '🇫🇷', bio: 'Overlord of 75 luxury heritage brands, haute couture, and champagne vineyards.' },
  { name: 'Mark Suckerberg', wealthSource: 'Metaverse Horizons & SocialGraph', industry: 'Tech' as const, country: 'USA', flag: '🇺🇸', bio: 'Controls global virtual worlds, AR optics, and omnipresent advertising networks.' },
  { name: 'Warren Buffeted', wealthSource: 'Berkshire Omaha Holdings', industry: 'Finance' as const, country: 'USA', flag: '🇺🇸', bio: 'Legendary value investor, railroad magnate, and long-term underwriting oracle.' },
  { name: 'Larry Hellison', wealthSource: 'Apex Database Cloud & Cyber Defense', industry: 'Tech' as const, country: 'USA', flag: '🇺🇸', bio: 'Cloud infrastructure pioneer who owns Hawaiian islands and America’s Cup racing yachts.' },
  { name: 'Bill Doors', wealthSource: 'OmniOS & Global Philanthropy', industry: 'Tech' as const, country: 'USA', flag: '🇺🇸', bio: 'Software architect who powered the PC revolution and global nuclear clean energy.' },
  { name: 'Sheikh Hamdan Al-Maktoum', wealthSource: 'Emirates Sovereign Real Estate', industry: 'Real Estate' as const, country: 'UAE', flag: '🇦🇪', bio: 'Visionary architect behind artificial island archipelagos and mega-skyscrapers.' },
  { name: 'Carlos Slim Helo', wealthSource: 'América Móvil Telecom & Mining', industry: 'Diversified' as const, country: 'Mexico', flag: '🇲🇽', bio: 'Monopolized Latin American fiber optic telecom, toll roads, and copper reserves.' },
  { name: 'Mukesh Ambani-G', wealthSource: 'Reliance Petrocrown & Jio 6G', industry: 'Energy' as const, country: 'India', flag: '🇮🇳', bio: 'Controls South Asia’s largest oil refining complex and mobile data infrastructure.' },
  { name: 'Steve Ballmer-King', wealthSource: 'Sports Franchises & Tech Equity', industry: 'Diversified' as const, country: 'USA', flag: '🇺🇸', bio: 'Billionaire NBA franchise owner and enterprise software pioneer.' },
  { name: 'Amancio Ortega-Zara', wealthSource: 'Inditex Fast Fashion & Commercial REIT', industry: 'Luxury & Fashion' as const, country: 'Spain', flag: '🇪🇸', bio: 'Pioneered zero-inventory fast fashion and prime Manhattan real estate acquisitions.' },
  { name: 'Gautam Adani-Power', wealthSource: 'Adani Ports & Solar Megagrids', industry: 'Energy' as const, country: 'India', flag: '🇮🇳', bio: 'Operates deepwater trade harbors and vast desert renewable solar farms.' },
  { name: 'Michael Bloomberg-Data', wealthSource: 'Financial Terminals & Media', industry: 'Finance' as const, country: 'USA', flag: '🇺🇸', bio: 'Created the premier financial data pipeline connecting Wall Street trading desks.' },
  { name: 'Zhong Shanshan-Water', wealthSource: 'Nongfu Spring & Biopharmaceuticals', industry: 'Diversified' as const, country: 'China', flag: '🇨🇳', bio: 'Turned natural spring water and hepatitis vaccines into a multi-billion empire.' },
  { name: 'Ken Griffin-Citadel', wealthSource: 'High-Frequency Quantitative Hedge Fund', industry: 'Finance' as const, country: 'USA', flag: '🇺🇸', bio: 'Architect of algorithmic market-making handling 40% of retail equity order flow.' },
  { name: 'Colin Huang-Temu', wealthSource: 'PDD Cross-Border E-Commerce', industry: 'Tech' as const, country: 'China', flag: '🇨🇳', bio: 'Disrupted global consumer supply chains with direct-from-factory algorithm sales.' },
  { name: 'Jensen Huanger', wealthSource: 'Quantum Silicon Graphics & AI Chips', industry: 'Tech' as const, country: 'USA', flag: '🇺🇸', bio: 'Leather-jacketed semiconductor icon supplying 90% of global AI computing accelerators.' },
  { name: 'Alice & Jim Walton', wealthSource: 'MegaMart Retail Dynasty', industry: 'Luxury & Fashion' as const, country: 'USA', flag: '🇺🇸', bio: 'Heirs to the world’s largest discount retail empire with 10,000 supercenters.' },
  { name: 'Klaus-Michael Kuehne', wealthSource: 'Global Container Shipping & Cargo', industry: 'Diversified' as const, country: 'Germany', flag: '🇩🇪', bio: 'Commands intercontinental maritime freight fleets and commercial rail transport.' }
];

const SECONDARY_NAMES = [
  'Vance Sterling', 'Sebastian Drake', 'Eleanor DuPont', 'Victoria Romanov',
  'Cassian Thorne', 'Julian De La Cruz', 'Harrison Frost', 'Aria Sterling',
  'Maximilian Roth', 'Cynthia Davenport', 'Dante Moretti', 'Helena Vane',
  'Rodrigo Silva', 'Natalia Voronova', 'Dominic Stone', 'Vivienne Westwood-Smith',
  'Alistair Finch', 'Isabella Fontana', 'Arthur Pendelton', 'Camilla Zhang',
  'Felix Beauchamp', 'Tariq Mansoor', 'Genevieve Croft', 'Marcus Aurelius Vance',
  'Penelope Sinclair', 'Xavier Lindqvist', 'Soren Bergstrom', 'Natasha Romanova',
  'Lucien Chen', 'Chloe Rothschild', 'Damian Cross', 'Astrid Lindholm',
  'Valentin Petrov', 'Solomon Gold', 'Balthazar King', 'Beatrix Von Hapsburg',
  'Gideon Pierce', 'Frederik Van Der Bilt', 'Seraphina Mercer', 'Orion Blackwood',
  'Thaddeus Vance', 'Corinne Dubois', 'Lucian Drake', 'Arabella Montgomery',
  'Cassandra Vane', 'Leopold Sterling', 'Raphael Santos', 'Katarina Novak',
  'Nikolai Volkov', 'Evander Kane', 'Sebastian Rossi', 'Matteo Ricci',
  'Dmitri Belov', 'Magnus Eriksson', 'Olivier Laurent', 'Siddharth Patel',
  'Henrik Larsson', 'Vincent Vega', 'Lorenzo Medici', 'Hugo Bossman',
  'Archibald Crane', 'Talia Al-Saud', 'Christian Grey-Wolf', 'Jasper Vance',
  'Evangeline St. Claire', 'Montgomery Burns-Jr', 'Preston Hollow', 'Sterling Archer-Pound',
  'Godfrey Wellington', 'Octavius Prince', 'Baron Von Richthofen', 'Lord Percival Graves',
  'Duchess Genevieve', 'Countess Delphine', 'Magnate Thorne', 'Emir Faisal',
  'Donovan Blake', 'Augustus Sterling', 'Alonso De Mendoza', 'Gulliver Vance'
];

const INDUSTRIES: ('Tech' | 'Finance' | 'Real Estate' | 'Luxury & Fashion' | 'Energy' | 'Automotive' | 'Diversified')[] = [
  'Tech', 'Finance', 'Real Estate', 'Luxury & Fashion', 'Energy', 'Automotive', 'Diversified'
];

const SOURCES_MAP: Record<string, string[]> = {
  Tech: ['Quantum Cloud Infrastructure', 'Autonomous Drone Logistics', 'SaaS Enterprise Platforms', 'Quantum Computing Clusters', 'Cyber Defense Firewalls'],
  Finance: ['Private Equity Buyout Funds', 'Sovereign Debt Arbitrage', 'High-Yield Credit Syndication', 'Commercial Asset Management', 'Venture Capital Portfolios'],
  'Real Estate': ['Manhattan Class-A Skyscrapers', 'Global Luxury Hotel Chains', 'Suburban Multifamily REITs', 'Deepwater Marina Compounds', 'Logistics Warehouses'],
  'Luxury & Fashion': ['Haute Horlogerie Swiss Watches', 'Superyacht Shipyards', 'Champagne Grand Crus', 'Fine Jewelry & Diamonds', 'Exotic Leather Goods'],
  Energy: ['Offshore Wind Turbines', 'Geothermal Clean Wells', 'Liquid Natural Gas Terminals', 'Lithium Battery Refining', 'Nuclear SMR Generation'],
  Automotive: ['Hypercar Carbon Monocoques', 'Commercial EV Trucking', 'Formula 1 Racing Teams', 'Autonomous Robotaxi Fleets'],
  Diversified: ['Global Conglomerates', 'Commodity Trading Houses', 'Industrial Robotics & Steel', 'Media & Broadcasting Networks']
};

const COUNTRIES = [
  { country: 'USA', flag: '🇺🇸' },
  { country: 'United Kingdom', flag: '🇬🇧' },
  { country: 'Switzerland', flag: '🇨🇭' },
  { country: 'Monaco', flag: '🇲🇨' },
  { country: 'Singapore', flag: '🇸🇬' },
  { country: 'UAE', flag: '🇦🇪' },
  { country: 'Germany', flag: '🇩🇪' },
  { country: 'Japan', flag: '🇯🇵' },
  { country: 'France', flag: '🇫🇷' },
  { country: 'Canada', flag: '🇨🇦' },
  { country: 'Hong Kong', flag: '🇭🇰' },
  { country: 'Australia', flag: '🇦🇺' },
];

/**
 * Generates the Farbes 100 Richest List.
 * #1 is Elon Tusk at $2,000,000,000,000 ($2 Trillion).
 * #100 is worth exactly $300,000,000 ($300 Million).
 * Smooth exponential Pareto curve: W(r) = W_100 * (W_1 / W_100) ^ ((100 - r) / 99)
 */
export function generateFarbes100(): FarbesBillionaire[] {
  const topWealth = 2000000000000; // $2 Trillion
  const bottomWealth = 300000000;  // $300 Million
  const list: FarbesBillionaire[] = [];

  for (let r = 1; r <= 100; r++) {
    // Exponential curve
    const exponent = (100 - r) / 99;
    const rawWealth = bottomWealth * Math.pow(topWealth / bottomWealth, exponent);
    // Round to 3 significant digits for realism
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawWealth)) - 2);
    const wealth = Math.round(rawWealth / magnitude) * magnitude;

    let info: { name: string; wealthSource: string; industry: any; country: string; flag: string; bio: string };

    if (r === 1) {
      info = NOTABLE_NAMES[0]; // Elon Tusk
    } else if (r - 1 < NOTABLE_NAMES.length) {
      info = NOTABLE_NAMES[r - 1];
    } else {
      const nameIndex = (r - NOTABLE_NAMES.length - 1) % SECONDARY_NAMES.length;
      const name = SECONDARY_NAMES[nameIndex];
      const industry = INDUSTRIES[(r * 7) % INDUSTRIES.length];
      const sources = SOURCES_MAP[industry];
      const source = sources[(r * 3) % sources.length];
      const countryObj = COUNTRIES[(r * 5) % COUNTRIES.length];

      info = {
        name,
        wealthSource: source,
        industry,
        country: countryObj.country,
        flag: countryObj.flag,
        bio: `Self-made titan dominating ${industry.toLowerCase()} and strategic commercial assets across ${countryObj.country}.`
      };
    }

    const changePercent = Number(((Math.sin(r * 12.3) * 2.8) + (r % 3 === 0 ? 0.8 : -0.4)).toFixed(2));

    list.push({
      rank: r,
      name: info.name,
      netWorth: r === 1 ? topWealth : (r === 100 ? bottomWealth : wealth),
      wealthSource: info.wealthSource,
      industry: info.industry,
      country: info.country,
      flag: info.flag,
      changePercent,
      bio: info.bio
    });
  }

  return list;
}

export const FARBES_100_CACHE = generateFarbes100();
export const FARBES_TOP_100 = FARBES_100_CACHE;

export function getFarbesListWithPlayer(playerName: string, playerNetWorth: number): (FarbesBillionaire & { source: string; avatarEmoji: string })[] {
  const baseList = FARBES_100_CACHE.map((item) => ({
    ...item,
    source: item.wealthSource,
    avatarEmoji: item.flag,
  }));

  const cutoff = 300000000;
  if (playerNetWorth < cutoff) {
    return baseList;
  }

  // Insert player at proper rank
  const playerItem = {
    rank: 101,
    name: playerName,
    netWorth: playerNetWorth,
    wealthSource: 'Hustle Empire Enterprise Holdings',
    source: 'Hustle Empire Enterprise Holdings',
    industry: 'Diversified' as const,
    country: 'USA',
    flag: '👑',
    avatarEmoji: '👑',
    changePercent: 5.2,
    bio: 'Rising real estate mogul and diversified conglomerate tycoon climbing the global ranks.',
    isPlayer: true,
  };

  const combined = [...baseList, playerItem];
  combined.sort((a, b) => b.netWorth - a.netWorth);

  // Take top 100 and re-rank
  const sliced = combined.slice(0, 100);
  return sliced.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
