import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Landmark, 
  Radio, 
  Gavel, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  Clock, 
  DollarSign, 
  Check, 
  ChevronLeft, 
  CreditCard, 
  Flame, 
  AlertTriangle, 
  Building2, 
  Car, 
  Battery, 
  Wifi, 
  Award,
  Wallet,
  Coins,
  Share2,
  Lock,
  ArrowRight,
  Crown,
  Receipt,
  Briefcase,
  Newspaper,
  Camera,
  Music,
  Sliders
} from 'lucide-react';
import { FarbesApp } from './FarbesApp';
import { VipClubApp } from './VipClubApp';
import { JobsApp } from './JobsApp';
import { FinanceApp } from './FinanceApp';
import { StocksApp } from './StocksApp';
import { TakTakApp } from './TakTakApp';
import { SGramApp } from './SGramApp';
import { NewsApp } from './NewsApp';
import { MLSApp } from './MLSApp';
import { AdminPage } from '../admin/AdminPage';

interface ScannedDeal {
  id: string;
  title: string;
  category: 'real_estate' | 'vehicle' | 'business' | 'luxury';
  marketValue: number;
  dealPrice: number;
  discountPercent: number;
  expiresInSeconds: number;
  description: string;
  source: string;
}

interface AuctionItem {
  id: string;
  title: string;
  type: 'foreclosure' | 'seized_vehicle' | 'commercial' | 'liquidation';
  marketValue: number;
  currentBid: number;
  minBidIncrement: number;
  buyNowPrice: number;
  secondsRemaining: number;
  highestBidder: string;
  isPlayerHighest: boolean;
  bidsCount: number;
  description: string;
  status: 'active' | 'won' | 'lost';
}

