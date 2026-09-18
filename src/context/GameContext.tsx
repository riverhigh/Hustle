import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
} from '../types/game';
import {
  INITIAL_PLAYER,
  HOUSING_TIERS,
  TRANSPORTATION_TIERS,
  MEAL_TIERS,
  INITIAL_JOBS,
  INITIAL_STOCKS,
  INITIAL_PROPERTIES_MARKET,
  INITIAL_ACHIEVEMENTS,
  INITIAL_GOALS,
  NEIGHBORHOODS,
  AI_OPPONENTS,
} from '../constants/gameData';
import {
  getAllSlotsMeta,
  getSlotStorageKey,
  updateSlotMeta,
  deleteSlotData,
  getRecentSlotId,
  setRecentSlotId,
} from '../utils/saveSlots';

interface GameContextType {
  player: PlayerProfile;
  bankAccounts: BankAccount[];
  creditCards: CreditCard[];
  loans: Loan[];
  availableJobs: JobOpportunity[];
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
  eatMeal: (tier: number) => boolean;
  sleep: () => void;
  takeNap: () => void;
  upgradeHousing: (tier: number) => boolean;
  buyTransportation: (tier: number) => boolean;
  
  // Banking & Debt
  depositBank: (accountId: 'checking' | 'savings' | 'emergency', amount: number) => boolean;
  withdrawBank: (accountId: 'checking' | 'savings' | 'emergency', amount: number) => boolean;
  payCreditCard: (cardId: string, amount: number) => boolean;
  applyCreditCard: (tier: number) => boolean;
  takeLoan: (type: 'personal' | 'business' | 'mortgage', amount: number, termMonths: number) => boolean;
  payLoan: (loanId: string, amount: number) => boolean;
  fileBankruptcyRebuild: () => void;

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

  // Businesses
  startBusiness: (typeId: string, name: string) => boolean;
  hireEmployee: (businessId: string, role: string, salary: number) => boolean;
  fireEmployee: (businessId: string, empId: string) => void;
  upgradeBusinessOffice: (businessId: string) => boolean;
  boostBusinessMarketing: (businessId: string, amount: number) => boolean;
  adjustBusinessPricing: (businessId: string, multiplier: number) => void;

  // Events & Missions & System
  chooseEventOption: (choiceId: string) => void;
  claimMissionReward: (missionId: string) => void;
  setSelectedGoal: (goalId: string) => void;
  dismissFeedback: (id: string) => void;
  setTutorialStep: (step: number) => void;
  resetGame: () => void;
  triggerFeedback: (text: string, type?: 'success' | 'warning' | 'info' | 'error', details?: string[]) => void;
}

