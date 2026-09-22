import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import {
  PlayerProfile,
  JobOpportunity,
  Property,
  StockItem,
  StockHolding,
  NewsItem,
  DailyMission,
  Achievement,
  Goal,
  ActionFeedbackItem,
  BankAccount,
  CreditCard,
  Loan,
  Business,
  LifeEvent,
  PropertyAuction,
  SkillName,
  PropertyAreaId,
  Tenant,
  SaveSlotMeta,
  EducationCourse,
  TaxYearRecord,
  PhoneAppId,
  SocialProfile,
  DailySummaryReport,
} from '../types/game';
import { LUXURY_ITEMS } from '../constants/luxuryItems';
import {
  INITIAL_PLAYER,
  HOUSING_TIERS,
  TRANSPORTATION_TIERS,
  MEAL_TIERS,
  INITIAL_JOBS,
  EDUCATION_COURSES,
  INITIAL_STOCKS,
  INITIAL_PROPERTIES_MARKET,
  INITIAL_ACHIEVEMENTS,
  INITIAL_GOALS,
  NEIGHBORHOODS,
  AI_OPPONENTS,
  BUSINESS_TEMPLATES,
} from '../constants/gameData';
import {
  getAllSlotsMeta,
  getSlotStorageKey,
  updateSlotMeta,
  deleteSlotData,
  getRecentSlotId,
  setRecentSlotId,
} from '../utils/saveSlots';
import { getDayName } from '../utils/formatters';

interface GameContextType {
  player: PlayerProfile;
  bankAccounts: BankAccount[];
  creditCards: CreditCard[];
  loans: Loan[];
  availableJobs: JobOpportunity[];
  educationCourses: EducationCourse[];
  ownedBusinesses: Business[];
  marketProperties: Property[];
  ownedProperties: Property[];
  stocks: StockItem[];
  portfolio: StockHolding[];
  newsFeed: NewsItem[];
  dailyMissions: DailyMission[];
  achievements: Achievement[];
  goals: Goal[];
  currentEvent: LifeEvent | null;
  activeAuction: PropertyAuction | null;
  feedbackQueue: ActionFeedbackItem[];
  activeTab: 'hustle' | 'properties' | 'finance' | 'market' | 'self';
  tutorialStep: number;
  autoCollectRentUnlocked: boolean;
  netWorth: number;
  totalDebt: number;
  monthlyIncome: number;
  monthlyExpenses: number;

  // Save Slots Management
  activeSlotId: (1 | 2 | 3) | null;
  slotsMeta: SaveSlotMeta[];
  startNewGameInSlot: (slotId: 1 | 2 | 3, playerName: string, startingBonus?: 'energy' | 'cash' | 'credit') => void;
  loadGameSlot: (slotId: 1 | 2 | 3) => void;
  deleteGameSlot: (slotId: 1 | 2 | 3) => void;
  exitToMainMenu: () => void;
  manualSave: () => void;
  refreshSlotsMeta: () => void;

  // Actions
  setActiveTab: (tab: 'hustle' | 'properties' | 'finance' | 'market' | 'self') => void;
  advanceTime: (minutes: number) => void;
  doJob: (jobId: string) => boolean;
  enrollInEducation: (courseId: string) => boolean;
  eatMeal: (tier: number) => boolean;
  sleep: () => void;
  takeNap: () => void;
  upgradeHousing: (tier: number) => boolean;
  buyTransportation: (tier: number) => boolean;
  financeVehicle: (tier: number) => boolean;
  
  // Banking & Debt
  openBankAccount: () => boolean;
  depositBank: (accountId: 'checking' | 'savings', amount: number) => boolean;
  withdrawBank: (accountId: 'checking' | 'savings', amount: number) => boolean;
  payCreditCard: (cardId: string, amount: number) => boolean;
  applyCreditCard: (tier: number) => boolean;
  takeLoan: (type: 'personal' | 'business' | 'mortgage', amount: number, termMonths: number) => boolean;
  payLoan: (loanId: string, amount: number) => boolean;
  payMonthlyLoanDue: (loanId: string) => boolean;
  fileBankruptcyRebuild: () => void;

  // Premium Store & Paystack
  isStoreModalOpen: boolean;
  setIsStoreModalOpen: (open: boolean) => void;
  buyGemsWithPaystack: (gemAmount: number, reference: string) => void;
  exchangeGemsForCash: (gemCost: number, cashAmount: number) => boolean;
  useGemPerk: (perkId: string) => boolean;

  // Stocks
  buyStock: (stockId: string, shares: number) => boolean;
  sellStock: (stockId: string, shares: number) => boolean;
  toggleWatchlistStock: (stockId: string) => void;

  // Properties & Real Estate
  buyProperty: (propertyId: string, offerPrice: number, downPaymentPercent: number, loanTermYears: number) => boolean;
  renovatePropertyArea: (propertyId: string, areaId: PropertyAreaId, method: 'diy' | 'contractor') => boolean;
  setTenantToProperty: (propertyId: string, tenant: Tenant) => boolean;
  evictTenant: (propertyId: string) => void;
  collectRent: (propertyId?: string) => void;
  toggleWatchlistProperty: (propertyId: string) => void;
  startAuction: (propertyId: string) => void;
  bidInAuction: (amount: number) => void;
  closeAuction: () => void;
  unlockAutoCollectManager: () => boolean;

  // Subscriptions, VIP Club, Luxury & Taxes
  subscribePropertyManagerPass: (method: 'gems' | 'cash') => boolean;
  unlockVipClubAccess: (method: 'gems' | 'cash') => boolean;
  buyLuxuryItem: (itemId: string) => boolean;
  buyPropertyWithGems: (propertyId: string) => boolean;
  payYearlyTaxBill: () => boolean;
  taxRecords: TaxYearRecord[];
  currentYearGrossIncome: number;
  estimatedYearlyTaxOwed: number;

  // Businesses
  startBusiness: (typeId: string, name: string) => boolean;
  depositToBusiness: (businessId: string, amount: number) => boolean;
  withdrawFromBusiness: (businessId: string, amount: number) => boolean;
  hireEmployee: (businessId: string, role: string, salary: number) => boolean;
  fireEmployee: (businessId: string, empId: string) => void;
  upgradeBusinessOffice: (businessId: string) => boolean;
  boostBusinessMarketing: (businessId: string, amount: number) => boolean;
  adjustBusinessPricing: (businessId: string, multiplier: number) => void;

  // Weekly Career Jobs
  applyWeeklyJob: (jobId: string) => boolean;
  quitWeeklyJob: () => void;

  // In-App iPhone
  isPhoneOpen: boolean;
  setIsPhoneOpen: (open: boolean) => void;
  phoneActiveApp: PhoneAppId;
  setPhoneActiveApp: (app: PhoneAppId) => void;
  openPhoneApp: (app: PhoneAppId) => void;

  // Social Media (TakTak & SGram)
  socialProfile: SocialProfile;
  addSocialFollowers: (network: 'taktak' | 'sgram', followers: number, likes?: number) => void;
  claimCreatorEarnings: () => boolean;
  spendEnergy: (amount: number) => boolean;
  earnCash: (amount: number, reason?: string) => void;

  // Events & Missions & System
  chooseEventOption: (choiceId: string) => void;
  claimMissionReward: (missionId: string) => void;
  setSelectedGoal: (goalId: string) => void;
  dismissFeedback: (id: string) => void;
  setTutorialStep: (step: number) => void;
  resetGame: () => void;
  triggerFeedback: (text: string, type?: 'success' | 'warning' | 'info' | 'error', details?: string[]) => void;

  // Day Simulation & Daily Summary
  dailySummary: DailySummaryReport | null;
  isDailySummaryOpen: boolean;
  setIsDailySummaryOpen: (open: boolean) => void;
  simulateNextDay: () => void;

