export type DayPhase = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface SkillProgress {
  level: number;
  xp: number;
  xpToNext: number;
}

export type SkillName = 
  | 'handyman'
  | 'sales'
  | 'negotiation'
  | 'finance'
  | 'business'
  | 'marketing'
  | 'management'
  | 'realEstate'
  | 'technology';

export interface PlayerSkills {
  handyman: SkillProgress;
  sales: SkillProgress;
  negotiation: SkillProgress;
  finance: SkillProgress;
  business: SkillProgress;
  marketing: SkillProgress;
  management: SkillProgress;
  realEstate: SkillProgress;
  technology: SkillProgress;
}

export interface PlayerProfile {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  cash: number;
  energy: number;
  maxEnergy: number;
  creditScore: number;
  reputation: number; // 0 to 100
  housingTier: number; // 1 to 9
  transportationTier: number; // 1 to 9
  foodTier: number; // 1 to 4
  daysPlayed: number;
  currentHour: number; // 6 to 24 (6:00 AM to midnight)
  currentMinute: number; // 0 to 59
  dayOfWeek: number; // 0=Sunday, 1=Monday, ...
  skills: PlayerSkills;
  selectedGoalId?: string;
  unlockedFeatures: string[];
  gems: number; // Premium currency for Store & Paystack purchases
  consecutiveOnTimePayments: number; // Payment history streak for credit growth
  totalOnTimePayments: number;
  missedPaymentsCount: number;
  education: string[]; // List of completed degrees / certifications (e.g. 'edu_trade_cert', 'edu_cs_bachelor')
  activeWeeklyJobId?: string; // ID of current weekly salaried career position
  weeklyJobDaysRemaining?: number; // Days until next weekly paycheck (0-6)
  annualIncomeEarned: number; // Income accumulated this year for 30% tax calculation
  accumulatedTaxOwed: number; // Pending annual tax bill
  lastTaxYearPaid: number; // Last in-game year (e.g. 1, 2) tax was filed
  hasPropertyManagerPass: boolean; // Monthly pass subscription ($4.99-$9.99/mo)
  propertyManagerPassDaysRemaining?: number; // Days remaining on pass
  hasVipClubAccess: boolean; // VIP club access for private auctions & exclusive properties
  ownedLuxuryItems: string[]; // IDs of owned supercars, private supersonic jets, mega yachts
}

export interface TaxYearRecord {
  year: number;
  grossIncome: number;
  taxRate: number; // 0.30 (30%)
  taxAmountOwed: number;
  taxPaid: number;
  isExempted: boolean;
  exemptionReason?: string;
  filedOnDay: number;
}

export interface BankAccount {
  id: 'checking' | 'savings' | 'emergency';
  name: string;
  balance: number;
  interestRate: number; // Annual percentage yield e.g. 0.045
}

export interface CreditCard {
  id: string;
  name: string;
  tier: number;
  limit: number;
  balance: number;
  interestRate: number; // e.g. 0.22 (22% APR)
  rewardsRate: number; // e.g. 0.02 (2% cashback)
  unlocked: boolean;
  minPayment: number;
}

export interface Loan {
  id: string;
  name: string;
  type: 'personal' | 'business' | 'mortgage' | 'auto';
  principal: number;
  remainingBalance: number;
  interestRate: number;
  monthlyPayment: number;
  monthsRemaining: number;
  paymentsMade: number;
  nextPaymentDueDay: number;
  collateralPropertyId?: string;
  financedItemName?: string;
  missedPayment?: boolean;
}

export interface JobOpportunity {
  id: string;
  title: string;
  category: 'manual' | 'delivery' | 'sales' | 'tech' | 'management';
  description: string;
  payType?: 'instant' | 'weekly'; // Instant gig vs weekly salaried job
  weeklySalary?: number; // Salaried payout every 7 in-game days
  weeklyEnergyCost?: number; // Weekly stamina / energy upkeep cost
  energyCost: number;
  timeMinutes: number;
  payoutBase: number;
  bonusTipMax?: number;
  requiredSkill?: { skill: SkillName; minLevel: number };
  requiredTransportTier?: number;
  requiredEducation?: { id: string; name: string };
  skillRewards: { skill: SkillName; xp: number }[];
  xpReward: number;
  icon: string;
}

export interface EducationCourse {
  id: string;
  name: string;
  degreeType: 'Certificate' | 'Associate' | 'Bachelor' | 'Master' | 'License';
  institution: string;
  cost: number;
  energyCost: number;
  timeMinutes: number;
  description: string;
  skillsBoosted: { skill: SkillName; xp: number; label: string }[];
  unlocksJobsSummary: string;
  prerequisiteEduId?: string;
  prerequisiteEduName?: string;
  minPlayerLevel?: number;
  icon: string;
}

export interface BusinessEmployee {
  id: string;
  name: string;
  role: string;
  skillLevel: number;
  salaryMonthly: number;
  productivity: number; // 0.5 to 1.5
  morale: number; // 0 to 100
}

export interface BusinessContract {
  id: string;
  clientName: string;
  rewardMonthly: number;
  durationMonths: number;
  monthsRemaining: number;
  reputationReq: number;
}

