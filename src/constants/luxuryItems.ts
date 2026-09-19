export interface LuxuryItem {
  id: string;
  name: string;
  category: 'supercar' | 'jet' | 'yacht' | 'vip_estate';
  gemPrice: number;
  cashEquivalent: number;
  image: string;
  reputationBonus: number;
  comfortBonus: number;
  description: string;
  perks: string[];
  isGemOnly: boolean;
}

export const LUXURY_ITEMS: LuxuryItem[] = [
  // Supercars
  {
    id: 'car_apex_gt',
    name: 'Apex GT Carbon Hypercar',
    category: 'supercar',
    gemPrice: 50,
    cashEquivalent: 1850000,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
    reputationBonus: 15,
    comfortBonus: 20,
    description: 'Bespoke carbon-fiber monocoque quad-turbo engine with 1,200 HP. Turns heads at every boardroom valet.',
    perks: ['Travel Energy Cost reduced to 0⚡', '+15 Citywide Reputation', 'Zero commute delay'],
    isGemOnly: true,
  },
  {
    id: 'car_bugatti_chiron',
    name: 'Bugatti Chiron Pur Sport',
    category: 'supercar',
    gemPrice: 100,
    cashEquivalent: 3800000,
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80',
    reputationBonus: 25,
    comfortBonus: 25,
    description: '1,500 horsepower French hyper-sport benchmark. Top speed 304 mph with bespoke titanium exhaust.',
    perks: ['Permanent +25 Reputation', 'Travel Energy Cost = 0⚡', 'VIP Club Valet Privileges'],
    isGemOnly: true,
  },
  {
    id: 'car_koenigsegg_jesko',
    name: 'Koenigsegg Jesko Absolut',
    category: 'supercar',
    gemPrice: 150,
    cashEquivalent: 4600000,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    reputationBonus: 35,
    comfortBonus: 30,
    description: 'Swedish engineering masterpiece. 1,600 HP on E85 biofuel with 9-speed Light Speed Transmission.',
    perks: ['Permanent +35 Reputation', 'Instant Global Travel in Phone', 'Unlocks Farbes Top 100 Status'],
    isGemOnly: true,
  },

  // Private Jets
  {
    id: 'jet_gulfstream_g700',
    name: 'Gulfstream G700 SkyMaster Jet',
    category: 'jet',
    gemPrice: 200,
    cashEquivalent: 22000000,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    reputationBonus: 40,
    comfortBonus: 35,
    description: 'Ultra-long-range executive flagship jet with master bedroom suite, conference dining, and Ka-band satellite Wi-Fi.',
    perks: ['+40 Reputation', 'Instant Intercity Deal Access', 'All Energy Restored +100% when sleeping on board'],
    isGemOnly: true,
  },
  {
    id: 'jet_concorde_supersonic',
    name: 'Mach-2 Concorde Supersonic Private Jet',
    category: 'jet',
    gemPrice: 350,
    cashEquivalent: 65000000,
    image: 'https://images.unsplash.com/photo-1508672019048-805b876b67e2?auto=format&fit=crop&w=600&q=80',
    reputationBonus: 60,
    comfortBonus: 45,
    description: 'Fly across oceans at Mach 2.04 twice the speed of sound. The absolute apex of private executive aviation.',
    perks: ['+60 Global Reputation', '100% Tax Advantage Exemption', 'Elite Farbes Status Recognition'],
    isGemOnly: true,
  },

  // Superyachts
  {
    id: 'yacht_monaco_160',
    name: 'Monaco Sovereign 160ft Ocean Cruiser',
    category: 'yacht',
    gemPrice: 250,
    cashEquivalent: 38000000,
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=600&q=80',
    reputationBonus: 50,
    comfortBonus: 40,
    description: 'Tri-deck motor yacht featuring beach club deck, infinity pool, helipad, and private Michelin-star chef quarters.',
    perks: ['+50 Reputation', 'Host VIP Moguls: Business Revenue +20%', 'Luxury Comfort Tier Maxed'],
    isGemOnly: true,
  },
  {
    id: 'yacht_imperial_horizon_300',
    name: 'Imperial Horizon 320ft Mega Yacht',
    category: 'yacht',
    gemPrice: 500,
    cashEquivalent: 140000000,
    image: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=600&q=80',
    reputationBonus: 75,
    comfortBonus: 50,
    description: 'The premier floating palace. Two helipads, submarine tender bay, 20 guest suites, and armored satellite defenses.',
    perks: ['+75 Reputation', 'Global Billionaire Club Immortality', 'Daily +$10,000 passive charter revenue'],
    isGemOnly: true,
  },
];