  // Admin & God Mode Control
  setPlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  setCreditCards: React.Dispatch<React.SetStateAction<CreditCard[]>>;
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  setOwnedProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  setMarketProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  setOwnedBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  setAutoCollectRentUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const LOCAL_STORAGE_KEY = 'hustle_empire_sim_state_v1';

function getInitialSlotSession(): (1 | 2 | 3) | null {
  try {
    const savedSession = localStorage.getItem('hustle_sim_current_session_slot');
    if (savedSession) {
      const id = parseInt(savedSession, 10);
      if (id === 1 || id === 2 || id === 3) {
        const meta = getAllSlotsMeta();
        const target = meta.find((s) => s.slotId === id);
        if (target && !target.isEmpty) {
          return id as 1 | 2 | 3;
        }
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function getSlotStorageValue<T>(slotId: (1 | 2 | 3) | null, key: string, fallback: T): T {
  if (!slotId) return fallback;
  try {
    const raw = localStorage.getItem(getSlotStorageKey(slotId, key));
    if (raw !== null && raw !== undefined) {
      return JSON.parse(raw);
    }
  } catch {}
  return fallback;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Save Slot & Menu system with persistent session auto-restore
  const initialRestoredSlot = useMemo(() => getInitialSlotSession(), []);
  const [activeSlotId, setActiveSlotId] = useState<(1 | 2 | 3) | null>(initialRestoredSlot);
  const isSlotLoadedRef = useRef<boolean>(initialRestoredSlot !== null);
  const [slotsMeta, setSlotsMeta] = useState<SaveSlotMeta[]>(() => getAllSlotsMeta());

  const refreshSlotsMeta = useCallback(() => {
    setSlotsMeta(getAllSlotsMeta());
  }, []);

  // Load initial state from active slot (if restored) or defaults
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'player', INITIAL_PLAYER);
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'bank', [
      { id: 'checking', name: 'Standard Checking', balance: 0, interestRate: 0.001 },
      { id: 'savings', name: 'High-Yield Savings (HYSA)', balance: 0, interestRate: 0.045 },
    ]);
  });

  const [creditCards, setCreditCards] = useState<CreditCard[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'cards', [
      {
        id: 'card_starter',
        name: 'FreshStart Secured Card',
        tier: 1,
        limit: 500,
        balance: 0,
        interestRate: 0.24,
        rewardsRate: 0.0,
        unlocked: true,
        minPayment: 25,
      },
      {
        id: 'card_silver',
        name: 'Silver Freedom Card',
        tier: 2,
        limit: 2500,
        balance: 0,
        interestRate: 0.19,
        rewardsRate: 0.015,
        unlocked: false,
        minPayment: 50,
      },
      {
        id: 'card_gold',
        name: 'Apex Gold Preferred',
        tier: 3,
        limit: 10000,
        balance: 0,
        interestRate: 0.15,
        rewardsRate: 0.03,
        unlocked: false,
        minPayment: 150,
      },
      {
        id: 'card_black',
        name: 'Centurion Obsidian Reserve',
        tier: 4,
        limit: 50000,
        balance: 0,
        interestRate: 0.11,
        rewardsRate: 0.05,
        unlocked: false,
        minPayment: 500,
      },
    ]);
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'loans', []);
  });

  const [availableJobs, setAvailableJobs] = useState<JobOpportunity[]>(INITIAL_JOBS);
  const [educationCourses] = useState<EducationCourse[]>(EDUCATION_COURSES);
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'businesses', []);
  });

  const [marketProperties, setMarketProperties] = useState<Property[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'props_market', INITIAL_PROPERTIES_MARKET);
  });

  const [ownedProperties, setOwnedProperties] = useState<Property[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'props_owned', []);
  });

  const [stocks, setStocks] = useState<StockItem[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'stocks', INITIAL_STOCKS);
  });

  const [portfolio, setPortfolio] = useState<StockHolding[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'portfolio', []);
  });

  const [newsFeed, setNewsFeed] = useState<NewsItem[]>(() => {
    return [
      {
        id: 'news_init_1',
        day: 1,
        title: 'Municipal Transit Upgrade Announced for Riverside',
        source: 'City Herald',
        category: 'property',
        content: 'City council approves preliminary route expansion. Housing analysts project increased rental demand along the eastern perimeter.',
        impactNote: 'Riverside real estate and construction demand likely to strengthen.',
        targetNeighborhoods: ['Riverside'],
        priceMultiplier: 1.05,
      },
      {
        id: 'news_init_2',
        day: 1,
        title: 'MegaCore Technologies Explores East District AI Campus',
        source: 'Financial Express',
        category: 'stocks',
        content: 'Rumors swirl that tech giant MegaCore is scouting 50,000 sq ft office space. East District properties and MGC stock seeing early trader enthusiasm.',
        reliability: 75,
        targetStockIds: ['stock_mgc', 'stock_ubd'],
        targetNeighborhoods: ['East District'],
      },
    ];
  });

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    return [
      {
        id: 'm1',
        title: 'Work Ethic',
        description: 'Complete 2 hustle gig shifts today',
        category: 'hustle',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        claimed: false,
        rewardCash: 60,
        rewardXp: 40,
      },
      {
        id: 'm2',
        title: 'Capital Preservation',
        description: 'Have at least $250 in cash or bank savings',
        category: 'finance',
        currentProgress: 100,
        targetGoal: 250,
        completed: false,
        claimed: false,
        rewardCash: 40,
        rewardXp: 30,
      },
      {
        id: 'm3',
        title: 'Market Observer',
        description: 'View and analyze 2 properties in the market',
        category: 'property',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        claimed: false,
        rewardCash: 50,
        rewardXp: 35,
      },
    ];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    return getSlotStorageValue(initialRestoredSlot, 'achievements', INITIAL_ACHIEVEMENTS);
  });

  const [goals] = useState<Goal[]>(INITIAL_GOALS);
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [activeAuction, setActiveAuction] = useState<PropertyAuction | null>(null);
  const [feedbackQueue, setFeedbackQueue] = useState<ActionFeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'hustle' | 'properties' | 'finance' | 'market' | 'self'>('hustle');
  const [tutorialStep, setTutorialStep] = useState<number>(() => {
    if (!initialRestoredSlot) return 1;
    try {
      const saved = localStorage.getItem(getSlotStorageKey(initialRestoredSlot, 'tutorial'));
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });
  const [autoCollectRentUnlocked, setAutoCollectRentUnlocked] = useState<boolean>(() => {
    if (!initialRestoredSlot) return false;
    try {
      return localStorage.getItem(getSlotStorageKey(initialRestoredSlot, 'autocollect')) === 'true';
    } catch {
      return false;
    }
  });
  const [isStoreModalOpen, setIsStoreModalOpen] = useState<boolean>(false);
  const [dailySummary, setDailySummary] = useState<DailySummaryReport | null>(null);
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState<boolean>(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [phoneActiveApp, setPhoneActiveApp] = useState<PhoneAppId>('home');

  const openPhoneApp = useCallback((app: PhoneAppId) => {
    setPhoneActiveApp(app);
    setIsPhoneOpen(true);
  }, []);

  // In-game social media profile (TakTak & SGram) - starts from 0 followers & 0 likes
  const [socialProfile, setSocialProfile] = useState<SocialProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_social');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it was the legacy initial template with 150/420, reset to 0
        if (parsed.taktakFollowers === 150 && parsed.sgramFollowers === 420) {
          return {
            taktakFollowers: 0,
            taktakLikes: 0,
            sgramFollowers: 0,
            sgramPostsCount: 0,
            isVerified: false,
            unclaimedCreatorEarnings: 0,
          };
        }
        return parsed;
      }
      return {
        taktakFollowers: 0,
        taktakLikes: 0,
        sgramFollowers: 0,
        sgramPostsCount: 0,
        isVerified: false,
        unclaimedCreatorEarnings: 0,
      };
    } catch {
      return {
        taktakFollowers: 0,
        taktakLikes: 0,
        sgramFollowers: 0,
        sgramPostsCount: 0,
        isVerified: false,
        unclaimedCreatorEarnings: 0,
      };
    }
  });

  const addSocialFollowers = useCallback((network: 'taktak' | 'sgram', followers: number, likes: number = 0) => {
    setSocialProfile((prev) => {
      const next = {
        ...prev,
        taktakFollowers: network === 'taktak' ? prev.taktakFollowers + followers : prev.taktakFollowers,
        taktakLikes: network === 'taktak' ? prev.taktakLikes + likes : prev.taktakLikes,
        sgramFollowers: network === 'sgram' ? prev.sgramFollowers + followers : prev.sgramFollowers,
        sgramPostsCount: network === 'sgram' ? prev.sgramPostsCount + 1 : prev.sgramPostsCount,
        isVerified: prev.isVerified || (prev.taktakFollowers + prev.sgramFollowers + followers > 50000),
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY + '_social', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const claimCreatorEarnings = useCallback(() => {
    if (socialProfile.unclaimedCreatorEarnings <= 0) return false;
    const amount = socialProfile.unclaimedCreatorEarnings;
    setPlayer((prev) => ({ ...prev, cash: prev.cash + amount }));
    setSocialProfile((prev) => {
      const updated = { ...prev, unclaimedCreatorEarnings: 0 };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY + '_social', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    return true;
  }, [socialProfile.unclaimedCreatorEarnings]);

  const spendEnergy = useCallback((amount: number): boolean => {
    let success = false;
    setPlayer((prev) => {
      if (prev.energy < amount) {
        success = false;
        return prev;
      }
      success = true;
      return { ...prev, energy: Math.max(0, prev.energy - amount) };
    });
    return success;
  }, []);

  const earnCash = useCallback((amount: number, reason?: string) => {
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash + amount,
      annualIncomeEarned: (prev.annualIncomeEarned || 0) + amount,
    }));
  }, []);

  const [taxRecords, setTaxRecords] = useState<TaxYearRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_taxes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Pop up banner disabled per user request
  const triggerFeedback = useCallback((_text: string, _type: 'success' | 'warning' | 'info' | 'error' = 'success', _details?: string[]) => {
    // No pop-up banners after action or text completions
  }, []);

  const dismissFeedback = (_id: string) => {
    setFeedbackQueue([]);
  };

  // Derived financial metrics
  const totalBankBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalStockValue = portfolio.reduce((sum, h) => {
    const s = stocks.find((item) => item.id === h.stockId);
    return sum + (s ? s.price * h.shares : 0);
  }, 0);
  const totalPropertyValue = ownedProperties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalBusinessValue = ownedBusinesses.reduce((sum, b) => sum + (b.revenueMonthly * 12 + b.equipmentValue + (b.treasury || 0)), 0);

  // Total Luxury Asset Value (Supercars, Supersonic Jets, Mega Yachts)
  const totalLuxuryValue = (player.ownedLuxuryItems || []).reduce((sum, id) => {
    const item = LUXURY_ITEMS.find((l) => l.id === id);
    return sum + (item ? item.cashEquivalent : 0);
  }, 0);

  const totalCreditDebt = creditCards.reduce((sum, c) => sum + c.balance, 0);
  const totalLoanDebt = loans.reduce((sum, l) => sum + l.remainingBalance, 0);
  const totalDebt = totalCreditDebt + totalLoanDebt;

  const netWorth = player.cash + totalBankBalance + totalStockValue + totalPropertyValue + totalBusinessValue + totalLuxuryValue - totalDebt;

  // Monthly income & expenses estimation
  const monthlyRentalIncome = ownedProperties.reduce((sum, p) => sum + (p.tenant ? p.tenant.agreedRent : 0), 0);
  const monthlyBusinessProfits = ownedBusinesses.reduce((sum, b) => sum + Math.max(0, b.revenueMonthly - b.expensesMonthly), 0);
  const currentWeeklyJob = availableJobs.find((j) => j.id === player.activeWeeklyJobId);
  const monthlySalaryIncome = currentWeeklyJob?.weeklySalary ? Math.round(currentWeeklyJob.weeklySalary * 4.33) : 0;
  const monthlyIncome = monthlyRentalIncome + monthlyBusinessProfits + monthlySalaryIncome;

  const housingCost = HOUSING_TIERS.find((h) => h.tier === player.housingTier)?.costMonthly || 0;
  const transportCost = (TRANSPORTATION_TIERS.find((t) => t.tier === player.transportationTier)?.dailyCost || 0) * 30;
  const debtPayments = loans.reduce((sum, l) => sum + l.monthlyPayment, 0) + creditCards.reduce((sum, c) => sum + c.minPayment, 0);
  // Property Manager Pass grants 75% maintenance cost reduction
  const maintenanceMultiplier = player.hasPropertyManagerPass ? 0.25 : 1.0;
  const propertyExpenses = Math.round(ownedProperties.reduce((sum, p) => sum + p.monthlyExpenses, 0) * maintenanceMultiplier);
  const monthlyExpenses = housingCost + transportCost + debtPayments + propertyExpenses;

  // Tax Tracking Metrics
  const currentYearGrossIncome = player.annualIncomeEarned || 0;
  const estimatedYearlyTaxOwed = player.hasPropertyManagerPass ? 0 : Math.round(currentYearGrossIncome * 0.30);

  // Synchronize active slot state with LocalStorage and update slot metadata
  useEffect(() => {
    if (activeSlotId === null || !isSlotLoadedRef.current) return;
    try {
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'player'), JSON.stringify(player));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'bank'), JSON.stringify(bankAccounts));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'cards'), JSON.stringify(creditCards));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'loans'), JSON.stringify(loans));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'businesses'), JSON.stringify(ownedBusinesses));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'props_market'), JSON.stringify(marketProperties));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'props_owned'), JSON.stringify(ownedProperties));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'stocks'), JSON.stringify(stocks));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'portfolio'), JSON.stringify(portfolio));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'achievements'), JSON.stringify(achievements));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'dailyMissions'), JSON.stringify(dailyMissions));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'newsFeed'), JSON.stringify(newsFeed));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'tutorial'), tutorialStep.toString());
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'autocollect'), autoCollectRentUnlocked ? 'true' : 'false');

      const housing = HOUSING_TIERS.find((h) => h.tier === player.housingTier);
      const updatedMeta = updateSlotMeta(activeSlotId, {
        isEmpty: false,
        playerName: player.name,
        daysPlayed: player.daysPlayed,
        level: player.level,
        netWorth,
        cash: player.cash,
        creditScore: player.creditScore,
        housingTier: player.housingTier,
        housingName: housing?.name || "Mom's Couch",
      });
      setSlotsMeta(updatedMeta);
    } catch {
      // Ignore quota error
    }
  }, [
    activeSlotId,
    player,
    bankAccounts,
    creditCards,
    loans,
    ownedBusinesses,
    marketProperties,
    ownedProperties,
    stocks,
    portfolio,
    achievements,
    dailyMissions,
    newsFeed,
    tutorialStep,
    autoCollectRentUnlocked,
    netWorth,
  ]);

  // Helper to add XP and handle level up
  const addPlayerXP = useCallback((xpAmount: number) => {
    setPlayer((prev) => {
      let newXp = prev.xp + xpAmount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;
      const unlocked = [...prev.unlockedFeatures];

      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.round(newXpToNext * 1.35);

        // Feature unlock logic
        if (newLevel >= 2 && !unlocked.includes('bank')) unlocked.push('bank');
        if (newLevel >= 3 && !unlocked.includes('transport')) unlocked.push('transport');
        if (newLevel >= 5 && !unlocked.includes('stocks')) unlocked.push('stocks');
        if (newLevel >= 7 && !unlocked.includes('microbusiness')) unlocked.push('microbusiness');
        if (newLevel >= 10 && !unlocked.includes('credit')) unlocked.push('credit');
        if (newLevel >= 12 && !unlocked.includes('propertyScanner')) unlocked.push('propertyScanner');
        if (newLevel >= 15 && !unlocked.includes('mortgage')) unlocked.push('mortgage');
        if (newLevel >= 18 && !unlocked.includes('renovation')) unlocked.push('renovation');
        if (newLevel >= 20 && !unlocked.includes('rentalManager')) unlocked.push('rentalManager');
        if (newLevel >= 30 && !unlocked.includes('auctions')) unlocked.push('auctions');

        triggerFeedback(`🎉 Level Up! You reached Level ${newLevel}!`, 'info', [
          `Max Energy +5`,
          `Check new unlocks in your dashboard!`,
        ]);
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNext: newXpToNext,
        maxEnergy: 100 + (newLevel - 1) * 2,
        unlockedFeatures: unlocked,
      };
    });
  }, [triggerFeedback]);

  // Helper to add skill XP
  const addSkillXP = useCallback((skillName: SkillName, xpAmount: number) => {
    setPlayer((prev) => {
      const current = prev.skills[skillName];
      let newXp = current.xp + xpAmount;
      let newLevel = current.level;
      let newXpToNext = current.xpToNext;

      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.round(newXpToNext * 1.4);
        triggerFeedback(`Skill Increased: ${skillName.toUpperCase()} reached Level ${newLevel}!`, 'info');
      }

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [skillName]: {
            level: newLevel,
            xp: newXp,
            xpToNext: newXpToNext,
          },
        },
      };
    });
  }, [triggerFeedback]);

  // Check achievements automatically
  useEffect(() => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.unlocked) return ach;
        let shouldUnlock = false;

        if (ach.id === 'ach_first_dollar' && player.cash >= 100) shouldUnlock = true;
        if (ach.id === 'ach_credit_builder' && player.creditScore >= 650) shouldUnlock = true;
        if (ach.id === 'ach_first_stock' && portfolio.length > 0) shouldUnlock = true;
        if (ach.id === 'ach_first_business' && ownedBusinesses.length > 0) shouldUnlock = true;
        if (ach.id === 'ach_first_key' && ownedProperties.length > 0) shouldUnlock = true;
        if (ach.id === 'ach_landlord' && ownedProperties.some((p) => p.tenant !== undefined)) shouldUnlock = true;
        if (ach.id === 'ach_diversified' && portfolio.length > 0 && ownedProperties.length > 0 && ownedBusinesses.length > 0) shouldUnlock = true;
        if (ach.id === 'ach_millionaire' && netWorth >= 1000000) shouldUnlock = true;

        if (shouldUnlock) {
          triggerFeedback(`🏆 Achievement Unlocked: ${ach.title}!`, 'success', [ach.description, `+${ach.rewardXp} XP`]);
          addPlayerXP(ach.rewardXp);
          return { ...ach, unlocked: true, unlockedDay: player.daysPlayed };
        }
        return ach;
      })
    );
  }, [player.cash, player.creditScore, player.daysPlayed, portfolio.length, ownedBusinesses.length, ownedProperties, netWorth, addPlayerXP, triggerFeedback]);

  // Daily tick & Market cycle logic
  const triggerNewDayCycle = useCallback(() => {
    // 1. Advance day & process Property Manager Pass & Yearly 30% Taxes
    setPlayer((prev) => {
      const nextDay = prev.daysPlayed + 1;
      const newPassDays = prev.propertyManagerPassDaysRemaining ? prev.propertyManagerPassDaysRemaining - 1 : 0;
      const hasPass = Boolean(prev.hasPropertyManagerPass && newPassDays > 0);
      let newCash = prev.cash;
      let newAnnualIncome = prev.annualIncomeEarned || 0;
      let newAccumulatedTax = prev.accumulatedTaxOwed || 0;
      let newLastTaxYearPaid = prev.lastTaxYearPaid || 0;

      // Daily manager stipend if pass is active: +$2,500
      if (hasPass) {
        newCash += 2500;
        newAnnualIncome += 2500;
      }

      // Check yearly tax cycle: every 360 days (Day 360, Day 720, etc.)
      const isYearEnd = nextDay > 0 && nextDay % 360 === 0;
      if (isYearEnd) {
        const currentYear = Math.floor(nextDay / 360);
        const taxRate = 0.30;
        const taxAmount = Math.round(newAnnualIncome * taxRate);

        if (hasPass) {
          // 100% Tax Exemption with Property Manager Pass!
          setTaxRecords((oldRecords) => [
            {
              year: currentYear,
              grossIncome: newAnnualIncome,
              taxRate,
              taxAmountOwed: taxAmount,
              taxPaid: 0,
              isExempted: true,
              exemptionReason: 'Property Manager Pass Active',
              filedOnDay: nextDay,
            },
            ...oldRecords,
          ]);
        } else {
          // Standard 30% IRS income tax
          let paidNow = 0;
          let unpaid = 0;
          if (newCash >= taxAmount) {
            newCash -= taxAmount;
            paidNow = taxAmount;
          } else {
            paidNow = Math.max(0, newCash);
            unpaid = taxAmount - paidNow;
            newCash = 0;
            newAccumulatedTax += unpaid;
          }

          setTaxRecords((oldRecords) => [
            {
              year: currentYear,
              grossIncome: newAnnualIncome,
              taxRate,
              taxAmountOwed: taxAmount,
              taxPaid: paidNow,
              isExempted: false,
              filedOnDay: nextDay,
            },
            ...oldRecords,
          ]);
        }
        newAnnualIncome = 0; // reset gross income for the new fiscal year
        newLastTaxYearPaid = currentYear;
      }

      return {
        ...prev,
        daysPlayed: nextDay,
        dayOfWeek: (prev.dayOfWeek + 1) % 7,
        currentHour: 7,
        currentMinute: 0,
        cash: newCash,
        annualIncomeEarned: newAnnualIncome,
        accumulatedTaxOwed: newAccumulatedTax,
        lastTaxYearPaid: newLastTaxYearPaid,
        hasPropertyManagerPass: hasPass,
        propertyManagerPassDaysRemaining: newPassDays,
      };
    });

    // 2. Fluctuating stock market prices
    setStocks((prevStocks) =>
      prevStocks.map((stock) => {
        // Random price movement based on volatility (-volatility to +volatility with slight upward drift)
        const drift = 0.005;
        const changePercent = (Math.random() * 2 - 0.95) * stock.volatility * 100;
        const newPrice = Math.max(0.5, Number((stock.price * (1 + changePercent / 100 + drift)).toFixed(2)));
        const newHistory = [...stock.history.slice(-19), newPrice];

        return {
          ...stock,
          previousClose: stock.price,
          price: newPrice,
          changePercent: Number(((newPrice - stock.price) / stock.price * 100).toFixed(2)),
          history: newHistory,
        };
      })
    );

    // 3. Businesses daily revenue generation (Accrues to corporate treasury)
    if (ownedBusinesses.length > 0) {
      setOwnedBusinesses((prev) =>
        prev.map((b) => {
          const dailyRevenue = Math.round((b.revenueMonthly / 30) * (0.85 + Math.random() * 0.3));
          const dailyExpense = Math.round(b.expensesMonthly / 30);
          const profit = dailyRevenue - dailyExpense;
          const currentTreasury = b.treasury ?? 15000;
          const newTreasury = Math.max(0, currentTreasury + profit);
          return {
            ...b,
            treasury: newTreasury,
          };
        })
      );
    }

    // 3b. Weekly salaried career payroll
    setPlayer((prevPlayer) => {
      if (!prevPlayer.activeWeeklyJobId) return prevPlayer;
      const job = availableJobs.find((j) => j.id === prevPlayer.activeWeeklyJobId);
      if (!job || job.payType !== 'weekly' || !job.weeklySalary) return prevPlayer;

      const daysRemaining = (prevPlayer.weeklyJobDaysRemaining ?? 7) - 1;
      if (daysRemaining <= 0) {
        // Payday!
        const salary = job.weeklySalary;
        const energyCost = job.weeklyEnergyCost || 35;
        const newEnergy = Math.max(10, prevPlayer.energy - energyCost);
        triggerFeedback(`Weekly Payday: +$${salary.toLocaleString()}`, 'success', [
          `Role: ${job.title}`,
          `Energy Upkeep: -${energyCost}⚡`,
          `Check your wallet for funds!`,
        ]);
        return {
          ...prevPlayer,
          cash: prevPlayer.cash + salary,
          annualIncomeEarned: (prevPlayer.annualIncomeEarned || 0) + salary,
          energy: newEnergy,
          weeklyJobDaysRemaining: 7,
        };
      } else {
        return {
          ...prevPlayer,
          weeklyJobDaysRemaining: daysRemaining,
        };
      }
    });

    // 4. Rent accrual on properties
    let autoCollectedRent = 0;
    setOwnedProperties((prevProps) =>
      prevProps.map((p) => {
        if (!p.tenant) return p;
        // Tenant pays daily micro-rent or chance to pay
        const dailyRent = Math.round(p.tenant.agreedRent / 30);
        if (autoCollectRentUnlocked || player.hasPropertyManagerPass) {
          autoCollectedRent += dailyRent;
          return p;
        } else {
          return {
            ...p,
            collectedRentUnclaimed: (p.collectedRentUnclaimed || 0) + dailyRent,
          };
        }
      })
    );

    if (autoCollectedRent > 0) {
      setPlayer((pState) => ({
        ...pState,
        cash: pState.cash + autoCollectedRent,
        annualIncomeEarned: (pState.annualIncomeEarned || 0) + autoCollectedRent,
      }));
    }

    // 5. Generate a fresh news item periodically
    const newsTopics = [
      {
        title: 'Southside Tech Incubator Breaks Ground',
        source: 'Metro Tribune',
        category: 'property' as const,
        content: 'City grants fuel contractor activity. Southside rentals expected to climb over coming quarters.',
        targetNeighborhoods: ['Southside'],
      },
      {
        title: 'GreenGrid Wins Multi-State Grid Transmission Contract',
        source: 'Green Energy Insider',
        category: 'stocks' as const,
        content: 'Shares surged in pre-market trading as analysts boost price targets.',
        targetStockIds: ['stock_gge'],
      },
      {
        title: 'Central Bank Holds Interest Rates Stable',
        source: 'National Reserve Monitor',
        category: 'economy' as const,
        content: 'Mortgage borrowing costs remain favorable for active property buyers.',
      },
      {
        title: 'FreshMart Reports Record Quarter With Automation Boost',
        source: 'Retail Weekly',
        category: 'stocks' as const,
        content: 'Higher gross margins lead to unexpected cash dividend payout.',
        targetStockIds: ['stock_fmt'],
      },
    ];
    const pickedNews = newsTopics[Math.floor(Math.random() * newsTopics.length)];
    setNewsFeed((prev) => [
      {
        id: 'news_' + Date.now(),
        day: player.daysPlayed + 1,
        title: pickedNews.title,
        source: pickedNews.source,
        category: pickedNews.category,
        content: pickedNews.content,
        targetStockIds: pickedNews.targetStockIds,
        targetNeighborhoods: pickedNews.targetNeighborhoods,
      },
      ...prev.slice(0, 15),
    ]);

    // 6. Reset daily missions
    setDailyMissions([
      {
        id: 'm_hustle_' + Date.now(),
        title: 'Daily Hustle Push',
        description: 'Complete 2 work shifts today',
        category: 'hustle',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        claimed: false,
        rewardCash: 75,
        rewardXp: 45,
      },
      {
        id: 'm_finance_' + Date.now(),
        title: 'Liquidity Milestone',
        description: 'Maintain over $500 total liquid reserves',
        category: 'finance',
        currentProgress: player.cash >= 500 ? 500 : player.cash,
        targetGoal: 500,
        completed: player.cash >= 500,
        claimed: false,
        rewardCash: 50,
        rewardXp: 35,
      },
      {
        id: 'm_skill_' + Date.now(),
        title: 'Self Improvement',
        description: 'Gain any skill XP through work or renovations',
        category: 'skill',
        currentProgress: 0,
        targetGoal: 15,
        completed: false,
        claimed: false,
        rewardCash: 60,
        rewardXp: 50,
      },
    ]);

    // 7. Random tenant or life event chance (25% chance)
    if (Math.random() < 0.28 && ownedProperties.some((p) => p.tenant)) {
      const propWithTenant = ownedProperties.find((p) => p.tenant)!;
      setCurrentEvent({
        id: 'event_leak_' + Date.now(),
        title: `Maintenance Call: ${propWithTenant.address}`,
        category: 'rental',
        description: `${propWithTenant.tenant?.name} reports a sudden leaky water valve in the master bathroom. Ignoring this will degrade condition and tenant satisfaction.`,
        propertyId: propWithTenant.id,
        choices: [
          {
            id: 'diy_repair',
            label: 'Fix It Yourself ($40 + 25 Energy)',
            description: 'Pack your toolkit and fix the valve on-site.',
            cost: 40,
            energyChange: -25,
            outcomeText: 'You tightened the coupling and sealed the line! Tenant is relieved.',
            skillBonus: { skill: 'handyman', xp: 20 },
          },
          {
            id: 'hire_pro',
            label: 'Hire Emergency Plumber ($160)',
            description: 'Dispatch a local licensed plumber immediately.',
            cost: 160,
            energyChange: 0,
            outcomeText: 'The emergency plumber fixed the leak with zero hassle to your schedule.',
            reputationChange: 3,
          },
          {
            id: 'ignore_it',
            label: 'Defer until next month ($0)',
            description: 'Tell tenant to place a bucket underneath.',
            cost: 0,
            energyChange: 0,
            outcomeText: 'The leak seeped into the flooring. Tenant satisfaction plummeted -25%!',
            reputationChange: -10,
          },
        ],
      });
    }

    // 8. Monthly Credit Bureau Evaluation (Every 30 Days)
    // Credit does NOT increase passively every day. It grows from taking loans, financing cars,
    // and paying scheduled installments on time.
    if (player.daysPlayed > 0 && player.daysPlayed % 30 === 0) {
      setPlayer((prev) => {
        let creditDelta = 0;

        // Credit utilization factor
        const totalCardLimit = creditCards.filter(c => c.unlocked).reduce((sum, c) => sum + c.limit, 0);
        const cardUtilization = totalCardLimit > 0 ? (totalCreditDebt / totalCardLimit) : 0;

        if (totalCreditDebt === 0 && prev.consecutiveOnTimePayments > 0) {
          // Clean record maintenance
          creditDelta += 1;
        } else if (cardUtilization > 0.85) {
          // Severe over-utilization penalty
          creditDelta -= 6;
        } else if (cardUtilization < 0.30 && totalCreditDebt > 0) {
          // Responsible low revolving utilization
          creditDelta += 2;
        }

        return {
          ...prev,
          creditScore: Math.min(850, Math.max(300, prev.creditScore + creditDelta)),
        };
      });
    }

  }, [ownedBusinesses, ownedProperties, autoCollectRentUnlocked, player.daysPlayed, player.cash, totalCreditDebt]);

  // Advance time helper
  const advanceTime = useCallback((minutes: number) => {
    setPlayer((prev) => {
      let newMinute = prev.currentMinute + minutes;
      let newHour = prev.currentHour + Math.floor(newMinute / 60);
      newMinute = newMinute % 60;

      if (newHour >= 24) {
        // Automatically wake up / rollover
        setTimeout(() => triggerNewDayCycle(), 100);
        return {
          ...prev,
          currentHour: 7,
          currentMinute: 0,
          energy: Math.min(prev.maxEnergy, prev.energy + 40),
        };
      }

      return {
        ...prev,
        currentHour: newHour,
        currentMinute: newMinute,
      };
    });
  }, [triggerNewDayCycle]);

  // Do Job
  const doJob = (jobId: string): boolean => {
    const job = availableJobs.find((j) => j.id === jobId);
    if (!job) return false;

    if (player.energy < job.energyCost) {
      triggerFeedback('Not enough energy! Eat a meal or rest first.', 'warning');
      return false;
    }

    // Transport check
    if (job.requiredTransportTier && player.transportationTier < job.requiredTransportTier) {
      triggerFeedback(`Requires higher transportation (Tier ${job.requiredTransportTier})!`, 'warning');
      return false;
    }

    // Skill requirement check
    if (job.requiredSkill) {
      const currentLevel = player.skills[job.requiredSkill.skill].level;
      if (currentLevel < job.requiredSkill.minLevel) {
        triggerFeedback(`Requires ${job.requiredSkill.skill.toUpperCase()} Level ${job.requiredSkill.minLevel}!`, 'warning');
        return false;
      }
    }

    // Education requirement check
    if (job.requiredEducation) {
      const hasEducation = (player.education || []).includes(job.requiredEducation.id);
      if (!hasEducation) {
        triggerFeedback(`Requires Degree: ${job.requiredEducation.name}! Enroll in education courses to qualify.`, 'warning');
        return false;
      }
    }

    // Payout calculation with sales/negotiation skill bonus
    const negotiationBonus = 1 + (player.skills.negotiation.level - 1) * 0.05;
    const tipChance = 0.35 + player.skills.sales.level * 0.05;
    const tip = Math.random() < tipChance ? Math.round(Math.random() * (job.bonusTipMax || 10)) : 0;
    const totalPayout = Math.round(job.payoutBase * negotiationBonus + tip);

    // Apply state changes
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash + totalPayout,
      annualIncomeEarned: (prev.annualIncomeEarned || 0) + totalPayout,
      energy: Math.max(0, prev.energy - job.energyCost),
    }));

    advanceTime(job.timeMinutes);
    addPlayerXP(job.xpReward);

    job.skillRewards.forEach((sr) => {
      addSkillXP(sr.skill, sr.xp);
    });

    // Daily missions progress
    setDailyMissions((prev) =>
      prev.map((m) => {
        if (m.category === 'hustle' && !m.completed) {
          const next = m.currentProgress + 1;
          return { ...m, currentProgress: next, completed: next >= m.targetGoal };
        }
        if (m.category === 'skill' && !m.completed) {
          const next = m.currentProgress + (job.skillRewards[0]?.xp || 10);
          return { ...m, currentProgress: next, completed: next >= m.targetGoal };
        }
        return m;
      })
    );

    // Feedback
    const details = [
      `+$${totalPayout}${tip > 0 ? ` (incl. $${tip} tip!)` : ''}`,
      `⚡ -${job.energyCost} Energy`,
      `+${job.xpReward} XP`,
      ...job.skillRewards.map((sr) => `${sr.skill.toUpperCase()} +${sr.xp} XP`),
    ];
    triggerFeedback(`Shift Completed: ${job.title}`, 'success', details);

    // Advance tutorial if on step 1
    if (tutorialStep === 1) {
      setTutorialStep(2);
    }

    return true;
  };

  // Enroll in Education / Degree Program
  const enrollInEducation = (courseId: string): boolean => {
    const course = educationCourses.find((c) => c.id === courseId);
    if (!course) {
      triggerFeedback('Education course not found.', 'warning');
      return false;
    }

    if ((player.education || []).includes(course.id)) {
      triggerFeedback(`You have already graduated with: ${course.name}!`, 'info');
      return false;
    }

    if (course.prerequisiteEduId && !(player.education || []).includes(course.prerequisiteEduId)) {
      triggerFeedback(
        course.prerequisiteEduName || 'Prerequisite education required before enrolling!',
        'warning'
      );
      return false;
    }

    if (course.minPlayerLevel && player.level < course.minPlayerLevel) {
      triggerFeedback(`Requires Player Level ${course.minPlayerLevel} to enroll in ${course.name}!`, 'warning');
      return false;
    }

    if (player.cash < course.cost) {
      triggerFeedback(
        `Tuition costs $${course.cost.toLocaleString()}. You need $${(course.cost - player.cash).toLocaleString()} more.`,
        'warning'
      );
      return false;
    }

    if (player.energy < course.energyCost) {
      triggerFeedback(
        `Need ${course.energyCost} Energy to complete coursework! Eat a meal or rest first.`,
        'warning'
      );
      return false;
    }

    // Deduct tuition cost, deduct energy, record degree
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - course.cost,
      energy: Math.max(0, prev.energy - course.energyCost),
      education: [...(prev.education || []), course.id],
    }));

    // Advance game time
    advanceTime(course.timeMinutes);

    // Boost Player XP
    addPlayerXP(Math.round(course.cost * 0.05) + 30);

    // Substantially boost skills!
    course.skillsBoosted.forEach((sb) => {
      addSkillXP(sb.skill, sb.xp);
    });

    const skillDetails = course.skillsBoosted.map((sb) => sb.label);
    triggerFeedback(
      `🎓 Graduated: ${course.name}!`,
      'success',
      [`-$${course.cost.toLocaleString()} Tuition`, `⚡ -${course.energyCost} Energy`, ...skillDetails]
    );

    return true;
  };

  // Eat Meal
  const eatMeal = (tier: number): boolean => {
    const meal = MEAL_TIERS.find((m) => m.tier === tier);
    if (!meal) return false;

    if (player.cash < meal.cost) {
      triggerFeedback('Not enough cash to buy this meal!', 'warning');
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - meal.cost,
      energy: Math.min(prev.maxEnergy, prev.energy + meal.energyRestored),
    }));

    advanceTime(20);
    triggerFeedback(`Ate ${meal.name}`, 'success', [`-$${meal.cost}`, `⚡ +${meal.energyRestored} Energy`]);
    return true;
  };

  // Take a Nap
  const takeNap = () => {
    if (player.energy >= player.maxEnergy) {
      triggerFeedback('You are already fully energized!', 'info');
      return;
    }
    const currentHousing = HOUSING_TIERS.find((h) => h.tier === player.housingTier)!;
    const energyGain = Math.round(currentHousing.energyRestBonus * 0.35);

    setPlayer((prev) => ({
      ...prev,
      energy: Math.min(prev.maxEnergy, prev.energy + energyGain),
    }));
    advanceTime(90);
    triggerFeedback('Took a quick power nap', 'info', [`⚡ +${energyGain} Energy recovered`, 'Time: 1h 30m']);
  };

  // Simulate Day & Daily Summary Modal matching Tycoon Simulation
  const simulateNextDay = useCallback(() => {
    const startingCash = player.cash;
    const currentHousing = HOUSING_TIERS.find((h) => h.tier === player.housingTier) || HOUSING_TIERS[0];
    const currentTrans = TRANSPORTATION_TIERS.find((t) => t.tier === player.transportationTier) || TRANSPORTATION_TIERS[0];

    // Business revenue & expenses
    let bizRev = 0;
    let bizWages = 0;
    let bizRent = 0;
    let bizMarketing = 0;
    ownedBusinesses.forEach((b) => {
      const dailyRev = Math.round((b.revenueMonthly / 30) * (0.85 + Math.random() * 0.3));
      bizRev += dailyRev;
      const employeePayroll = (b.employees || []).reduce((acc, emp) => acc + (emp.salaryMonthly || 0), 0);
      bizWages += Math.round(employeePayroll / 30);
      bizRent += Math.round((b.expensesMonthly * 0.4) / 30);
      bizMarketing += Math.round((b.marketingBudgetMonthly || (b.expensesMonthly * 0.2)) / 30);
    });

    // Property rental income
    let propRent = 0;
    ownedProperties.forEach((p) => {
      if (p.tenant) {
        propRent += Math.round(p.tenant.agreedRent / 30);
      }
    });

    // Salaried Job (if employed)
    let jobIncome = 0;
    const activeJob = availableJobs.find((j) => j.id === player.activeWeeklyJobId);
    if (activeJob && activeJob.weeklySalary) {
      jobIncome = Math.round(activeJob.weeklySalary / 7);
    }

    const totalRevenue = bizRev + propRent + jobIncome;
    const employeeWages = bizWages;
    const buildingRent = Math.max(10, Math.round(currentHousing.costMonthly / 30));
    const marketing = bizMarketing;
    const hqRent = bizRent;
    const vehicleMaintenance = currentTrans.cost > 0 ? Math.round(15 + currentTrans.tier * 12) : 0;

    const totalExpenses = employeeWages + buildingRent + marketing + hqRent + vehicleMaintenance;
    const netProfit = totalRevenue - totalExpenses;
    const cashChange = netProfit;
    const endingCash = Math.max(0, startingCash + cashChange);

    const revenueDetails = [
      ...(bizRev > 0 ? [{ label: 'Enterprise Commercial Revenue', amount: bizRev }] : []),
      ...(propRent > 0 ? [{ label: 'Real Estate Tenant Leases', amount: propRent }] : []),
      ...(jobIncome > 0 ? [{ label: 'Salaried Career & Hustle', amount: jobIncome }] : []),
    ];

    const nextDayNumber = player.daysPlayed + 1;
    const nextDayName = getDayName(player.dayOfWeek + 1);

    const summaryReport: DailySummaryReport = {
      day: nextDayNumber,
      dayName: nextDayName,
      revenue: totalRevenue,
      revenueDetails: revenueDetails.length > 0 ? revenueDetails : [{ label: 'Primary Hustle Earnings', amount: totalRevenue }],
      employeeWages,
      buildingRent,
      marketing,
      hqRent,
      vehicleMaintenance,
      netProfit,
      startingCash,
      cashChange,
      endingCash,
      bonusPercent: 20,
    };

    setDailySummary(summaryReport);
    setIsDailySummaryOpen(true);

    const energyRecovered = currentHousing.energyRestBonus;
    setPlayer((prev) => ({
      ...prev,
      cash: endingCash,
      energy: Math.min(prev.maxEnergy, energyRecovered),
    }));

    triggerFeedback('Simulated Next Day', 'info', [
      `Woke up at 7:00 AM • Day ${nextDayNumber}`,
      `⚡ Energy restored to ${Math.min(player.maxEnergy, energyRecovered)}`,
    ]);

    triggerNewDayCycle();
  }, [player, ownedBusinesses, ownedProperties, availableJobs, triggerNewDayCycle, triggerFeedback]);

  // Full Sleep - forwards to simulateNextDay
  const sleep = () => {
    simulateNextDay();
  };

  // Upgrade Housing
  const upgradeHousing = (tier: number): boolean => {
    const targetHousing = HOUSING_TIERS.find((h) => h.tier === tier);
    if (!targetHousing) return false;

    // Check purchase price if tier 6+
    if (targetHousing.purchasePrice > 0) {
      if (player.cash < targetHousing.purchasePrice) {
        triggerFeedback(`Need ${targetHousing.purchasePrice.toLocaleString()} to purchase this home outright!`, 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash - targetHousing.purchasePrice,
        housingTier: tier,
        reputation: Math.min(100, prev.reputation + 15),
      }));
    } else {
      if (player.cash < targetHousing.costMonthly) {
        triggerFeedback(`Need $${targetHousing.costMonthly} first month security deposit!`, 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash - targetHousing.costMonthly,
        housingTier: tier,
        reputation: Math.min(100, prev.reputation + 5),
      }));
    }

    addPlayerXP(100);
    triggerFeedback(`Moved to ${targetHousing.name}!`, 'success', [
      `Comfort: ${targetHousing.comfort}%`,
      `Overnight Energy: ${targetHousing.energyRestBonus}`,
    ]);
    return true;
  };

  // Buy Transportation outright
  const buyTransportation = (tier: number): boolean => {
    const target = TRANSPORTATION_TIERS.find((t) => t.tier === tier);
    if (!target) return false;

    if (player.cash < target.cost) {
      triggerFeedback(`Need $${target.cost} to acquire ${target.name}!`, 'warning');
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - target.cost,
      transportationTier: tier,
      reputation: Math.min(100, prev.reputation + tier * 2),
    }));

    addPlayerXP(50);
    triggerFeedback(`Acquired ${target.name}!`, 'success', [
      `Travel Speed: ${target.speedMultiplier}x`,
      `Unlocks higher distance gigs & logistics!`,
    ]);
    return true;
  };

  // Finance Vehicle (Auto Loan)
  const financeVehicle = (tier: number): boolean => {
    const target = TRANSPORTATION_TIERS.find((t) => t.tier === tier);
    if (!target || !target.canFinance) return false;

    const minScore = target.minCreditScore || 580;
    if (player.creditScore < minScore) {
      triggerFeedback(`Financing Declined: Requires ${minScore}+ Credit Score (Current: ${player.creditScore})`, 'warning');
      return false;
    }

    const downPercent = target.downPaymentPercent || 0.20;
    const downPayment = Math.round(target.cost * downPercent);
    if (player.cash < downPayment) {
      triggerFeedback(`Need $${downPayment.toLocaleString()} for the ${Math.round(downPercent * 100)}% down payment!`, 'warning');
      return false;
    }

    const financedPrincipal = target.cost - downPayment;
    const termMonths = target.financeTermMonths || 36;
    
    // Competitive APR scaled by credit rating tier
    const apr = player.creditScore >= 750 ? 0.055 : player.creditScore >= 680 ? 0.075 : player.creditScore >= 620 ? 0.11 : player.creditScore >= 580 ? 0.15 : 0.19;
    const monthlyRate = apr / 12;
    const monthlyPayment = Math.round(
      (financedPrincipal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
    );

    const autoLoan: Loan = {
      id: 'auto_' + Date.now(),
      name: `Auto Finance: ${target.name}`,
      type: 'auto',
      principal: financedPrincipal,
      remainingBalance: financedPrincipal,
      interestRate: apr,
      monthlyPayment,
      monthsRemaining: termMonths,
      paymentsMade: 0,
      nextPaymentDueDay: player.daysPlayed + 30,
      financedItemName: target.name,
      missedPayment: false,
    };

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - downPayment,
      transportationTier: tier,
      reputation: Math.min(100, prev.reputation + tier * 2),
    }));

    setLoans((prev) => [...prev, autoLoan]);
    addPlayerXP(65);
    triggerFeedback(`🚗 Vehicle Financed: ${target.name}!`, 'success', [
      `Down Payment: $${downPayment.toLocaleString()}`,
      `Financed: $${financedPrincipal.toLocaleString()} (${termMonths} mos @ ${(apr * 100).toFixed(1)}% APR)`,
      `Monthly Installment: $${monthlyPayment}/mo`,
      `⭐ Pay on time every month to steadily grow your credit score!`,
    ]);
    return true;
  };

  // Bank actions
  const openBankAccount = (): boolean => {
    if (player.hasBankAccount) {
      triggerFeedback('You already have an active bank account!', 'info');
      return true;
    }

    if (player.cash < 500) {
      triggerFeedback('Insufficient cash to open bank account!', 'warning', [
        `Required Opening Fee: $500`,
        `Current Cash: $${player.cash.toLocaleString()}`,
        `You need $${(500 - player.cash).toLocaleString()} more to open an account.`,
      ]);
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - 500,
      hasBankAccount: true,
    }));

    addPlayerXP(100);
    triggerFeedback('🏦 Vance Mobile Bank Account Opened!', 'success', [
      'Paid $500 one-time account opening fee.',
      'Checking and Savings accounts are now fully active!',
      'Earn 4.5% APY on High-Yield Savings deposits.',
      '+100 Player XP gained!',
    ]);
    return true;
  };

  const depositBank = (accountId: 'checking' | 'savings', amount: number): boolean => {
    if (!player.hasBankAccount) {
      triggerFeedback('Account required! Pay $500 to open your bank account first.', 'warning');
      return false;
    }

    if (amount <= 0 || player.cash < amount) {
      triggerFeedback('Insufficient cash to deposit!', 'warning');
      return false;
    }

    setPlayer((prev) => ({ ...prev, cash: prev.cash - amount }));
    setBankAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, balance: acc.balance + amount } : acc))
    );

    triggerFeedback(`Deposited $${amount.toLocaleString()} into ${accountId.toUpperCase()}`, 'success');
    return true;
  };

  const withdrawBank = (accountId: 'checking' | 'savings', amount: number): boolean => {
    if (!player.hasBankAccount) {
      triggerFeedback('You do not have an active bank account!', 'warning');
      return false;
    }

    const acc = bankAccounts.find((a) => a.id === accountId);
    if (!acc || acc.balance < amount) {
      triggerFeedback('Insufficient balance in bank account!', 'warning');
      return false;
    }

    setBankAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, balance: a.balance - amount } : a))
    );
    setPlayer((prev) => ({ ...prev, cash: prev.cash + amount }));

    triggerFeedback(`Withdrew $${amount.toLocaleString()} to cash wallet`, 'info');
    return true;
  };

  // Pay credit card
  const payCreditCard = (cardId: string, amount: number): boolean => {
    const card = creditCards.find((c) => c.id === cardId);
    if (!card || amount <= 0 || player.cash < amount) {
      triggerFeedback('Invalid payment or insufficient cash!', 'warning');
      return false;
    }

    const payAmount = Math.min(card.balance, amount);
    const newBalance = card.balance - payAmount;
    const oldUtilization = card.limit > 0 ? card.balance / card.limit : 0;
    const newUtilization = card.limit > 0 ? newBalance / card.limit : 0;

    setPlayer((prev) => {
      // Credit score only improves if lowering utilization under 30% from a higher utilization
      const gotUnder30 = oldUtilization >= 0.30 && newUtilization < 0.30;
      const creditGain = gotUnder30 ? 2 : 0;
      return {
        ...prev,
        cash: prev.cash - payAmount,
        creditScore: Math.min(850, prev.creditScore + creditGain),
      };
    });

    setCreditCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, balance: newBalance } : c))
    );

    triggerFeedback(`Paid $${payAmount} towards ${card.name}`, 'success');
    return true;
  };

  const applyCreditCard = (tier: number): boolean => {
    const card = creditCards.find((c) => c.tier === tier);
    if (!card) return false;

    // Credit score threshold check
    const minScore = tier === 2 ? 620 : tier === 3 ? 700 : 750;
    if (player.creditScore < minScore) {
      triggerFeedback(`Credit score too low! Requires ${minScore}+ (Current: ${player.creditScore})`, 'warning');
      return false;
    }

    setCreditCards((prev) =>
      prev.map((c) => (c.tier === tier ? { ...c, unlocked: true } : c))
    );
    triggerFeedback(`Approved for ${card.name}!`, 'success', [`Limit: $${card.limit.toLocaleString()}`]);
    return true;
  };

  // Take personal or business loan
  const takeLoan = (type: 'personal' | 'business' | 'mortgage', amount: number, termMonths: number): boolean => {
    const minScore = type === 'business' ? 620 : type === 'mortgage' ? 660 : 540;
    if (player.creditScore < minScore) {
      triggerFeedback(`Loan Application Denied: Requires ${minScore}+ credit score (Current: ${player.creditScore})`, 'warning');
      return false;
    }

    const interestRate = Math.max(0.045, 0.22 - (player.creditScore - 550) * 0.0004);
    const monthlyRate = interestRate / 12;
    const monthlyPayment = Math.round(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
    );

    const newLoan: Loan = {
      id: 'loan_' + Date.now(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Financing`,
      type,
      principal: amount,
      remainingBalance: amount,
      interestRate,
      monthlyPayment,
      monthsRemaining: termMonths,
      paymentsMade: 0,
      nextPaymentDueDay: player.daysPlayed + 30,
      missedPayment: false,
    };

    setLoans((prev) => [...prev, newLoan]);
    setPlayer((prev) => ({ ...prev, cash: prev.cash + amount }));
    triggerFeedback(`Loan Approved: +$${amount.toLocaleString()}`, 'success', [
      `Monthly payment: $${monthlyPayment}/mo`,
      `Term: ${termMonths} months`,
      `⭐ Pay monthly on time to grow your credit score!`,
    ]);
    return true;
  };

  // Pay Scheduled Monthly Installment (Core Credit Score Growth Mechanism)
  const payMonthlyLoanDue = (loanId: string): boolean => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return false;

    const payment = Math.min(loan.remainingBalance, loan.monthlyPayment);
    if (player.cash < payment) {
      triggerFeedback(`Insufficient cash to pay monthly installment ($${payment.toLocaleString()})!`, 'warning');
      return false;
    }

    // Realistic Credit Score Growth for On-Time Installment Payment:
    // +4 to +6 points per on-time monthly payment!
    const baseCreditGain = loan.type === 'auto' ? 5 : 4;
    const newConsecutive = (player.consecutiveOnTimePayments || 0) + 1;
    // Streak milestone bonus every 3 months on time
    const streakBonus = newConsecutive % 3 === 0 ? 3 : 0;
    const totalCreditGain = baseCreditGain + streakBonus;

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - payment,
      creditScore: Math.min(850, prev.creditScore + totalCreditGain),
      consecutiveOnTimePayments: newConsecutive,
      totalOnTimePayments: (prev.totalOnTimePayments || 0) + 1,
      reputation: Math.min(100, prev.reputation + (streakBonus > 0 ? 2 : 1)),
    }));

    setLoans((prev) =>
      prev
        .map((l) => {
          if (l.id !== loanId) return l;
          const newBalance = Math.max(0, l.remainingBalance - payment);
          const newMonths = Math.max(0, l.monthsRemaining - 1);
          return {
            ...l,
            remainingBalance: newBalance,
            monthsRemaining: newMonths,
            paymentsMade: (l.paymentsMade || 0) + 1,
            nextPaymentDueDay: player.daysPlayed + 30,
            missedPayment: false,
          };
        })
        .filter((l) => l.remainingBalance > 0 && l.monthsRemaining > 0)
    );

    addPlayerXP(35);
    triggerFeedback(`Monthly Due Paid: -$${payment.toLocaleString()}`, 'success', [
      `⭐ On-Time Payment! Credit Score +${totalCreditGain}`,
      `On-Time Streak: ${newConsecutive} payments`,
    ]);
    return true;
  };

  // Pay Extra Principal on loan (does not artificially inflate credit on micro-payments)
  const payLoan = (loanId: string, amount: number): boolean => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || player.cash < amount) {
      triggerFeedback('Insufficient cash to service loan!', 'warning');
      return false;
    }

    const payment = Math.min(loan.remainingBalance, amount);
    setPlayer((prev) => ({ ...prev, cash: prev.cash - payment }));

    setLoans((prev) =>
      prev
        .map((l) => (l.id === loanId ? { ...l, remainingBalance: l.remainingBalance - payment } : l))
        .filter((l) => l.remainingBalance > 0)
    );

    triggerFeedback(`Loan Principal Repaid: -$${payment.toLocaleString()}`, 'success');
    return true;
  };

  // Premium Store & Paystack Actions
  const buyGemsWithPaystack = (gemAmount: number, reference: string) => {
    setPlayer((prev) => ({
      ...prev,
      gems: (prev.gems || 0) + gemAmount,
    }));
    addPlayerXP(50);
    triggerFeedback(`💎 Delivered +${gemAmount.toLocaleString()} Gems!`, 'success', [
      `Transaction Ref: ${reference.slice(0, 18)}...`,
      `Exchange gems for in-game cash or premium boosts!`,
    ]);
  };

  const exchangeGemsForCash = (gemCost: number, cashAmount: number): boolean => {
    if ((player.gems || 0) < gemCost) {
      triggerFeedback(`Insufficient Gems! Need ${gemCost} 💎 (You have ${player.gems || 0} 💎)`, 'warning');
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      gems: prev.gems - gemCost,
      cash: prev.cash + cashAmount,
    }));

    addPlayerXP(40);
    triggerFeedback(`Exchanged ${gemCost} 💎 for +$${cashAmount.toLocaleString()} Cash!`, 'success', [
      `New Cash Balance: $${(player.cash + cashAmount).toLocaleString()}`,
    ]);
    return true;
  };

  const useGemPerk = (perkId: string): boolean => {
    if (perkId === 'perk_full_energy') {
      if ((player.gems || 0) < 10) {
        triggerFeedback('Need 10 Gems for Energy Supercharge!', 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        gems: prev.gems - 10,
        energy: prev.maxEnergy,
      }));
      triggerFeedback('⚡ Energy Supercharge! Restored to 100% Max', 'success');
      return true;
    }

    if (perkId === 'perk_credit_cleanse') {
      if ((player.gems || 0) < 25) {
        triggerFeedback('Need 25 Gems for Credit Bureau Cleanse!', 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        gems: prev.gems - 25,
        creditScore: Math.min(850, prev.creditScore + 25),
        missedPaymentsCount: 0,
        consecutiveOnTimePayments: Math.max(3, prev.consecutiveOnTimePayments || 0),
      }));
      setLoans((prev) => prev.map((l) => ({ ...l, missedPayment: false })));
      triggerFeedback('📈 Bureau Cleanse Completed! +25 Credit Score', 'success', [
        'Cleared late payment flags from credit file.',
      ]);
      return true;
    }

    if (perkId === 'perk_vip_booster') {
      if ((player.gems || 0) < 40) {
        triggerFeedback('Need 40 Gems for VIP Prestige Booster!', 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        gems: prev.gems - 40,
        reputation: Math.min(100, prev.reputation + 15),
      }));
      triggerFeedback('👑 VIP Prestige Booster Activated!', 'success', [
        '+15 Reputation boost applied.',
      ]);
      return true;
    }

    return false;
  };

  // Bankruptcy recovery
  const fileBankruptcyRebuild = () => {
    setLoans([]);
    setCreditCards((prev) => prev.map((c) => ({ ...c, balance: 0, unlocked: c.tier === 1 })));
    setPlayer((prev) => ({
      ...prev,
      creditScore: 420,
      cash: Math.max(100, prev.cash * 0.2),
      reputation: Math.max(10, prev.reputation - 30),
    }));
    triggerFeedback('Chapter Rebuild Filed', 'warning', [
      'Unsecured debt discharged',
      'Credit score dropped to 420',
      'Begin rebuilding via secured hustle!',
    ]);
  };

  // Stock trading
  const buyStock = (stockId: string, shares: number): boolean => {
    const stock = stocks.find((s) => s.id === stockId);
    if (!stock || shares <= 0) return false;

    const totalCost = Number((stock.price * shares).toFixed(2));
    if (player.cash < totalCost) {
      triggerFeedback(`Insufficient cash! Requires $${totalCost.toLocaleString()}`, 'warning');
      return false;
    }

    setPlayer((prev) => ({ ...prev, cash: prev.cash - totalCost }));
    setPortfolio((prev) => {
      const existing = prev.find((h) => h.stockId === stockId);
      if (existing) {
        const totalShares = existing.shares + shares;
        const avgBuy = (existing.shares * existing.avgBuyPrice + totalCost) / totalShares;
        return prev.map((h) => (h.stockId === stockId ? { ...h, shares: totalShares, avgBuyPrice: avgBuy } : h));
      } else {
        return [...prev, { stockId, shares, avgBuyPrice: stock.price }];
      }
    });

    addPlayerXP(15);
    addSkillXP('finance', 10);
    triggerFeedback(`Purchased ${shares} shares of ${stock.ticker}`, 'success', [`Total: $${totalCost.toLocaleString()}`]);
    return true;
  };

  const sellStock = (stockId: string, shares: number): boolean => {
    const holding = portfolio.find((h) => h.stockId === stockId);
    const stock = stocks.find((s) => s.id === stockId);
    if (!holding || !stock || holding.shares < shares) {
      triggerFeedback('Insufficient shares owned to sell!', 'warning');
      return false;
    }

    const proceeds = Number((stock.price * shares).toFixed(2));
    const profit = proceeds - holding.avgBuyPrice * shares;

    setPlayer((prev) => ({ ...prev, cash: prev.cash + proceeds }));
    setPortfolio((prev) =>
      prev
        .map((h) => (h.stockId === stockId ? { ...h, shares: h.shares - shares } : h))
        .filter((h) => h.shares > 0)
    );

    addPlayerXP(20);
    addSkillXP('finance', 15);
    triggerFeedback(
      `Sold ${shares} shares of ${stock.ticker}`,
      'success',
      [`Proceeds: +$${proceeds.toLocaleString()}`, `Net P/L: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`]
    );
    return true;
  };

  const toggleWatchlistStock = (stockId: string) => {
    setStocks((prev) =>
      prev.map((s) => (s.id === stockId ? { ...s, isWatchlist: !s.isWatchlist } : s))
    );
  };

  // Property & Real Estate
  const buyProperty = (
    propertyId: string,
    offerPrice: number,
    downPaymentPercent: number,
    loanTermYears: number
  ): boolean => {
    const prop = marketProperties.find((p) => p.id === propertyId);
    if (!prop) return false;

    const downPayment = Math.round(offerPrice * (downPaymentPercent / 100));
    const closingCosts = Math.round(offerPrice * 0.03);
    const totalCashNeeded = downPayment + closingCosts;

    if (player.cash < totalCashNeeded) {
      triggerFeedback(`Insufficient cash for down payment + closing ($${totalCashNeeded.toLocaleString()})!`, 'warning');
      return false;
    }

    const loanPrincipal = offerPrice - downPayment;
    let mortgage: Loan | undefined;

    if (loanPrincipal > 0) {
      const termMonths = loanTermYears * 12;
      const rate = 0.065;
      const monthlyRate = rate / 12;
      const monthlyPayment = Math.round(
        (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
          (Math.pow(1 + monthlyRate, termMonths) - 1)
      );

      mortgage = {
        id: 'mortgage_' + Date.now(),
        name: `Mortgage on ${prop.address}`,
        type: 'mortgage',
        principal: loanPrincipal,
        remainingBalance: loanPrincipal,
        interestRate: rate,
        monthlyPayment,
        monthsRemaining: termMonths,
        paymentsMade: 0,
        nextPaymentDueDay: player.daysPlayed + 30,
        collateralPropertyId: prop.id,
      };

      setLoans((prev) => [...prev, mortgage!]);
    }

    setPlayer((prev) => ({ ...prev, cash: prev.cash - totalCashNeeded }));

    const purchasedProp: Property = {
      ...prop,
      isOwned: true,
      purchasePrice: offerPrice,
      mortgage,
    };

    setOwnedProperties((prev) => [...prev, purchasedProp]);
    setMarketProperties((prev) => prev.filter((p) => p.id !== propertyId));

    addPlayerXP(250);
    addSkillXP('realEstate', 50);
    addSkillXP('negotiation', 25);

    triggerFeedback(`Acquired Property: ${prop.address}!`, 'success', [
      `Purchase Price: $${offerPrice.toLocaleString()}`,
      `Down Payment: $${downPayment.toLocaleString()}`,
      `Ready for renovation or tenant leasing!`,
    ]);
    return true;
  };

  // Renovation
  const renovatePropertyArea = (
    propertyId: string,
    areaId: PropertyAreaId,
    method: 'diy' | 'contractor'
  ): boolean => {
    const prop = ownedProperties.find((p) => p.id === propertyId);
    if (!prop) return false;

    const area = prop.areas.find((a) => a.id === areaId);
    if (!area) return false;

    if (area.condition >= 95) {
      triggerFeedback(`${area.name} is already in pristine condition!`, 'info');
      return false;
    }

    if (method === 'diy') {
      const handymanLevel = player.skills.handyman.level;
      if (handymanLevel < area.diySkillReq) {
        triggerFeedback(`Requires Handyman Level ${area.diySkillReq} to DIY this area!`, 'warning');
        return false;
      }

      const diyCost = Math.round(area.repairCost * 0.35); // 65% savings
      if (player.cash < diyCost) {
        triggerFeedback(`Need $${diyCost} for materials!`, 'warning');
        return false;
      }

      if (player.energy < area.diyEnergyCost) {
        triggerFeedback(`Not enough energy for DIY work (Requires ⚡ ${area.diyEnergyCost})!`, 'warning');
        return false;
      }

      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash - diyCost,
        energy: prev.energy - area.diyEnergyCost,
      }));

      advanceTime(180);
      addSkillXP('handyman', 30);
      addPlayerXP(60);

      // Upgrade area
      setOwnedProperties((prev) =>
        prev.map((p) => {
          if (p.id !== propertyId) return p;
          const updatedAreas = p.areas.map((a) =>
            a.id === areaId ? { ...a, condition: Math.min(100, a.condition + 35) } : a
          );
          const newAvg = Math.round(updatedAreas.reduce((sum, a) => sum + a.condition, 0) / updatedAreas.length);
          const equityBoost = Math.round(diyCost * 2.2);

          return {
            ...p,
            areas: updatedAreas,
            overallCondition: newAvg,
            currentValue: p.currentValue + equityBoost,
            estimatedRent: Math.round(p.estimatedRent * 1.06),
          };
        })
      );

      triggerFeedback(`DIY Renovated: ${area.name}!`, 'success', [
        `Condition improved by +35%`,
        `Equity Value Increased!`,
        `Handyman +30 XP`,
      ]);
      return true;
    } else {
      // Contractor
      const contractorCost = area.repairCost;
      if (player.cash < contractorCost) {
        triggerFeedback(`Contractor requires $${contractorCost.toLocaleString()}!`, 'warning');
        return false;
      }

      setPlayer((prev) => ({ ...prev, cash: prev.cash - contractorCost }));
      advanceTime(45);
      addPlayerXP(40);
      addSkillXP('management', 20);

      setOwnedProperties((prev) =>
        prev.map((p) => {
          if (p.id !== propertyId) return p;
          const updatedAreas = p.areas.map((a) =>
            a.id === areaId ? { ...a, condition: 100 } : a
          );
          const newAvg = Math.round(updatedAreas.reduce((sum, a) => sum + a.condition, 0) / updatedAreas.length);
          const equityBoost = Math.round(contractorCost * 1.4);

          return {
            ...p,
            areas: updatedAreas,
            overallCondition: newAvg,
            currentValue: p.currentValue + equityBoost,
            estimatedRent: Math.round(p.estimatedRent * 1.1),
          };
        })
      );

      triggerFeedback(`Contractor Completed: ${area.name}!`, 'success', [
        `Restored to 100% mint condition!`,
        `Value: +$${Math.round(contractorCost * 1.4).toLocaleString()}`,
      ]);
      return true;
    }
  };

  // Set tenant
  const setTenantToProperty = (propertyId: string, tenant: Tenant): boolean => {
    setOwnedProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, tenant } : p))
    );

    // Collect initial security deposit
    setPlayer((prev) => ({ ...prev, cash: prev.cash + tenant.depositPaid }));
    addPlayerXP(80);
    addSkillXP('realEstate', 25);
    triggerFeedback(`Lease Signed with ${tenant.name}!`, 'success', [
      `Rent: $${tenant.agreedRent}/month`,
      `Deposit Collected: +$${tenant.depositPaid}`,
      `Type: ${tenant.type}`,
    ]);
    return true;
  };

  const evictTenant = (propertyId: string) => {
    setOwnedProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, tenant: undefined } : p))
    );
    triggerFeedback('Tenant lease ended. Property is vacant.', 'info');
  };

  // Collect unclaimed rent
  const collectRent = (propertyId?: string) => {
    // 1. Calculate total from current state synchronously
    const targetProps = propertyId
      ? ownedProperties.filter((p) => p.id === propertyId)
      : ownedProperties;

    const totalCollected = targetProps.reduce(
      (sum, p) => sum + (p.collectedRentUnclaimed || 0),
      0
    );

    if (totalCollected <= 0) {
      triggerFeedback('No unclaimed rent at this moment.', 'info');
      return;
    }

    // 2. Clear unclaimed rent on properties
    setOwnedProperties((prev) =>
      prev.map((p) => {
        if (propertyId && p.id !== propertyId) return p;
        return { ...p, collectedRentUnclaimed: 0 };
      })
    );

    // 3. Directly and reliably credit player's cash!
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash + totalCollected,
      annualIncomeEarned: (prev.annualIncomeEarned || 0) + totalCollected,
    }));

    triggerFeedback(`Collected $${totalCollected.toLocaleString()} in Rental Income!`, 'success');
  };

  const toggleWatchlistProperty = (propertyId: string) => {
    setMarketProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, isWatchlist: !p.isWatchlist } : p))
    );
  };

  // Auctions against AI opponents
  const startAuction = (propertyId: string) => {
    const prop = marketProperties.find((p) => p.id === propertyId);
    if (!prop) return;

    const startingBid = Math.round(prop.askingPrice * 0.75);
    setActiveAuction({
      id: 'auction_' + Date.now(),
      property: prop,
      currentBid: startingBid,
      highestBidder: 'House Bank Asset Liquidation',
      secondsRemaining: 30,
      isPlayerWinning: false,
      bidsHistory: [{ bidder: 'Bank', amount: startingBid, time: 'Starting Bid' }],
      active: true,
    });
  };

  const bidInAuction = (amount: number) => {
    if (!activeAuction || !activeAuction.active) return;
    if (player.cash < amount) {
      triggerFeedback('Insufficient cash to place this bid!', 'warning');
      return;
    }

    setActiveAuction((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        currentBid: amount,
        highestBidder: player.name,
        isPlayerWinning: true,
        bidsHistory: [{ bidder: player.name, amount, time: 'Now' }, ...prev.bidsHistory],
      };
    });

    triggerFeedback(`Bid Placed: $${amount.toLocaleString()}!`, 'success');

    // AI opponent counter-bid after 3.5 seconds
    setTimeout(() => {
      setActiveAuction((prev) => {
        if (!prev || !prev.active) return prev;
        const aiOpponent = AI_OPPONENTS[Math.floor(Math.random() * AI_OPPONENTS.length)];
        const aiBid = amount + Math.round(1000 + Math.random() * 3000);

        if (aiBid < prev.property.currentValue * 0.92) {
          triggerFeedback(`${aiOpponent.name} (${aiOpponent.archetype}) counter-bid $${aiBid.toLocaleString()}!`, 'warning');
          return {
            ...prev,
            currentBid: aiBid,
            highestBidder: aiOpponent.name,
            isPlayerWinning: false,
            bidsHistory: [{ bidder: `${aiOpponent.name} (AI)`, amount: aiBid, time: 'Just now' }, ...prev.bidsHistory],
          };
        }
        return prev;
      });
    }, 3500);
  };

  const closeAuction = () => {
    if (!activeAuction) return;
    if (activeAuction.isPlayerWinning) {
      buyProperty(activeAuction.property.id, activeAuction.currentBid, 100, 0);
      triggerFeedback('🏆 You won the property auction!', 'success');
    }
    setActiveAuction(null);
  };

  const unlockAutoCollectManager = (): boolean => {
    const cost = 2500;
    if (player.cash < cost) {
      triggerFeedback(`Requires $${cost} to hire Property Management Agency!`, 'warning');
      return false;
    }

    setPlayer((prev) => ({ ...prev, cash: prev.cash - cost }));
    setAutoCollectRentUnlocked(true);
    triggerFeedback('Property Manager Hired!', 'success', ['Rent will now auto-deposit directly into your cash daily!']);
    return true;
  };

  // Subscriptions & Passes
  const subscribePropertyManagerPass = (method: 'gems' | 'cash'): boolean => {
    if (method === 'gems') {
      if ((player.gems || 0) < 25) {
        triggerFeedback('Need 25 Gems to activate Property Manager Pass!', 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        gems: prev.gems - 25,
        hasPropertyManagerPass: true,
        propertyManagerPassDaysRemaining: (prev.propertyManagerPassDaysRemaining || 0) + 30,
      }));
    } else {
      const cost = 999;
      if (player.cash < cost) {
        triggerFeedback('Need $999 cash to activate Property Manager Pass!', 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash - cost,
        hasPropertyManagerPass: true,
        propertyManagerPassDaysRemaining: (prev.propertyManagerPassDaysRemaining || 0) + 30,
      }));
    }
    setAutoCollectRentUnlocked(true);
    addPlayerXP(120);
    triggerFeedback('🏢 Property Manager Pass Activated!', 'success', [
      '30-Day Recurring Pass Active',
      'Automated Rent Collection Active',
      '+$2,500 Daily Manager Cash Bonus',
      '100% Tax Exemption from 30% IRS Income Tax',
      '75% Reduced Maintenance Costs',
    ]);
    return true;
  };

  const unlockVipClubAccess = (method: 'gems' | 'cash'): boolean => {
    if (method === 'gems') {
      if ((player.gems || 0) < 40) {
        triggerFeedback('Need 40 Gems for VIP Club Access!', 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        gems: prev.gems - 40,
        hasVipClubAccess: true,
        reputation: Math.min(100, prev.reputation + 25),
      }));
    } else {
      const cost = 25000;
      if (player.cash < cost) {
        triggerFeedback('Need $25,000 cash for VIP Club Access!', 'warning');
        return false;
      }
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash - cost,
        hasVipClubAccess: true,
        reputation: Math.min(100, prev.reputation + 25),
      }));
    }
    addPlayerXP(250);
    triggerFeedback('👑 VIP Club Access Unlocked!', 'success', [
      'Exclusive High-Yield Investment Zones Unlocked',
      'Private Distressed Property Auctions in Phone',
      'Hypercars, Supersonic Jets & Mega Yachts Catalog Available',
    ]);
    return true;
  };

  const buyLuxuryItem = (itemId: string): boolean => {
    const item = LUXURY_ITEMS.find((i) => i.id === itemId);
    if (!item) return false;

    if (player.ownedLuxuryItems?.includes(itemId)) {
      triggerFeedback(`You already own the ${item.name}!`, 'info');
      return false;
    }

    if ((player.gems || 0) < item.gemPrice) {
      triggerFeedback(`Need ${item.gemPrice} 💎 for ${item.name}! (You have ${player.gems || 0} 💎)`, 'warning');
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      gems: prev.gems - item.gemPrice,
      reputation: Math.min(100, prev.reputation + item.reputationBonus),
      ownedLuxuryItems: [...(prev.ownedLuxuryItems || []), itemId],
    }));

    addPlayerXP(500);
    triggerFeedback(`🍾 Acquired ${item.name}!`, 'success', [
      `Gems Spent: -${item.gemPrice} 💎`,
      `Asset Value: +$${item.cashEquivalent.toLocaleString()} added to Net Worth!`,
      `+${item.reputationBonus} Global Reputation`,
      `Ranked higher on the Farbes Richest List!`,
    ]);
    return true;
  };

  const buyPropertyWithGems = (propertyId: string): boolean => {
    const prop = marketProperties.find((p) => p.id === propertyId);
    if (!prop || !prop.gemPrice) {
      triggerFeedback('Property not eligible for gem purchase!', 'warning');
      return false;
    }

    if ((player.gems || 0) < prop.gemPrice) {
      triggerFeedback(`Need ${prop.gemPrice} 💎 for this VIP Property! (You have ${player.gems || 0} 💎)`, 'warning');
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      gems: prev.gems - prop.gemPrice!,
      reputation: Math.min(100, prev.reputation + 25),
    }));

    const ownedProp: Property = {
      ...prop,
      isOwned: true,
      purchasePrice: prop.askingPrice,
      collectedRentUnclaimed: 0,
    };

    setOwnedProperties((prev) => [...prev, ownedProp]);
    setMarketProperties((prev) => prev.filter((p) => p.id !== propertyId));

    addPlayerXP(400);
    triggerFeedback(`👑 VIP Asset Acquired: ${prop.address}!`, 'success', [
      `Paid ${prop.gemPrice} Gems (100% Equity Owned)`,
      `Monthly Rent Potential: $${prop.estimatedRent.toLocaleString()}`,
      `Asset Value: $${prop.currentValue.toLocaleString()}`,
    ]);
    return true;
  };

  const payYearlyTaxBill = (): boolean => {
    const owed = player.accumulatedTaxOwed || 0;
    if (owed <= 0) {
      triggerFeedback('No pending tax liens owed at this time!', 'info');
      return false;
    }

    if (player.cash < owed) {
      triggerFeedback(`Insufficient cash to clear tax bill! Need $${owed.toLocaleString()}`, 'warning');
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - owed,
      accumulatedTaxOwed: 0,
      creditScore: Math.min(850, prev.creditScore + 15),
    }));

    addPlayerXP(150);
    triggerFeedback('🏛️ IRS Tax Balance Settled!', 'success', [
      `Paid -$${owed.toLocaleString()}`,
      'Tax lien discharged',
      '+15 Credit Score bonus!',
    ]);
    return true;
  };

  // Business operations
  const startBusiness = (typeId: string, name: string): boolean => {
    const template = BUSINESS_TEMPLATES.find((t) => t.id === typeId) || BUSINESS_TEMPLATES[0];

    if (player.cash < template.cost) {
      triggerFeedback(`Requires $${template.cost.toLocaleString()} initial startup capital!`, 'warning');
      return false;
    }

    setPlayer((prev) => ({ ...prev, cash: prev.cash - template.cost }));

    const initialTreasury = Math.round(template.cost * 0.1);
    const newBiz: Business = {
      id: 'biz_' + Date.now(),
      typeId: template.id,
      name,
      category: template.category,
      revenueMonthly: template.revenue,
      expensesMonthly: template.expenses,
      customersCount: 20,
      reputation: 60,
      officeTier: 1,
      equipmentValue: Math.round(template.cost * 0.7),
      employees: [],
      contracts: [],
      priceMultiplier: 1.0,
      marketingBudgetMonthly: Math.round(template.revenue * 0.05),
      treasury: initialTreasury,
    };

    setOwnedBusinesses((prev) => [...prev, newBiz]);
    addPlayerXP(350);
    addSkillXP('business', 50);
    triggerFeedback(`Launched ${name}!`, 'success', [
      `Initial Cost: $${template.cost.toLocaleString()}`,
      `Est. Revenue: $${template.revenue.toLocaleString()}/mo`,
      `Working Treasury Funded: $${initialTreasury.toLocaleString()}`,
    ]);
    return true;
  };

  const depositToBusiness = (businessId: string, amount: number): boolean => {
    if (amount <= 0) return false;
    if (player.cash < amount) {
      triggerFeedback('Insufficient personal cash to deposit!', 'warning');
      return false;
    }

    const biz = ownedBusinesses.find((b) => b.id === businessId);
    if (!biz) return false;

    setPlayer((prev) => ({ ...prev, cash: prev.cash - amount }));
    setOwnedBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, treasury: (b.treasury || 0) + amount } : b))
    );

    triggerFeedback(`Deposited $${amount.toLocaleString()} into ${biz.name} treasury!`, 'success');
    return true;
  };

  const withdrawFromBusiness = (businessId: string, amount: number): boolean => {
    if (amount <= 0) return false;
    const biz = ownedBusinesses.find((b) => b.id === businessId);
    if (!biz) return false;

    const availableTreasury = biz.treasury || 0;
    if (availableTreasury < amount) {
      triggerFeedback(`Treasury only has $${availableTreasury.toLocaleString()} available!`, 'warning');
      return false;
    }

    setOwnedBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, treasury: (b.treasury || 0) - amount } : b))
    );
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash + amount,
      annualIncomeEarned: (prev.annualIncomeEarned || 0) + amount,
    }));

    triggerFeedback(`Withdrew $${amount.toLocaleString()} from ${biz.name} to personal cash!`, 'success');
    return true;
  };

  // Weekly Career Jobs
  const applyWeeklyJob = (jobId: string): boolean => {
    const job = availableJobs.find((j) => j.id === jobId);
    if (!job) return false;

    if (job.payType !== 'weekly') {
      return doJob(jobId);
    }

    // Education check
    if (job.requiredEducation) {
      const hasEducation = (player.education || []).includes(job.requiredEducation.id);
      if (!hasEducation) {
        triggerFeedback(`Requires Degree: ${job.requiredEducation.name}! Enroll in education courses first.`, 'warning');
        return false;
      }
    }

    // Transport check
    if (job.requiredTransportTier && player.transportationTier < job.requiredTransportTier) {
      triggerFeedback(`Requires Transportation Tier ${job.requiredTransportTier}+!`, 'warning');
      return false;
    }

    setPlayer((prev) => ({
      ...prev,
      activeWeeklyJobId: jobId,
      weeklyJobDaysRemaining: 7,
    }));

    addPlayerXP(180);
    triggerFeedback(`Hired as ${job.title}!`, 'success', [
      `Weekly Salary: $${job.weeklySalary?.toLocaleString()}/week`,
      `Weekly Energy Commitment: ${job.weeklyEnergyCost || 35}⚡`,
      `First paycheck in 7 in-game days!`,
    ]);
    return true;
  };

  const quitWeeklyJob = () => {
    setPlayer((prev) => ({
      ...prev,
      activeWeeklyJobId: undefined,
      weeklyJobDaysRemaining: undefined,
    }));
    triggerFeedback('Resigned from weekly position.', 'info');
  };

  const hireEmployee = (businessId: string, role: string, salary: number): boolean => {
    const biz = ownedBusinesses.find((b) => b.id === businessId);
    if (!biz) return false;

    const newEmp = {
      id: 'emp_' + Date.now(),
      name: ['Jordan Cole', 'Morgan Smith', 'Taylor Reed', 'Samira Khan'][Math.floor(Math.random() * 4)],
      role,
      skillLevel: 2 + Math.floor(Math.random() * 3),
      salaryMonthly: salary,
      productivity: 1.15,
      morale: 85,
    };

    setOwnedBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== businessId) return b;
        return {
          ...b,
          employees: [...b.employees, newEmp],
          expensesMonthly: b.expensesMonthly + salary,
          revenueMonthly: Math.round(b.revenueMonthly + salary * 1.6), // positive ROI
        };
      })
    );

    addSkillXP('management', 20);
    triggerFeedback(`Hired ${newEmp.name} as ${role}!`, 'success', [`Monthly Revenue Boost: +$${Math.round(salary * 1.6)}`]);
    return true;
  };

  const fireEmployee = (businessId: string, empId: string) => {
    setOwnedBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== businessId) return b;
        const emp = b.employees.find((e) => e.id === empId);
        if (!emp) return b;
        return {
          ...b,
          employees: b.employees.filter((e) => e.id !== empId),
          expensesMonthly: Math.max(0, b.expensesMonthly - emp.salaryMonthly),
          revenueMonthly: Math.max(0, b.revenueMonthly - Math.round(emp.salaryMonthly * 1.4)),
        };
      })
    );
    triggerFeedback('Employee dismissed.', 'info');
  };

  const upgradeBusinessOffice = (businessId: string): boolean => {
    const biz = ownedBusinesses.find((b) => b.id === businessId);
    if (!biz || biz.officeTier >= 5) return false;

    const costs = [0, 2000, 6000, 18000, 50000];
    const cost = costs[biz.officeTier];

    if (player.cash < cost) {
      triggerFeedback(`Office expansion requires $${cost.toLocaleString()}!`, 'warning');
      return false;
    }

    setPlayer((prev) => ({ ...prev, cash: prev.cash - cost }));
    setOwnedBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? {
              ...b,
              officeTier: b.officeTier + 1,
              reputation: Math.min(100, b.reputation + 10),
              revenueMonthly: Math.round(b.revenueMonthly * 1.25),
            }
          : b
      )
    );

    addPlayerXP(120);
    triggerFeedback('Upgraded Business Headquarters!', 'success', ['Capacity and client contracts increased!']);
    return true;
  };

  const boostBusinessMarketing = (businessId: string, amount: number): boolean => {
    if (player.cash < amount) {
      triggerFeedback('Insufficient cash for ad campaign!', 'warning');
      return false;
    }

    setPlayer((prev) => ({ ...prev, cash: prev.cash - amount }));
    setOwnedBusinesses((prev) =>
      prev.map((b) =>
        b.id === businessId
          ? {
              ...b,
              customersCount: b.customersCount + Math.round(amount / 40),
              revenueMonthly: b.revenueMonthly + Math.round(amount * 1.8),
            }
          : b
      )
    );

    addSkillXP('marketing', 25);
    triggerFeedback('Ad Campaign Launched!', 'success', [`Customer base & recurring revenue expanded!`]);
    return true;
  };

  const adjustBusinessPricing = (businessId: string, multiplier: number) => {
    setOwnedBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, priceMultiplier: multiplier } : b))
    );
    triggerFeedback(`Pricing Adjusted to ${Math.round(multiplier * 100)}%`, 'info');
  };

  // Event modal choices
  const chooseEventOption = (choiceId: string) => {
    if (!currentEvent) return;
    const choice = currentEvent.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    if (choice.cost && player.cash < choice.cost) {
      triggerFeedback('Insufficient cash to choose this option!', 'warning');
      return;
    }

    if (choice.cost) {
      setPlayer((prev) => ({ ...prev, cash: prev.cash - choice.cost! }));
    }

    if (choice.energyChange) {
      setPlayer((prev) => ({
        ...prev,
        energy: Math.max(0, Math.min(prev.maxEnergy, prev.energy + choice.energyChange!)),
      }));
    }

    if (choice.reputationChange) {
      setPlayer((prev) => ({
        ...prev,
        reputation: Math.max(0, Math.min(100, prev.reputation + choice.reputationChange!)),
      }));
    }

    if (choice.skillBonus) {
      addSkillXP(choice.skillBonus.skill, choice.skillBonus.xp);
    }

    triggerFeedback(choice.outcomeText, 'info');
    setCurrentEvent(null);
  };

  // Daily missions claim
  const claimMissionReward = (missionId: string) => {
    const mission = dailyMissions.find((m) => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    setPlayer((prev) => ({ ...prev, cash: prev.cash + mission.rewardCash }));
    addPlayerXP(mission.rewardXp);

    setDailyMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
    );

    triggerFeedback(`Claimed Goal: ${mission.title}!`, 'success', [
      `+$${mission.rewardCash}`,
      `+${mission.rewardXp} XP`,
    ]);
  };

  const setSelectedGoal = (goalId: string) => {
    setPlayer((prev) => ({ ...prev, selectedGoalId: goalId }));
    triggerFeedback('Updated primary life goal target', 'info');
  };

  // Load a save slot
  const loadGameSlot = useCallback((slotId: 1 | 2 | 3) => {
    try {
      isSlotLoadedRef.current = true;
      const pRaw = localStorage.getItem(getSlotStorageKey(slotId, 'player'));
      const loadedPlayer: PlayerProfile = pRaw ? JSON.parse(pRaw) : INITIAL_PLAYER;
      if (typeof loadedPlayer.gems !== 'number') loadedPlayer.gems = 10;
      if (typeof loadedPlayer.consecutiveOnTimePayments !== 'number') loadedPlayer.consecutiveOnTimePayments = 0;
      if (typeof loadedPlayer.totalOnTimePayments !== 'number') loadedPlayer.totalOnTimePayments = 0;
      if (typeof loadedPlayer.missedPaymentsCount !== 'number') loadedPlayer.missedPaymentsCount = 0;
      if (!Array.isArray(loadedPlayer.education)) loadedPlayer.education = ['high_school_diploma'];
      setPlayer(loadedPlayer);

      const bRaw = localStorage.getItem(getSlotStorageKey(slotId, 'bank'));
      setBankAccounts(bRaw ? JSON.parse(bRaw) : [
        { id: 'checking', name: 'Standard Checking', balance: 0, interestRate: 0.001 },
        { id: 'savings', name: 'High-Yield Savings (HYSA)', balance: 0, interestRate: 0.045 },
        { id: 'emergency', name: 'Emergency Reserve', balance: 0, interestRate: 0.035 },
      ]);

      const cRaw = localStorage.getItem(getSlotStorageKey(slotId, 'cards'));
      setCreditCards(cRaw ? JSON.parse(cRaw) : [
        {
          id: 'card_starter',
          name: 'FreshStart Secured Card',
          tier: 1,
          limit: 500,
          balance: 0,
          interestRate: 0.24,
          rewardsRate: 0.0,
          unlocked: true,
          minPayment: 25,
        },
      ]);

      const lRaw = localStorage.getItem(getSlotStorageKey(slotId, 'loans'));
      setLoans(lRaw ? JSON.parse(lRaw) : []);

      const busRaw = localStorage.getItem(getSlotStorageKey(slotId, 'businesses'));
      setOwnedBusinesses(busRaw ? JSON.parse(busRaw) : []);

      const pmRaw = localStorage.getItem(getSlotStorageKey(slotId, 'props_market'));
      setMarketProperties(pmRaw ? JSON.parse(pmRaw) : INITIAL_PROPERTIES_MARKET);

      const poRaw = localStorage.getItem(getSlotStorageKey(slotId, 'props_owned'));
      setOwnedProperties(poRaw ? JSON.parse(poRaw) : []);

      const sRaw = localStorage.getItem(getSlotStorageKey(slotId, 'stocks'));
      setStocks(sRaw ? JSON.parse(sRaw) : INITIAL_STOCKS);

      const pfRaw = localStorage.getItem(getSlotStorageKey(slotId, 'portfolio'));
      setPortfolio(pfRaw ? JSON.parse(pfRaw) : []);

      const aRaw = localStorage.getItem(getSlotStorageKey(slotId, 'achievements'));
      setAchievements(aRaw ? JSON.parse(aRaw) : INITIAL_ACHIEVEMENTS);

      const mRaw = localStorage.getItem(getSlotStorageKey(slotId, 'dailyMissions'));
      if (mRaw) {
        try { setDailyMissions(JSON.parse(mRaw)); } catch {}
      }

      const nRaw = localStorage.getItem(getSlotStorageKey(slotId, 'newsFeed'));
      if (nRaw) {
        try { setNewsFeed(JSON.parse(nRaw)); } catch {}
      }

      const tRaw = localStorage.getItem(getSlotStorageKey(slotId, 'tutorial'));
      setTutorialStep(tRaw ? parseInt(tRaw, 10) : 1);

      const acRaw = localStorage.getItem(getSlotStorageKey(slotId, 'autocollect'));
      setAutoCollectRentUnlocked(acRaw === 'true');

      localStorage.setItem('hustle_sim_current_session_slot', slotId.toString());
      setActiveSlotId(slotId);
      setRecentSlotId(slotId);
      setSlotsMeta(getAllSlotsMeta());

      triggerFeedback(`🎮 Loaded Save Slot ${slotId}: ${loadedPlayer.name} (Day ${loadedPlayer.daysPlayed})`, 'success');
    } catch {
      triggerFeedback(`Failed to load Save Slot ${slotId}`, 'error');
    }
  }, [triggerFeedback]);

  // Auto restore slot on initial mount if active session was saved
  const initialSessionRestoredRef = React.useRef(false);
  useEffect(() => {
    if (activeSlotId && !initialSessionRestoredRef.current) {
      initialSessionRestoredRef.current = true;
      loadGameSlot(activeSlotId);
    }
  }, [activeSlotId, loadGameSlot]);

  // Start new game in selected slot
  const startNewGameInSlot = useCallback((
    slotId: 1 | 2 | 3, 
    playerName: string, 
    startingBonus: 'energy' | 'cash' | 'credit' = 'cash'
  ) => {
    isSlotLoadedRef.current = true;
    const trimmedName = playerName.trim() || 'Alex Vance';
    
    // Configure starting profile with selected perk
    const startingCash = startingBonus === 'cash' ? 2500 : 250;
    const startingEnergy = startingBonus === 'energy' ? 120 : 100;
    const startingMaxEnergy = startingBonus === 'energy' ? 120 : 100;
    const startingCredit = startingBonus === 'credit' ? 720 : 650;

    const newPlayer: PlayerProfile = {
      ...INITIAL_PLAYER,
      name: trimmedName,
      cash: startingCash,
      energy: startingEnergy,
      maxEnergy: startingMaxEnergy,
      creditScore: startingCredit,
    };

    const initialBank: BankAccount[] = [
      { id: 'checking', name: 'Standard Checking', balance: 0, interestRate: 0.001 },
      { id: 'savings', name: 'High-Yield Savings (HYSA)', balance: 0, interestRate: 0.045 },
    ];

    const initialCards: CreditCard[] = [
      {
        id: 'card_starter',
        name: 'FreshStart Secured Card',
        tier: 1,
        limit: 500,
        balance: 0,
        interestRate: 0.24,
        rewardsRate: 0.0,
        unlocked: true,
        minPayment: 25,
      },
      {
        id: 'card_silver',
        name: 'Silver Freedom Card',
        tier: 2,
        limit: 2500,
        balance: 0,
        interestRate: 0.19,
        rewardsRate: 0.015,
        unlocked: false,
        minPayment: 50,
      },
      {
        id: 'card_gold',
        name: 'Apex Gold Preferred',
        tier: 3,
        limit: 10000,
        balance: 0,
        interestRate: 0.15,
        rewardsRate: 0.03,
        unlocked: false,
        minPayment: 150,
      },
      {
        id: 'card_black',
        name: 'Centurion Obsidian Reserve',
        tier: 4,
        limit: 50000,
        balance: 0,
        interestRate: 0.11,
        rewardsRate: 0.05,
        unlocked: false,
        minPayment: 500,
      },
    ];

    const initialDailyMissions: DailyMission[] = [
      {
        id: 'm1',
        title: 'Work Ethic',
        description: 'Complete 2 hustle gig shifts today',
        category: 'hustle',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        claimed: false,
        rewardCash: 60,
        rewardXp: 40,
      },
      {
        id: 'm2',
        title: 'Capital Preservation',
        description: 'Have at least $250 in cash or bank savings',
        category: 'finance',
        currentProgress: newPlayer.cash,
        targetGoal: 250,
        completed: false,
        claimed: false,
        rewardCash: 40,
        rewardXp: 30,
      },
      {
        id: 'm3',
        title: 'Market Observer',
        description: 'View and analyze 2 properties in the market',
        category: 'property',
        currentProgress: 0,
        targetGoal: 2,
        completed: false,
        claimed: false,
        rewardCash: 50,
        rewardXp: 35,
      },
    ];

    // Set local state
    setPlayer(newPlayer);
    setBankAccounts(initialBank);
    setCreditCards(initialCards);
    setLoans([]);
    setOwnedBusinesses([]);
    setMarketProperties(INITIAL_PROPERTIES_MARKET);
    setOwnedProperties([]);
    setStocks(INITIAL_STOCKS);
    setPortfolio([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setDailyMissions(initialDailyMissions);
    setTutorialStep(1);
    setAutoCollectRentUnlocked(false);
    setActiveTab('hustle');

    // Save immediately to slot storage
    try {
      localStorage.setItem(getSlotStorageKey(slotId, 'player'), JSON.stringify(newPlayer));
      localStorage.setItem(getSlotStorageKey(slotId, 'bank'), JSON.stringify(initialBank));
      localStorage.setItem(getSlotStorageKey(slotId, 'cards'), JSON.stringify(initialCards));
      localStorage.setItem(getSlotStorageKey(slotId, 'loans'), JSON.stringify([]));
      localStorage.setItem(getSlotStorageKey(slotId, 'businesses'), JSON.stringify([]));
      localStorage.setItem(getSlotStorageKey(slotId, 'props_market'), JSON.stringify(INITIAL_PROPERTIES_MARKET));
      localStorage.setItem(getSlotStorageKey(slotId, 'props_owned'), JSON.stringify([]));
      localStorage.setItem(getSlotStorageKey(slotId, 'stocks'), JSON.stringify(INITIAL_STOCKS));
      localStorage.setItem(getSlotStorageKey(slotId, 'portfolio'), JSON.stringify([]));
      localStorage.setItem(getSlotStorageKey(slotId, 'achievements'), JSON.stringify(INITIAL_ACHIEVEMENTS));
      localStorage.setItem(getSlotStorageKey(slotId, 'dailyMissions'), JSON.stringify(initialDailyMissions));
      localStorage.setItem(getSlotStorageKey(slotId, 'tutorial'), '1');
      localStorage.setItem(getSlotStorageKey(slotId, 'autocollect'), 'false');

      const updatedMeta = updateSlotMeta(slotId, {
        isEmpty: false,
        playerName: trimmedName,
        daysPlayed: 1,
        level: 1,
        netWorth: newPlayer.cash,
        cash: newPlayer.cash,
        creditScore: newPlayer.creditScore,
        housingTier: 1,
        housingName: "Mom's Couch",
      });
      setSlotsMeta(updatedMeta);
    } catch {
      // ignore
    }

    localStorage.setItem('hustle_sim_current_session_slot', slotId.toString());
    setActiveSlotId(slotId);
    setRecentSlotId(slotId);

    triggerFeedback(`✨ Welcome to the city, ${trimmedName}! Your hustle begins in Slot ${slotId}.`, 'success');
  }, [triggerFeedback]);

  // Delete slot data
  const deleteGameSlot = useCallback((slotId: 1 | 2 | 3) => {
    const updated = deleteSlotData(slotId);
    setSlotsMeta(updated);
    if (activeSlotId === slotId) {
      localStorage.removeItem('hustle_sim_current_session_slot');
      setActiveSlotId(null);
    }
    triggerFeedback(`🗑 Save Slot ${slotId} erased.`, 'info');
  }, [activeSlotId, triggerFeedback]);

  // Manual save trigger
  const manualSave = useCallback(() => {
    if (activeSlotId === null) return;
    try {
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'player'), JSON.stringify(player));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'bank'), JSON.stringify(bankAccounts));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'cards'), JSON.stringify(creditCards));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'loans'), JSON.stringify(loans));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'businesses'), JSON.stringify(ownedBusinesses));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'props_market'), JSON.stringify(marketProperties));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'props_owned'), JSON.stringify(ownedProperties));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'stocks'), JSON.stringify(stocks));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'portfolio'), JSON.stringify(portfolio));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'achievements'), JSON.stringify(achievements));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'dailyMissions'), JSON.stringify(dailyMissions));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'newsFeed'), JSON.stringify(newsFeed));
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'tutorial'), tutorialStep.toString());
      localStorage.setItem(getSlotStorageKey(activeSlotId, 'autocollect'), autoCollectRentUnlocked ? 'true' : 'false');

      const housing = HOUSING_TIERS.find((h) => h.tier === player.housingTier);
      const updatedMeta = updateSlotMeta(activeSlotId, {
        isEmpty: false,
        playerName: player.name,
        daysPlayed: player.daysPlayed,
        level: player.level,
        netWorth,
        cash: player.cash,
        creditScore: player.creditScore,
        housingTier: player.housingTier,
        housingName: housing?.name || "Mom's Couch",
      });
      setSlotsMeta(updatedMeta);
      triggerFeedback(`💾 Progress saved to Slot ${activeSlotId}!`, 'success');
    } catch {
      triggerFeedback('Storage save error', 'error');
    }
  }, [
    activeSlotId,
    player,
    bankAccounts,
    creditCards,
    loans,
    ownedBusinesses,
    marketProperties,
    ownedProperties,
    stocks,
    portfolio,
    achievements,
    dailyMissions,
    newsFeed,
    tutorialStep,
    autoCollectRentUnlocked,
    netWorth,
    triggerFeedback,
  ]);

  // Exit back to main menu
  const exitToMainMenu = useCallback(() => {
    if (activeSlotId !== null) {
      try {
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'player'), JSON.stringify(player));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'bank'), JSON.stringify(bankAccounts));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'cards'), JSON.stringify(creditCards));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'loans'), JSON.stringify(loans));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'businesses'), JSON.stringify(ownedBusinesses));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'props_market'), JSON.stringify(marketProperties));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'props_owned'), JSON.stringify(ownedProperties));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'stocks'), JSON.stringify(stocks));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'portfolio'), JSON.stringify(portfolio));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'achievements'), JSON.stringify(achievements));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'dailyMissions'), JSON.stringify(dailyMissions));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'newsFeed'), JSON.stringify(newsFeed));
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'tutorial'), tutorialStep.toString());
        localStorage.setItem(getSlotStorageKey(activeSlotId, 'autocollect'), autoCollectRentUnlocked ? 'true' : 'false');

        const housing = HOUSING_TIERS.find((h) => h.tier === player.housingTier);
        updateSlotMeta(activeSlotId, {
          isEmpty: false,
          playerName: player.name,
          daysPlayed: player.daysPlayed,
          level: player.level,
          netWorth,
          cash: player.cash,
          creditScore: player.creditScore,
          housingTier: player.housingTier,
          housingName: housing?.name || "Mom's Couch",
        });
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('hustle_sim_current_session_slot');
    setActiveSlotId(null);
    setSlotsMeta(getAllSlotsMeta());
  }, [
    activeSlotId,
    player,
    bankAccounts,
    creditCards,
    loans,
    ownedBusinesses,
    marketProperties,
    ownedProperties,
    stocks,
    portfolio,
    achievements,
    dailyMissions,
    newsFeed,
    tutorialStep,
    autoCollectRentUnlocked,
    netWorth,
  ]);

  // Reset Game to start fresh within current slot
  const resetGame = () => {
    if (activeSlotId !== null) {
      startNewGameInSlot(activeSlotId, player.name);
      triggerFeedback(`Slot ${activeSlotId} reset to Day 1`, 'info');
    }
  };

  return (
    <GameContext.Provider
      value={{
        player,
        bankAccounts,
        creditCards,
        loans,
        availableJobs,
        educationCourses,
        enrollInEducation,
        ownedBusinesses,
        marketProperties,
        ownedProperties,
        stocks,
        portfolio,
        newsFeed,
        dailyMissions,
        achievements,
        goals,
        currentEvent,
        activeAuction,
        feedbackQueue,
        activeTab,
        tutorialStep,
        autoCollectRentUnlocked,
        netWorth,
        totalDebt,
        monthlyIncome,
        monthlyExpenses,

        activeSlotId,
        slotsMeta,
        startNewGameInSlot,
        loadGameSlot,
        deleteGameSlot,
        exitToMainMenu,
        manualSave,
        refreshSlotsMeta,

        setActiveTab,
        advanceTime,
        doJob,
        eatMeal,
        sleep,
        takeNap,
        upgradeHousing,
        buyTransportation,
        financeVehicle,

        openBankAccount,
        depositBank,
        withdrawBank,
        payCreditCard,
        applyCreditCard,
        takeLoan,
        payLoan,
        payMonthlyLoanDue,
        fileBankruptcyRebuild,

        isStoreModalOpen,
        setIsStoreModalOpen,
        buyGemsWithPaystack,
        exchangeGemsForCash,
        useGemPerk,

        buyStock,
        sellStock,
        toggleWatchlistStock,

        buyProperty,
        renovatePropertyArea,
        setTenantToProperty,
        evictTenant,
        collectRent,
        toggleWatchlistProperty,
        startAuction,
        bidInAuction,
        closeAuction,
        unlockAutoCollectManager,

        subscribePropertyManagerPass,
        unlockVipClubAccess,
        buyLuxuryItem,
        buyPropertyWithGems,
        payYearlyTaxBill,
        taxRecords,
        currentYearGrossIncome,
        estimatedYearlyTaxOwed,

        startBusiness,
        depositToBusiness,
        withdrawFromBusiness,
        hireEmployee,
        fireEmployee,
        upgradeBusinessOffice,
        boostBusinessMarketing,
        adjustBusinessPricing,

        applyWeeklyJob,
        quitWeeklyJob,

        isPhoneOpen,
        setIsPhoneOpen,
        phoneActiveApp,
        setPhoneActiveApp,
        openPhoneApp,

        socialProfile,
        addSocialFollowers,
        claimCreatorEarnings,
        spendEnergy,
        earnCash,

        chooseEventOption,
        claimMissionReward,
        setSelectedGoal,
        dismissFeedback,
        setTutorialStep,
        resetGame,
        triggerFeedback,

        dailySummary,
        isDailySummaryOpen,
        setIsDailySummaryOpen,
        simulateNextDay,

        setPlayer,
        setBankAccounts,
        setCreditCards,
        setLoans,
        setOwnedProperties,
        setMarketProperties,
        setOwnedBusinesses,
        setAutoCollectRentUnlocked,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