export interface Business {
  id: string;
  typeId: string;
  name: string;
  category: string;
  revenueMonthly: number;
  expensesMonthly: number;
  customersCount: number;
  reputation: number; // 0 to 100
  officeTier: number; // 1 to 5
  equipmentValue: number;
  employees: BusinessEmployee[];
  contracts: BusinessContract[];
  priceMultiplier: number; // 0.8 to 1.5
  marketingBudgetMonthly: number;
  treasury: number; // Corporate treasury cash reserves available for withdraw/deposit
}

export type PropertyAreaId = 
  | 'roof'
  | 'kitchen'
  | 'bathroom'
  | 'electrical'
  | 'plumbing'
  | 'flooring'
  | 'exterior';

export interface PropertyArea {
  id: PropertyAreaId;
  name: string;
  condition: number; // 0 to 100%
  repairCost: number;
  diySkillReq: number; // handyman skill level needed
  diyEnergyCost: number;
}

export interface Tenant {
  id: string;
  name: string;
  type: 'Student' | 'Young Professional' | 'Family' | 'Retiree' | 'Corporate';
  monthlyBudget: number;
  reliability: number; // 0 to 100% (likelihood of timely pay)
  satisfaction: number; // 0 to 100%
  leaseMonths: number;
  depositPaid: number;
  agreedRent: number;
}

export interface Property {
  id: string;
  address: string;
  neighborhood: string;
  askingPrice: number;
  currentValue: number;
  estimatedRent: number;
  overallCondition: number; // Average of areas
  areas: PropertyArea[];
  image: string;
  isOwned: boolean;
  purchasePrice?: number;
  mortgage?: Loan;
  tenant?: Tenant;
  collectedRentUnclaimed: number;
  monthlyExpenses: number; // Taxes, insurance, HOA
  daysOnMarket: number;
  isWatchlist?: boolean;
  isVipExclusive?: boolean;
  gemPrice?: number;
}

export interface PropertyAuction {
  id: string;
  property: Property;
  currentBid: number;
  highestBidder: string;
  secondsRemaining: number;
  isPlayerWinning: boolean;
  bidsHistory: { bidder: string; amount: number; time: string }[];
  active: boolean;
}

export type AssetCategory = 'index' | 'bluechip' | 'growth' | 'penny' | 'reit';

export interface StockHolding {
  stockId: string;
  shares: number;
  avgBuyPrice: number;
}

export interface StockItem {
  id: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  price: number;
  previousClose: number;
  changePercent: number;
  dividendYield: number; // e.g. 0.035
  volatility: number; // 0.01 to 0.15
  history: number[]; // Last 20 price points
  sector: string;
  description: string;
  isWatchlist?: boolean;
}

export interface NewsItem {
  id: string;
  day: number;
  title: string;
  source: string;
  category: 'stocks' | 'property' | 'economy' | 'business' | 'local';
  content: string;
  reliability?: number; // e.g. 65% for rumors
  impactNote?: string;
  targetStockIds?: string[];
  targetNeighborhoods?: string[];
  priceMultiplier?: number;
  isRead?: boolean;
}

export interface LifeEventChoice {
  id: string;
  label: string;
  description: string;
  cost?: number;
  energyChange?: number;
  reputationChange?: number;
  outcomeText: string;
  skillBonus?: { skill: SkillName; xp: number };
  moneyBonus?: number;
  requiredSkill?: { skill: SkillName; minLevel: number };
}

export interface LifeEvent {
  id: string;
  title: string;
  category: 'rental' | 'life' | 'business' | 'opportunity';
  description: string;
  choices: LifeEventChoice[];
  propertyId?: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: 'hustle' | 'finance' | 'property' | 'skill';
  currentProgress: number;
  targetGoal: number;
  completed: boolean;
  claimed: boolean;
  rewardCash: number;
  rewardXp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDay?: number;
  rewardXp: number;
}

export interface Goal {
  id: string;
  title: string;
  targetValue: number;
  type: 'networth' | 'cash' | 'properties' | 'credit' | 'businesses';
  rewardTitle: string;
}

export interface ActionFeedbackItem {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'info' | 'error';
  details?: string[];
}

export interface SaveSlotMeta {
  slotId: 1 | 2 | 3;
  isEmpty: boolean;
  playerName: string;
  daysPlayed: number;
  level: number;
  netWorth: number;
  cash: number;
  creditScore: number;
  housingTier: number;
  housingName: string;
  gems: number;
  lastSaved: number; // timestamp
}

export type PhoneAppId = 
  | 'home' 
  | 'stocks' 
  | 'bank' 
  | 'scanner' 
  | 'auctions' 
  | 'farbes' 
  | 'vip' 
  | 'jobs' 
  | 'finance'
  | 'taktak'
  | 'sgram'
  | 'news';

export interface SocialProfile {
  taktakFollowers: number;
  taktakLikes: number;
  sgramFollowers: number;
  sgramPostsCount: number;
  isVerified: boolean;
  unclaimedCreatorEarnings: number;
}