// VIP Club Properties
export const VIP_EXCLUSIVE_PROPERTIES = [
  {
    id: 'prop_vip_skyline_penthouse',
    address: '1000 Billionaires Row, Penthouse 88',
    neighborhood: 'Downtown VIP Zone',
    askingPrice: 8500000,
    gemPrice: 120,
    currentValue: 8500000,
    estimatedRent: 65000,
    monthlyExpenses: 4500,
    overallCondition: 98,
    daysOnMarket: 2,
    isOwned: false,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    areas: [
      { id: 'roof', name: 'Private Helipad & Sky Deck', condition: 100, repairCost: 0, diySkillReq: 4, diyEnergyCost: 20 },
      { id: 'kitchen', name: 'Gaggenau Chef Galley', condition: 98, repairCost: 0, diySkillReq: 3, diyEnergyCost: 20 },
      { id: 'bathroom', name: 'Calacatta Marble Spa Bathrooms', condition: 98, repairCost: 0, diySkillReq: 3, diyEnergyCost: 20 },
      { id: 'electrical', name: 'Smart Home Automation & Backup Generator', condition: 100, repairCost: 0, diySkillReq: 4, diyEnergyCost: 15 },
      { id: 'plumbing', name: 'Filtration & Infinity Pool Plumbing', condition: 96, repairCost: 0, diySkillReq: 4, diyEnergyCost: 20 },
      { id: 'flooring', name: 'Chevron French Oak & Brass Inlay', condition: 98, repairCost: 0, diySkillReq: 2, diyEnergyCost: 15 },
      { id: 'exterior', name: 'Floor-to-Ceiling Thermal Glass Curtain', condition: 100, repairCost: 0, diySkillReq: 2, diyEnergyCost: 15 },
    ],
    collectedRentUnclaimed: 0,
    isVipExclusive: true,
  },
  {
    id: 'prop_vip_beverly_crest',
    address: '1 Royal Crest Way',
    neighborhood: 'Diamond Heights VIP',
    askingPrice: 18500000,
    gemPrice: 220,
    currentValue: 18500000,
    estimatedRent: 135000,
    monthlyExpenses: 8200,
    overallCondition: 100,
    daysOnMarket: 1,
    isOwned: false,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    areas: [
      { id: 'roof', name: 'Solar Slate & Tennis Observatory', condition: 100, repairCost: 0, diySkillReq: 4, diyEnergyCost: 20 },
      { id: 'kitchen', name: 'Dual Commercial Catering Kitchens', condition: 100, repairCost: 0, diySkillReq: 3, diyEnergyCost: 20 },
      { id: 'bathroom', name: '8 En-Suite Luxury Marble Baths', condition: 100, repairCost: 0, diySkillReq: 3, diyEnergyCost: 20 },
      { id: 'electrical', name: 'Substation & Microgrid Solar Batteries', condition: 100, repairCost: 0, diySkillReq: 4, diyEnergyCost: 15 },
      { id: 'plumbing', name: 'Olympic Lap Pool & Waterfalls', condition: 100, repairCost: 0, diySkillReq: 4, diyEnergyCost: 20 },
      { id: 'flooring', name: 'Imported Carrara Stone & Ebony Wood', condition: 100, repairCost: 0, diySkillReq: 2, diyEnergyCost: 15 },
      { id: 'exterior', name: '10-Acre Gated Grounds & Olive Groves', condition: 100, repairCost: 0, diySkillReq: 2, diyEnergyCost: 15 },
    ],
    collectedRentUnclaimed: 0,
    isVipExclusive: true,
  },
  {
    id: 'prop_vip_aerotech_tower',
    address: '500 Skyline Boulevard',
    neighborhood: 'Financial Core VIP',
    askingPrice: 42000000,
    gemPrice: 400,
    currentValue: 42000000,
    estimatedRent: 320000,
    monthlyExpenses: 22000,
    overallCondition: 99,
    daysOnMarket: 5,
    isOwned: false,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    areas: [
      { id: 'roof', name: 'Dual Rooftop Helipads', condition: 100, repairCost: 0, diySkillReq: 4, diyEnergyCost: 20 },
      { id: 'kitchen', name: 'Executive Sky Club & Dining Lounge', condition: 100, repairCost: 0, diySkillReq: 3, diyEnergyCost: 20 },
      { id: 'bathroom', name: '32 Commercial Restroom Suites', condition: 98, repairCost: 0, diySkillReq: 3, diyEnergyCost: 20 },
      { id: 'electrical', name: 'Redundant Fiber & Server Power Banks', condition: 100, repairCost: 0, diySkillReq: 4, diyEnergyCost: 15 },
      { id: 'plumbing', name: 'High-Pressure Fire Suppression Risers', condition: 99, repairCost: 0, diySkillReq: 4, diyEnergyCost: 20 },
      { id: 'flooring', name: 'Class-A Terrazzo Lobby & Granite Suites', condition: 100, repairCost: 0, diySkillReq: 2, diyEnergyCost: 15 },
      { id: 'exterior', name: 'High-Strength Aerodynamic Titanium Facade', condition: 100, repairCost: 0, diySkillReq: 2, diyEnergyCost: 15 },
    ],
    collectedRentUnclaimed: 0,
    isVipExclusive: true,
  }
];