const LOCAL_STORAGE_KEY = 'hustle_empire_sim_state_v1';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Save Slot & Menu system
  const [activeSlotId, setActiveSlotId] = useState<(1 | 2 | 3) | null>(null);
  const [slotsMeta, setSlotsMeta] = useState<SaveSlotMeta[]>(() => getAllSlotsMeta());

  const refreshSlotsMeta = useCallback(() => {
    setSlotsMeta(getAllSlotsMeta());
  }, []);

  // Load initial state from LocalStorage or defaults
  const [player, setPlayer] = useState<PlayerProfile>(INITIAL_PLAYER);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_bank');
      return saved
        ? JSON.parse(saved)
        : [
            { id: 'checking', name: 'Standard Checking', balance: 0, interestRate: 0.001 },
            { id: 'savings', name: 'High-Yield Savings (HYSA)', balance: 0, interestRate: 0.045 },
            { id: 'emergency', name: 'Emergency Reserve', balance: 0, interestRate: 0.035 },
          ];
    } catch {
      return [
        { id: 'checking', name: 'Standard Checking', balance: 0, interestRate: 0.001 },
        { id: 'savings', name: 'High-Yield Savings (HYSA)', balance: 0, interestRate: 0.045 },
        { id: 'emergency', name: 'Emergency Reserve', balance: 0, interestRate: 0.035 },
      ];
    }
  });

  const [creditCards, setCreditCards] = useState<CreditCard[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_cards');
      return saved
        ? JSON.parse(saved)
        : [
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
    } catch {
      return [];
    }
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_loans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [availableJobs, setAvailableJobs] = useState<JobOpportunity[]>(INITIAL_JOBS);
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_businesses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [marketProperties, setMarketProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_props_market');
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES_MARKET;
    } catch {
      return INITIAL_PROPERTIES_MARKET;
    }
  });

  const [ownedProperties, setOwnedProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_props_owned');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stocks, setStocks] = useState<StockItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_stocks');
      return saved ? JSON.parse(saved) : INITIAL_STOCKS;
    } catch {
      return INITIAL_STOCKS;
    }
  });

  const [portfolio, setPortfolio] = useState<StockHolding[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_portfolio');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [goals] = useState<Goal[]>(INITIAL_GOALS);
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null);
  const [activeAuction, setActiveAuction] = useState<PropertyAuction | null>(null);
  const [feedbackQueue, setFeedbackQueue] = useState<ActionFeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'hustle' | 'properties' | 'finance' | 'market' | 'self'>('hustle');
  const [tutorialStep, setTutorialStep] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_tutorial');
    return saved ? parseInt(saved, 10) : 1; // 1 = show initial prompt
  });
  const [autoCollectRentUnlocked, setAutoCollectRentUnlocked] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY + '_autocollect') === 'true';
  });

  // Trigger feedback banner
  const triggerFeedback = useCallback((text: string, type: 'success' | 'warning' | 'info' | 'error' = 'success', details?: string[]) => {
    const id = Date.now().toString() + Math.random().toString();
    setFeedbackQueue((prev) => [...prev.slice(-3), { id, text, type, details }]);
    setTimeout(() => {
      setFeedbackQueue((prev) => prev.filter((item) => item.id !== id));
    }, 4500);
  }, []);

  const dismissFeedback = (id: string) => {
    setFeedbackQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Derived financial metrics
  const totalBankBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalStockValue = portfolio.reduce((sum, h) => {
    const s = stocks.find((item) => item.id === h.stockId);
    return sum + (s ? s.price * h.shares : 0);
  }, 0);
  const totalPropertyValue = ownedProperties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalBusinessValue = ownedBusinesses.reduce((sum, b) => sum + (b.revenueMonthly * 12 + b.equipmentValue), 0);

  const totalCreditDebt = creditCards.reduce((sum, c) => sum + c.balance, 0);
  const totalLoanDebt = loans.reduce((sum, l) => sum + l.remainingBalance, 0);
  const totalDebt = totalCreditDebt + totalLoanDebt;

  const netWorth = player.cash + totalBankBalance + totalStockValue + totalPropertyValue + totalBusinessValue - totalDebt;

  // Monthly income & expenses estimation
  const monthlyRentalIncome = ownedProperties.reduce((sum, p) => sum + (p.tenant ? p.tenant.agreedRent : 0), 0);
  const monthlyBusinessProfits = ownedBusinesses.reduce((sum, b) => sum + Math.max(0, b.revenueMonthly - b.expensesMonthly), 0);
  const monthlyIncome = monthlyRentalIncome + monthlyBusinessProfits;

  const housingCost = HOUSING_TIERS.find((h) => h.tier === player.housingTier)?.costMonthly || 0;
  const transportCost = (TRANSPORTATION_TIERS.find((t) => t.tier === player.transportationTier)?.dailyCost || 0) * 30;
  const debtPayments = loans.reduce((sum, l) => sum + l.monthlyPayment, 0) + creditCards.reduce((sum, c) => sum + c.minPayment, 0);
  const propertyExpenses = ownedProperties.reduce((sum, p) => sum + p.monthlyExpenses, 0);
  const monthlyExpenses = housingCost + transportCost + debtPayments + propertyExpenses;

  // Synchronize active slot state with LocalStorage and update slot metadata
  useEffect(() => {
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
    // 1. Advance day
    setPlayer((prev) => ({
      ...prev,
      daysPlayed: prev.daysPlayed + 1,
      dayOfWeek: (prev.dayOfWeek + 1) % 7,
      currentHour: 7,
      currentMinute: 0,
    }));

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

    // 3. Businesses daily revenue generation
    if (ownedBusinesses.length > 0) {
      setOwnedBusinesses((prev) =>
        prev.map((b) => {
          const dailyRevenue = Math.round((b.revenueMonthly / 30) * (0.85 + Math.random() * 0.3));
          const dailyExpense = Math.round(b.expensesMonthly / 30);
          const profit = dailyRevenue - dailyExpense;
          if (profit > 0) {
            setPlayer((p) => ({ ...p, cash: p.cash + profit }));
          }
          return b;
        })
      );
    }

    // 4. Rent accrual on properties
    setOwnedProperties((prevProps) =>
      prevProps.map((p) => {
        if (!p.tenant) return p;
        // Tenant pays daily micro-rent or chance to pay
        const dailyRent = Math.round(p.tenant.agreedRent / 30);
        if (autoCollectRentUnlocked) {
          setPlayer((pState) => ({ ...pState, cash: pState.cash + dailyRent }));
          return p;
        } else {
          return {
            ...p,
            collectedRentUnclaimed: p.collectedRentUnclaimed + dailyRent,
          };
        }
      })
    );

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

    // 8. Slight credit score improvement for low utilization
    setPlayer((prev) => {
      const isGoodUtilization = totalCreditDebt < 200;
      const creditDelta = isGoodUtilization ? 2 : -2;
      return {
        ...prev,
        creditScore: Math.min(850, Math.max(300, prev.creditScore + creditDelta)),
      };
    });

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

    // Payout calculation with sales/negotiation skill bonus
    const negotiationBonus = 1 + (player.skills.negotiation.level - 1) * 0.05;
    const tipChance = 0.35 + player.skills.sales.level * 0.05;
    const tip = Math.random() < tipChance ? Math.round(Math.random() * (job.bonusTipMax || 10)) : 0;
    const totalPayout = Math.round(job.payoutBase * negotiationBonus + tip);

    // Apply state changes
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash + totalPayout,
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

  // Full Sleep
  const sleep = () => {
    const currentHousing = HOUSING_TIERS.find((h) => h.tier === player.housingTier)!;
    const energyRecovered = currentHousing.energyRestBonus;

    setPlayer((prev) => ({
      ...prev,
      energy: Math.min(prev.maxEnergy, energyRecovered),
    }));

    triggerFeedback('Full Night Rest', 'info', [
      `Woke up at 7:00 AM`,
      `⚡ Energy restored to ${Math.min(player.maxEnergy, energyRecovered)}`,
      `Day ${player.daysPlayed + 1} begins`,
    ]);

    triggerNewDayCycle();
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

  // Buy Transportation
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

  // Bank actions
  const depositBank = (accountId: 'checking' | 'savings' | 'emergency', amount: number): boolean => {
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

  const withdrawBank = (accountId: 'checking' | 'savings' | 'emergency', amount: number): boolean => {
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
    setPlayer((prev) => ({ ...prev, cash: prev.cash - payAmount }));
    setCreditCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, balance: c.balance - payAmount } : c))
    );

    // Boost credit score slightly on repayment
    setPlayer((prev) => ({
      ...prev,
      creditScore: Math.min(850, prev.creditScore + 3),
    }));

    triggerFeedback(`Paid $${payAmount} towards ${card.name}`, 'success', ['⭐ Credit Score +3']);
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

  // Take loan
  const takeLoan = (type: 'personal' | 'business' | 'mortgage', amount: number, termMonths: number): boolean => {
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
    };

    setLoans((prev) => [...prev, newLoan]);
    setPlayer((prev) => ({ ...prev, cash: prev.cash + amount }));
    triggerFeedback(`Loan Approved: +$${amount.toLocaleString()}`, 'success', [
      `Monthly payment: $${monthlyPayment}/mo`,
      `Term: ${termMonths} months`,
    ]);
    return true;
  };

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

    setPlayer((prev) => ({
      ...prev,
      creditScore: Math.min(850, prev.creditScore + 2),
    }));

    triggerFeedback(`Loan Principal Repaid: -$${payment}`, 'success', ['Credit score increased!']);
    return true;
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
    let totalCollected = 0;
    setOwnedProperties((prev) =>
      prev.map((p) => {
        if (propertyId && p.id !== propertyId) return p;
        totalCollected += p.collectedRentUnclaimed;
        return { ...p, collectedRentUnclaimed: 0 };
      })
    );

    if (totalCollected > 0) {
      setPlayer((prev) => ({ ...prev, cash: prev.cash + totalCollected }));
      triggerFeedback(`Collected $${totalCollected.toLocaleString()} in Rental Income!`, 'success');
    } else {
      triggerFeedback('No unclaimed rent at this moment.', 'info');
    }
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

  // Business operations
  const startBusiness = (typeId: string, name: string): boolean => {
    const templates: Record<string, { category: string; cost: number; revenue: number; expenses: number }> = {
      pressure_wash_pro: { category: 'Service', cost: 1200, revenue: 1800, expenses: 600 },
      cleaning_crew: { category: 'Commercial', cost: 2500, revenue: 3200, expenses: 1100 },
      landscaping_pros: { category: 'Outdoor', cost: 4500, revenue: 5400, expenses: 1800 },
      tech_agency: { category: 'Digital', cost: 6000, revenue: 8500, expenses: 2400 },
      moving_logistics: { category: 'Transport', cost: 12000, revenue: 16000, expenses: 5500 },
    };

    const template = templates[typeId] || templates['pressure_wash_pro'];
    if (player.cash < template.cost) {
      triggerFeedback(`Requires $${template.cost.toLocaleString()} initial startup capital!`, 'warning');
      return false;
    }

    setPlayer((prev) => ({ ...prev, cash: prev.cash - template.cost }));

    const newBiz: Business = {
      id: 'biz_' + Date.now(),
      typeId,
      name,
      category: template.category,
      revenueMonthly: template.revenue,
      expensesMonthly: template.expenses,
      customersCount: 12,
      reputation: 60,
      officeTier: 1,
      equipmentValue: Math.round(template.cost * 0.7),
      employees: [],
      contracts: [],
      priceMultiplier: 1.0,
      marketingBudgetMonthly: 150,
    };

    setOwnedBusinesses((prev) => [...prev, newBiz]);
    addPlayerXP(250);
    addSkillXP('business', 40);
    triggerFeedback(`Launched ${name}!`, 'success', [
      `Estimated Revenue: $${template.revenue}/mo`,
      `Estimated Expenses: $${template.expenses}/mo`,
      `Check the Hustle tab to manage operations!`,
    ]);
    return true;
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
      const pRaw = localStorage.getItem(getSlotStorageKey(slotId, 'player'));
      const loadedPlayer: PlayerProfile = pRaw ? JSON.parse(pRaw) : INITIAL_PLAYER;
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

      setActiveSlotId(slotId);
      setRecentSlotId(slotId);
      setSlotsMeta(getAllSlotsMeta());

      triggerFeedback(`🎮 Loaded Save Slot ${slotId}: ${loadedPlayer.name} (Day ${loadedPlayer.daysPlayed})`, 'success');
    } catch {
      triggerFeedback(`Failed to load Save Slot ${slotId}`, 'error');
    }
  }, [triggerFeedback]);

  // Start new game in selected slot
  const startNewGameInSlot = useCallback((
    slotId: 1 | 2 | 3, 
    playerName: string, 
    startingBonus: 'energy' | 'cash' | 'credit' = 'cash'
  ) => {
    const trimmedName = playerName.trim() || 'Alex Vance';
    
    // Configure starting profile with selected perk
    const newPlayer: PlayerProfile = {
      ...INITIAL_PLAYER,
      name: trimmedName,
      cash: startingBonus === 'cash' ? 150 : 100,
      energy: startingBonus === 'energy' ? 90 : 80,
      creditScore: startingBonus === 'credit' ? 580 : 550,
    };

    const initialBank: BankAccount[] = [
      { id: 'checking', name: 'Standard Checking', balance: 0, interestRate: 0.001 },
      { id: 'savings', name: 'High-Yield Savings (HYSA)', balance: 0, interestRate: 0.045 },
      { id: 'emergency', name: 'Emergency Reserve', balance: 0, interestRate: 0.035 },
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

    setActiveSlotId(slotId);
    setRecentSlotId(slotId);

    triggerFeedback(`✨ Welcome to the city, ${trimmedName}! Your hustle begins in Slot ${slotId}.`, 'success');
  }, [triggerFeedback]);

  // Delete slot data
  const deleteGameSlot = useCallback((slotId: 1 | 2 | 3) => {
    const updated = deleteSlotData(slotId);
    setSlotsMeta(updated);
    if (activeSlotId === slotId) {
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

        depositBank,
        withdrawBank,
        payCreditCard,
        applyCreditCard,
        takeLoan,
        payLoan,
        fileBankruptcyRebuild,

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

        startBusiness,
        hireEmployee,
        fireEmployee,
        upgradeBusinessOffice,
        boostBusinessMarketing,
        adjustBusinessPricing,

        chooseEventOption,
        claimMissionReward,
        setSelectedGoal,
        dismissFeedback,
        setTutorialStep,
        resetGame,
        triggerFeedback,
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