export const PhoneView: React.FC = () => {
  const { 
    isPhoneOpen, 
    setIsPhoneOpen, 
    phoneActiveApp, 
    setPhoneActiveApp,
    player,
    socialProfile,
    stocks,
    portfolio,
    buyStock,
    sellStock,
    bankAccounts,
    depositBank,
    withdrawBank,
    buyProperty,
    ownedProperties,
    startBusiness,
    buyTransportation
  } = useGame();

  // Market Scanner State
  const [scannedDeals, setScannedDeals] = useState<ScannedDeal[]>([
    {
      id: 'deal-1',
      title: 'Distressed Suburban Duplex',
      category: 'real_estate',
      marketValue: 180000,
      dealPrice: 125000,
      discountPercent: 31,
      expiresInSeconds: 140,
      description: 'Owner relocated out of state. Urgent pre-foreclosure short sale.',
      source: 'Off-Market MLS Wholesaler'
    },
    {
      id: 'deal-2',
      title: 'Executive Fleet Tesla Model S',
      category: 'vehicle',
      marketValue: 65000,
      dealPrice: 42000,
      discountPercent: 35,
      expiresInSeconds: 220,
      description: 'Corporate executive lease return with clean title and low mileage.',
      source: 'Wholesale Dealer Exchange'
    },
    {
      id: 'deal-3',
      title: 'Turnkey Laundromat Franchise',
      category: 'business',
      marketValue: 350000,
      dealPrice: 245000,
      discountPercent: 30,
      expiresInSeconds: 95,
      description: 'Retiring owner looking for immediate cash buyout with steady passive revenue.',
      source: 'BizBuySell Fast Track'
    },
    {
      id: 'deal-4',
      title: 'Swiss Chronograph 18k Rose Gold',
      category: 'luxury',
      marketValue: 28000,
      dealPrice: 19500,
      discountPercent: 30,
      expiresInSeconds: 180,
      description: 'Estate jeweler liquidation auction certified authentic with papers.',
      source: 'Pawn Broker Vault'
    }
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerToast, setScannerToast] = useState<string | null>(null);

  // Distressed Auctions State
  const [auctions, setAuctions] = useState<AuctionItem[]>([
    {
      id: 'auc-1',
      title: 'Foreclosed Downtown Loft Condominium',
      type: 'foreclosure',
      marketValue: 240000,
      currentBid: 145000,
      minBidIncrement: 5000,
      buyNowPrice: 175000,
      secondsRemaining: 45,
      highestBidder: 'ApexHoldings_LLC',
      isPlayerHighest: false,
      bidsCount: 14,
      description: 'Bank seized luxury penthouse unit in financial district. Sold as-is.',
      status: 'active'
    },
    {
      id: 'auc-2',
      title: 'Repossessed Porsche 911 GT3',
      type: 'seized_vehicle',
      marketValue: 190000,
      currentBid: 95000,
      minBidIncrement: 5000,
      buyNowPrice: 130000,
      secondsRemaining: 30,
      highestBidder: 'Collector_G',
      isPlayerHighest: false,
      bidsCount: 22,
      description: 'Custom sports coupe recovered from collateral seizure. Pristine engine.',
      status: 'active'
    },
    {
      id: 'auc-3',
      title: 'Liquidated Industrial Machine Shop',
      type: 'liquidation',
      marketValue: 450000,
      currentBid: 260000,
      minBidIncrement: 10000,
      buyNowPrice: 320000,
      secondsRemaining: 58,
      highestBidder: 'TurnkeyCapital',
      isPlayerHighest: false,
      bidsCount: 19,
      description: 'Full commercial production facility and tooling liquidated under bankruptcy.',
      status: 'active'
    }
  ]);
  const [auctionToast, setAuctionToast] = useState<string | null>(null);

  // Auction countdown timers & AI rival bidding simulation
  useEffect(() => {
    if (!isPhoneOpen) return;
    const interval = setInterval(() => {
      // Countdown scanner deals
      setScannedDeals((prev) => 
        prev.map((deal) => ({
          ...deal,
          expiresInSeconds: Math.max(0, deal.expiresInSeconds - 1)
        })).filter((d) => d.expiresInSeconds > 0)
      );

      // Countdown auctions
      setAuctions((prev) => 
        prev.map((auc) => {
          if (auc.status !== 'active') return auc;
          const nextSec = auc.secondsRemaining - 1;
          
          // Random rival bid chance if seconds < 20 and player is winning or time running low
          const shouldRivalBid = nextSec > 2 && Math.random() < 0.25 && auc.currentBid < auc.buyNowPrice * 0.9;
          if (shouldRivalBid) {
            const rivalNames = ['Venture_Kai', 'HedgeWhale_9', 'AlphaCap', 'BillionaireSam'];
            const randomRival = rivalNames[Math.floor(Math.random() * rivalNames.length)];
            return {
              ...auc,
              secondsRemaining: Math.max(nextSec, 15), // Reset timer slightly on competitive bid
              currentBid: auc.currentBid + auc.minBidIncrement,
              highestBidder: randomRival,
              isPlayerHighest: false,
              bidsCount: auc.bidsCount + 1
            };
          }

          if (nextSec <= 0) {
            return {
              ...auc,
              secondsRemaining: 0,
              status: auc.isPlayerHighest ? 'won' : 'lost'
            };
          }

          return { ...auc, secondsRemaining: nextSec };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isPhoneOpen]);

  if (!isPhoneOpen) return null;

  // Handlers for Scanner
  const handleRefreshScanner = () => {
    if (player.energy < 5) {
      setScannerToast('Need at least 5⚡ energy to scan new deals');
      setTimeout(() => setScannerToast(null), 2500);
      return;
    }
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const newItems: ScannedDeal[] = [
        {
          id: `deal-${Date.now()}-1`,
          title: 'Bank Foreclosure Starter Home',
          category: 'real_estate',
          marketValue: 140000,
          dealPrice: 95000,
          discountPercent: 32,
          expiresInSeconds: 150,
          description: 'Instant equity upside. Needs light cosmetic updates.',
          source: 'City Clerk Public Records'
        },
        {
          id: `deal-${Date.now()}-2`,
          title: 'Repossessed Commercial Van Fleet',
          category: 'vehicle',
          marketValue: 55000,
          dealPrice: 34000,
          discountPercent: 38,
          expiresInSeconds: 200,
          description: '3 Delivery vans ready for immediate logistics operations.',
          source: 'Sheriff Auto Auction'
        },
        {
          id: `deal-${Date.now()}-3`,
          title: 'Established Boutique Fitness Studio',
          category: 'business',
          marketValue: 280000,
          dealPrice: 190000,
          discountPercent: 32,
          expiresInSeconds: 120,
          description: 'Over 180 recurring memberships in prime suburban plaza.',
          source: 'Private Equity Flip'
        }
      ];
      setScannedDeals(newItems);
      setScannerToast('Scanner locked on 3 high-yield arbitrage deals!');
      setTimeout(() => setScannerToast(null), 2500);
    }, 1200);
  };

  const handleExecuteDeal = (deal: ScannedDeal) => {
    if (player.cash < deal.dealPrice) {
      setScannerToast(`Insufficient Cash! Need ${formatCurrency(deal.dealPrice)}`);
      setTimeout(() => setScannerToast(null), 2500);
      return;
    }

    // Instant flip arbitrage or portfolio acquisition
    const profit = deal.marketValue - deal.dealPrice;
    player.cash -= deal.dealPrice;
    player.cash += deal.marketValue; // Instant arbitrage flip reward
    setScannedDeals((prev) => prev.filter((d) => d.id !== deal.id));
    setScannerToast(`Success! Acquired & arbitrated ${deal.title} for a net profit of +${formatCurrency(profit)}!`);
    setTimeout(() => setScannerToast(null), 3500);
  };

  // Handlers for Auctions
  const handlePlaceBid = (auction: AuctionItem) => {
    const nextBid = auction.currentBid + auction.minBidIncrement;
    if (player.cash < nextBid) {
      setAuctionToast(`Insufficient funds to place bid of ${formatCurrency(nextBid)}!`);
      setTimeout(() => setAuctionToast(null), 2500);
      return;
    }

    setAuctions((prev) => 
      prev.map((a) => {
        if (a.id !== auction.id) return a;
        return {
          ...a,
          currentBid: nextBid,
          highestBidder: player.name,
          isPlayerHighest: true,
          bidsCount: a.bidsCount + 1,
          secondsRemaining: Math.max(a.secondsRemaining, 18) // Add time on fresh bid
        };
      })
    );

    setAuctionToast(`Bid placed for ${formatCurrency(nextBid)}! You are currently the highest bidder!`);
    setTimeout(() => setAuctionToast(null), 2500);
  };

  const handleBuyNowAuction = (auction: AuctionItem) => {
    if (player.cash < auction.buyNowPrice) {
      setAuctionToast(`Need ${formatCurrency(auction.buyNowPrice)} for instant buyout!`);
      setTimeout(() => setAuctionToast(null), 2500);
      return;
    }

    player.cash -= auction.buyNowPrice;
    const instantEquity = auction.marketValue - auction.buyNowPrice;
    player.cash += auction.marketValue; // Claim liquidated asset equity

    setAuctions((prev) => 
      prev.map((a) => {
        if (a.id !== auction.id) return a;
        return {
          ...a,
          status: 'won',
          secondsRemaining: 0,
          highestBidder: player.name,
          isPlayerHighest: true
        };
      })
    );

    setAuctionToast(`WON! Acquired ${auction.title} via Buy-It-Now for +${formatCurrency(instantEquity)} profit!`);
    setTimeout(() => setAuctionToast(null), 3500);
  };

  // Portfolio total
  const totalStockValue = portfolio.reduce((sum, h) => {
    const s = stocks.find((item) => item.id === h.stockId);
    return sum + (s ? s.price * h.shares : 0);
  }, 0);

  if (!isPhoneOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200">
      {/* iPhone Device Chassis */}
      <div className="relative w-full max-w-[390px] h-[780px] max-h-[94vh] bg-slate-950 rounded-[48px] border-[5px] border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Outer Matte Rim Reflections */}
        <div className="absolute inset-0 rounded-[43px] border border-white/10 pointer-events-none z-40" />

        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 w-28 h-6 bg-black rounded-full flex items-center justify-between px-3 shadow-md border border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-950/80 border border-indigo-500/40" />
          </div>
        </div>

        {/* iOS Status Bar */}
        <div className="h-10 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-200 z-30 shrink-0">
          <span>{formatTime(player.currentHour, player.currentMinute)}</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[9px] font-bold tracking-tighter text-slate-400">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">{player.energy}%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* iPhone Viewport Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
          {/* Active App Header Bar */}
          {phoneActiveApp !== 'home' && (
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
              <button
                onClick={() => setPhoneActiveApp('home')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Home</span>
              </button>

              <span className="text-xs font-bold capitalize text-slate-200">
                {phoneActiveApp === 'jobs' && '💼 WorkForce PRO'}
                {(phoneActiveApp === 'bank' || phoneActiveApp === 'finance') && '🏦 Vance Mobile Bank'}
                {phoneActiveApp === 'stocks' && '📈 iStocks Exchange'}
                {phoneActiveApp === 'taktak' && '🎵 TakTak'}
                {phoneActiveApp === 'sgram' && '📸 SGram'}
                {phoneActiveApp === 'news' && '📰 Empire News'}
                {phoneActiveApp === 'scanner' && '📡 DealRadar Scanner'}
                {phoneActiveApp === 'auctions' && '🔨 Distressed Auctions'}
                {phoneActiveApp === 'farbes' && '🏆 Farbes 100 Richest'}
                {phoneActiveApp === 'vip' && '👑 VIP Club & Luxury'}
                {phoneActiveApp === 'mls' && '🏡 MLS Real Estate Portal'}
                {phoneActiveApp === 'admin' && '⚡ Admin God Mode'}
              </span>

              <button
                onClick={() => setIsPhoneOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Close Phone"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 1: HOME SCREEN */}
          {phoneActiveApp === 'home' && (
            <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto no-scrollbar">
              {/* Close Button top-right */}
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] font-bold text-slate-400">Monday, Day {player.daysPlayed}</span>
                <button
                  onClick={() => setIsPhoneOpen(false)}
                  className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  title="Close iPhone"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* iOS Live Widgets */}
              <div className="space-y-2.5 pt-2">
                {/* Financial Summary Widget */}
                <div 
                  onClick={() => setPhoneActiveApp('bank')}
                  className="bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-900/90 border border-indigo-500/30 rounded-3xl p-3.5 shadow-xl backdrop-blur-md cursor-pointer hover:border-indigo-400/50 transition group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-300">Vance Mobile Bank</span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="text-xl font-black text-slate-100 tracking-tight group-hover:text-emerald-300 transition">
                    {formatCurrency(player.cash)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Portfolio: <strong className="text-indigo-300">{formatCurrency(totalStockValue)}</strong></span>
                    <span>Credit: <strong className="text-emerald-400">{player.creditScore}</strong></span>
                  </div>
                </div>

                {/* Social Media & News Pulse Widget */}
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    onClick={() => setPhoneActiveApp('taktak')}
                    className="p-2.5 rounded-2xl bg-gradient-to-br from-pink-950/60 to-slate-900 border border-pink-500/30 hover:border-pink-400/60 transition cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-tight text-pink-400">TakTak</span>
                      <Flame className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                    </div>
                    <div className="text-sm font-black text-white mt-1">
                      {socialProfile.taktakFollowers > 1000 
                        ? `${(socialProfile.taktakFollowers / 1000).toFixed(1)}k` 
                        : socialProfile.taktakFollowers}
                    </div>
                    <span className="text-[9px] text-slate-400">Followers</span>
                  </div>

                  <div 
                    onClick={() => setPhoneActiveApp('sgram')}
                    className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-950/60 via-purple-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-400/60 transition cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-tight text-amber-300">SGram</span>
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-sm font-black text-white mt-1">
                      {socialProfile.sgramFollowers > 1000 
                        ? `${(socialProfile.sgramFollowers / 1000).toFixed(1)}k` 
                        : socialProfile.sgramFollowers}
                    </div>
                    <span className="text-[9px] text-slate-400">Reach</span>
                  </div>
                </div>
              </div>

              {/* iOS App Grid */}
              <div className="py-3">
                <div className="grid grid-cols-4 gap-y-3.5 gap-x-2 text-center">
                  {/* App 1: TakTak Social */}
                  <button
                    onClick={() => setPhoneActiveApp('taktak')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-tr from-black via-pink-950 to-cyan-950 border border-pink-500/40 shadow-lg flex items-center justify-center text-pink-400 group-hover:scale-105 transition relative">
                      <Flame className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-[8px] font-black text-white flex items-center justify-center shadow">
                        HOT
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">TakTak</span>
                  </button>

                  {/* App 2: SGram Social */}
                  <button
                    onClick={() => setPhoneActiveApp('sgram')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 border border-white/20 shadow-lg flex items-center justify-center text-white group-hover:scale-105 transition">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">SGram</span>
                  </button>

                  {/* App 3: Empire News */}
                  <button
                    onClick={() => setPhoneActiveApp('news')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-rose-600 to-rose-900 border border-rose-400/50 shadow-lg flex items-center justify-center text-white group-hover:scale-105 transition relative">
                      <Newspaper className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">News</span>
                  </button>

                  {/* App 4: Stocks */}
                  <button
                    onClick={() => setPhoneActiveApp('stocks')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-slate-900 to-black border border-emerald-500/40 shadow-lg flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">Stocks</span>
                  </button>

                  {/* App 5: Bank / Finance */}
                  <button
                    onClick={() => setPhoneActiveApp('bank')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-emerald-600 to-emerald-900 border border-emerald-400/50 shadow-lg flex items-center justify-center text-white group-hover:scale-105 transition">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">Finance</span>
                  </button>

                  {/* App 6: Jobs / WorkForce */}
                  <button
                    onClick={() => setPhoneActiveApp('jobs')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-blue-600 to-indigo-900 border border-blue-400/50 shadow-lg flex items-center justify-center text-white group-hover:scale-105 transition">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">Jobs</span>
                  </button>

                  {/* App 7: Market Scanner */}
                  <button
                    onClick={() => setPhoneActiveApp('scanner')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-cyan-600 to-blue-950 border border-cyan-400/50 shadow-lg flex items-center justify-center text-white group-hover:scale-105 transition">
                      <Radio className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">Scanner</span>
                  </button>

                  {/* App 8: Distressed Auctions */}
                  <button
                    onClick={() => setPhoneActiveApp('auctions')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-amber-600 to-orange-950 border border-amber-400/50 shadow-lg flex items-center justify-center text-white group-hover:scale-105 transition">
                      <Gavel className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-200">Auctions</span>
                  </button>

                  {/* App 9: Farbes Richest 100 */}
                  <button
                    onClick={() => setPhoneActiveApp('farbes')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-amber-400 via-amber-600 to-slate-950 border border-amber-300/80 shadow-xl flex items-center justify-center text-slate-950 group-hover:scale-105 transition relative">
                      <Award className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                      <span className="absolute -bottom-1 text-[7px] font-black tracking-tighter bg-black text-amber-300 px-1 rounded">100</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-300">Farbes</span>
                  </button>

                  {/* App 10: VIP Club & Luxury */}
                  <button
                    onClick={() => setPhoneActiveApp('vip')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-black border border-amber-500/60 shadow-xl flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                      <Crown className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200">VIP Club</span>
                  </button>

                  {/* App 11: MLS Real Estate */}
                  <button
                    onClick={() => setPhoneActiveApp('mls')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-indigo-600 to-indigo-950 border border-indigo-400/50 shadow-xl flex items-center justify-center text-white group-hover:scale-105 transition">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-300">MLS Market</span>
                  </button>

                  {/* App 12: Admin God Mode */}
                  <button
                    onClick={() => setPhoneActiveApp('admin')}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition"
                  >
                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-b from-rose-600 to-slate-950 border border-rose-500/50 shadow-xl flex items-center justify-center text-white group-hover:scale-105 transition">
                      <Sliders className="w-5 h-5 text-rose-300" />
                    </div>
                    <span className="text-[10px] font-black text-rose-400">Admin</span>
                  </button>
                </div>
              </div>

              {/* iOS Bottom Dock */}
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[28px] p-2 mb-1 flex items-center justify-around shadow-2xl">
                <button 
                  onClick={() => setPhoneActiveApp('bank')} 
                  className="w-11 h-11 rounded-[18px] bg-gradient-to-b from-emerald-600 to-emerald-900 text-white flex items-center justify-center shadow hover:scale-105 transition cursor-pointer" 
                  title="Finance"
                >
                  <Landmark className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setPhoneActiveApp('taktak')} 
                  className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-black via-pink-900 to-cyan-950 text-pink-400 flex items-center justify-center shadow hover:scale-105 transition cursor-pointer" 
                  title="TakTak"
                >
                  <Flame className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setPhoneActiveApp('sgram')} 
                  className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow hover:scale-105 transition cursor-pointer" 
                  title="SGram"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setPhoneActiveApp('stocks')} 
                  className="w-11 h-11 rounded-[18px] bg-gradient-to-b from-slate-900 to-black border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow hover:scale-105 transition cursor-pointer" 
                  title="Stocks"
                >
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: iSTOCKS APP */}
          {phoneActiveApp === 'stocks' && (
            <StocksApp onBack={() => setPhoneActiveApp('home')} />
          )}

          {/* SCREEN: WORKFORCE PRO JOBS APP */}
          {phoneActiveApp === 'jobs' && (
            <JobsApp onBack={() => setPhoneActiveApp('home')} />
          )}

          {/* SCREEN: VANCE MOBILE BANK & FULL FINANCE APP */}
          {(phoneActiveApp === 'bank' || phoneActiveApp === 'finance') && (
            <FinanceApp onBack={() => setPhoneActiveApp('home')} />
          )}

          {/* SCREEN 4: DEALRADAR SCANNER */}
          {phoneActiveApp === 'scanner' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Scan Bar */}
              <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <h3 className="text-xs font-bold text-slate-100">DealRadar City Scanner</h3>
                  </div>
                  <p className="text-[10px] text-slate-400">Scouts off-market wholesale & distressed arbitrage</p>
                </div>

                <button
                  disabled={isScanning}
                  onClick={handleRefreshScanner}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition cursor-pointer shadow-md active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Scanning...' : 'Scan Now (5⚡)'}</span>
                </button>
              </div>

              {scannerToast && (
                <div className="m-3 p-2 bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-xs font-semibold rounded-xl text-center">
                  {scannerToast}
                </div>
              )}

              {/* Scanned Deals Feed */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
                {scannedDeals.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Radio className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs">No active deals found. Tap "Scan Now" to search city records for wholesale arbitrage.</p>
                  </div>
                ) : (
                  scannedDeals.map((deal) => {
                    const profitPotential = deal.marketValue - deal.dealPrice;
                    const canAfford = player.cash >= deal.dealPrice;

                    return (
                      <div
                        key={deal.id}
                        className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 shadow-md space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                                -{deal.discountPercent}% OFF
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">{deal.source}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-100 mt-1">{deal.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{deal.description}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-emerald-400 block">{formatCurrency(deal.dealPrice)}</span>
                            <span className="text-[10px] text-slate-500 line-through block">Val: {formatCurrency(deal.marketValue)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          <span className="text-emerald-300 font-bold">Instant Arbitrage Spread: +{formatCurrency(profitPotential)}</span>
                          <span className="text-amber-400 flex items-center gap-1 font-semibold">
                            <Clock className="w-3 h-3" />
                            {deal.expiresInSeconds}s
                          </span>
                        </div>

                        <button
                          disabled={!canAfford}
                          onClick={() => handleExecuteDeal(deal)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                            canAfford
                              ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-cyan-950/40 active:scale-98'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>{canAfford ? `EXECUTE ARBITRAGE BUYOUT (${formatCurrency(deal.dealPrice)})` : `NEED ${formatCurrency(deal.dealPrice - player.cash)} MORE CASH`}</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* SCREEN 5: DISTRESSED AUCTIONS */}
          {phoneActiveApp === 'auctions' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Gavel className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-slate-100">Live Distressed Auctions</h3>
                  </div>
                  <p className="text-[10px] text-slate-400">Foreclosures, liquidated estates & repossessed assets</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-amber-950/70 border border-amber-800 text-amber-300 rounded-lg animate-pulse">
                  LIVE BIDDING
                </span>
              </div>

              {auctionToast && (
                <div className="m-3 p-2 bg-amber-950/90 border border-amber-500/50 text-amber-300 text-xs font-semibold rounded-xl text-center">
                  {auctionToast}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-3 space-y-3.5 no-scrollbar">
                {auctions.map((auc) => {
                  const isWinning = auc.isPlayerHighest;
                  const isEnded = auc.status !== 'active';
                  const nextMinBid = auc.currentBid + auc.minBidIncrement;
                  const canBid = player.cash >= nextMinBid && !isEnded;
                  const canBuyNow = player.cash >= auc.buyNowPrice && !isEnded;

                  return (
                    <div
                      key={auc.id}
                      className={`rounded-2xl p-3.5 border transition shadow-lg space-y-3 ${
                        isWinning
                          ? 'bg-emerald-950/30 border-emerald-500/70 ring-1 ring-emerald-500/30'
                          : auc.status === 'won'
                          ? 'bg-emerald-950/40 border-emerald-500'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold uppercase border border-slate-700">
                              {auc.type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400">{auc.bidsCount} bids</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-100 mt-1">{auc.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{auc.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block">EST. VALUE</span>
                          <span className="text-xs font-bold text-slate-200">{formatCurrency(auc.marketValue)}</span>
                        </div>
                      </div>

                      {/* Current Bid & Time Banner */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">CURRENT HIGH BID</span>
                          <span className="text-sm font-black text-amber-400">{formatCurrency(auc.currentBid)}</span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Leader: <strong className={isWinning ? 'text-emerald-400' : 'text-slate-300'}>{auc.highestBidder}</strong>
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">TIME REMAINING</span>
                          <span className={`text-sm font-black ${auc.secondsRemaining < 10 ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
                            {auc.status === 'won' ? 'COMPLETED' : `${auc.secondsRemaining}s`}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Min Step: +{formatCurrency(auc.minBidIncrement)}
                          </span>
                        </div>
                      </div>

                      {/* Bidding Actions */}
                      {auc.status === 'active' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            disabled={!canBid || isWinning}
                            onClick={() => handlePlaceBid(auc)}
                            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                              isWinning
                                ? 'bg-emerald-950 border border-emerald-600 text-emerald-300 cursor-default'
                                : canBid
                                ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-md active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }`}
                          >
                            <Gavel className="w-3.5 h-3.5" />
                            <span>{isWinning ? 'YOU LEAD BID' : `BID ${formatCurrency(nextMinBid)}`}</span>
                          </button>

                          <button
                            disabled={!canBuyNow}
                            onClick={() => handleBuyNowAuction(auc)}
                            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                              canBuyNow
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>BUY NOW ({formatCurrency(auc.buyNowPrice)})</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 text-xs font-bold text-center rounded-xl">
                          {auc.status === 'won' ? '🎉 YOU WON THIS AUCTION & CLAIMED ASSET EQUITY!' : 'AUCTION CLOSED'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCREEN 5: FARBES RICHEST 100 APP */}
          {phoneActiveApp === 'farbes' && (
            <FarbesApp onBack={() => setPhoneActiveApp('home')} />
          )}

          {/* SCREEN 6: VIP CLUB & LUXURY & PASSES APP */}
          {phoneActiveApp === 'vip' && (
            <VipClubApp onBack={() => setPhoneActiveApp('home')} />
          )}

          {/* SCREEN 7: TAKTAK APP */}
          {phoneActiveApp === 'taktak' && (
            <TakTakApp />
          )}

          {/* SCREEN 8: SGRAM APP */}
          {phoneActiveApp === 'sgram' && (
            <SGramApp />
          )}

          {/* SCREEN 9: NEWS APP */}
          {phoneActiveApp === 'news' && (
            <NewsApp />
          )}

          {/* SCREEN 10: MLS REAL ESTATE APP */}
          {phoneActiveApp === 'mls' && (
            <MLSApp onBack={() => setPhoneActiveApp('home')} />
          )}

          {/* SCREEN 11: ADMIN GOD MODE */}
          {phoneActiveApp === 'admin' && (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <AdminPage onBack={() => setPhoneActiveApp('home')} />
            </div>
          )}
        </div>

        {/* iOS Bottom Home Bar Indicator */}
        <div className="h-6 flex items-center justify-center z-40 bg-black shrink-0">
          <button
            onClick={() => {
              if (phoneActiveApp !== 'home') {
                setPhoneActiveApp('home');
              } else {
                setIsPhoneOpen(false);
              }
            }}
            className="w-36 h-1 bg-white/70 hover:bg-white active:scale-95 rounded-full transition cursor-pointer"
            title="Swipe up for Home / Close"
          />
        </div>
      </div>
    </div>
  );
};
