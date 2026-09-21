import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { NewsItem } from '../../types/game';
import { formatCurrency } from '../../utils/formatters';
import { 
  Newspaper, 
  TrendingUp, 
  Building2, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  Search,
  Clock,
  X,
  Bell,
  Landmark,
  Briefcase,
  DollarSign,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'tax' | 'rent' | 'salary' | 'business' | 'bank' | 'market';
  title: string;
  source: string;
  day: number;
  time: string;
  content: string;
  status: 'alert' | 'success' | 'info';
  amount?: number;
  actionText?: string;
}

export const NewsApp: React.FC = () => {
  const { 
    newsFeed, 
    player, 
    ownedProperties, 
    ownedBusinesses, 
    bankAccounts, 
    portfolio, 
    stocks,
    availableJobs
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'notifications' | 'stocks' | 'property' | 'economy'>('all');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Dynamic Financial & System Notifications
  const systemNotifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];

    // Tax notification
    if (player.accumulatedTaxOwed > 0) {
      items.push({
        id: 'notif-tax-lien',
        type: 'tax',
        title: 'Municipal Tax Due Notice',
        source: 'City Revenue & Treasury Bureau',
        day: player.daysPlayed,
        time: 'Active',
        content: `Outstanding unpaid municipal taxes amount to ${formatCurrency(player.accumulatedTaxOwed)}. Pay via the Tax Lien banner to avoid compounding credit penalties.`,
        status: 'alert',
        amount: player.accumulatedTaxOwed,
      });
    }

    // Rental income notifications
    const totalRent = ownedProperties.reduce((sum, p) => sum + (p.tenant ? p.tenant.agreedRent : 0), 0);
    if (ownedProperties.length > 0) {
      items.push({
        id: 'notif-rent-collected',
        type: 'rent',
        title: 'Portfolio Lease Yield Report',
        source: 'Vance Property Management',
        day: player.daysPlayed,
        time: 'Daily',
        content: `${ownedProperties.length} properties under management with ${totalRent > 0 ? formatCurrency(totalRent) + '/mo' : 'no active tenants'} contracted income.`,
        status: 'success',
        amount: totalRent,
      });
    }

    // Business notifications
    const totalBizRevenue = ownedBusinesses.reduce((sum, b) => sum + (b.revenueMonthly || 0), 0);
    if (ownedBusinesses.length > 0) {
      items.push({
        id: 'notif-business-profit',
        type: 'business',
        title: 'Commercial Enterprise Ledger',
        source: 'Venture Capital Operations',
        day: player.daysPlayed,
        time: 'Daily',
        content: `Your active enterprises are generating an estimated ${formatCurrency(totalBizRevenue)} in annualized commercial revenue across ${ownedBusinesses.length} operating businesses.`,
        status: 'info',
        amount: totalBizRevenue,
      });
    }

    // Salaried employment notification
    const activeWeeklyJob = availableJobs.find((j) => j.id === player.activeWeeklyJobId);
    if (activeWeeklyJob) {
      items.push({
        id: 'notif-job-payroll',
        type: 'salary',
        title: 'Corporate Payroll Disbursement',
        source: 'WorkForce PRO Payroll Division',
        day: player.daysPlayed,
        time: 'Weekly',
        content: `Active contract for ${activeWeeklyJob.title}. Weekly salary of ${formatCurrency(activeWeeklyJob.weeklySalary || 0)} auto-credited with ${player.weeklyJobDaysRemaining || 7} days remaining in cycle.`,
        status: 'success',
        amount: activeWeeklyJob.weeklySalary,
      });
    }

    // Banking notification
    const totalBankBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
    items.push({
      id: 'notif-bank-statement',
      type: 'bank',
      title: 'Vance Mobile Banking Summary',
      source: 'Vance Premier Bancorp',
      day: player.daysPlayed,
      time: 'Real-Time',
      content: player.hasBankAccount
        ? `Consolidated checking & savings deposits total ${formatCurrency(totalBankBalance)}. Daily APY compounding actively on your savings account.`
        : 'Open your verified FDIC-insured checking & high-yield savings account for a one-time $500 activation fee in the Finance app.',
      status: player.hasBankAccount ? 'success' : 'info',
      amount: totalBankBalance,
    });

    // Stock portfolio notification
    if (portfolio.length > 0) {
      const totalStockVal = portfolio.reduce((sum, h) => {
        const s = stocks.find((item) => item.id === h.stockId);
        return sum + (s ? s.price * h.shares : 0);
      }, 0);
      items.push({
        id: 'notif-stock-market',
        type: 'market',
        title: 'Wall Street Portfolio Valuation',
        source: 'Securities Clearing Corp',
        day: player.daysPlayed,
        time: 'Day-Close',
        content: `You hold ${portfolio.length} equity positions with a combined market equity of ${formatCurrency(totalStockVal)}.`,
        status: 'info',
        amount: totalStockVal,
      });
    }

    return items;
  }, [player, ownedProperties, ownedBusinesses, bankAccounts, portfolio, stocks]);

  // 2. Base + Augmented News Items
  const allArticles: NewsItem[] = useMemo(() => [
    ...newsFeed,
    {
      id: 'news-extra-1',
      day: player.daysPlayed,
      title: 'City Council Approves High-Speed Transit Corridor to East District',
      source: 'Metropolitan Daily',
      category: 'property',
      content: 'A unanimous vote today greenlights a $420M municipal transit expansion connecting the downtown core directly to Riverside and East District. Property appraisers expect rental yields in nearby commercial and residential hubs to surge over the coming quarters.',
      impactNote: 'Rental demand and property resale values in East District expected to increase +8% to +15%.',
      targetNeighborhoods: ['East District', 'Riverside'],
      priceMultiplier: 1.10
    },
    {
      id: 'news-extra-2',
      day: player.daysPlayed,
      title: 'MegaCore Technologies Unveils Quantum Computing Chip Architecture',
      source: 'Wall Street Chronicle',
      category: 'stocks',
      content: 'MegaCore (MGC) shares jumped in pre-market trading after the tech behemoth announced a breakthrough patent in low-power semiconductor packaging. Institutional funds are rebalancing heavy weightings into growth tech equities.',
      reliability: 90,
      targetStockIds: ['stock_mgc'],
      impactNote: 'MGC and tech index likely to experience strong upward momentum.'
    },
    {
      id: 'news-extra-3',
      day: player.daysPlayed,
      title: 'Central Reserve Bank Signals Cautious Rate Trajectory',
      source: 'Financial Herald',
      category: 'economy',
      content: 'Speaking at the annual economic symposium, Federal Reserve governors emphasized inflation stability while hinting that prime mortgage and commercial loan interest rates will remain stable through the next quarter.',
      impactNote: 'Borrowing costs remain favorable for leveraged real estate acquisitions.'
    },
    {
      id: 'news-extra-4',
      day: player.daysPlayed,
      title: 'Luxury Supercar Rally Draws High-Net-Worth Collectors to Downtown',
      source: 'Empire Lifestyle',
      category: 'economy',
      content: 'Over eighty hypercars descended on the Financial District boulevard this weekend. High-end hospitality venues and luxury retailers reported record single-day revenues.',
      impactNote: 'Consumer luxury sentiment reaches multi-month peak.'
    }
  ], [newsFeed, player.daysPlayed]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((art) => {
      const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
      const matchesSearch = 
        !searchQuery.trim() || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    if (!searchQuery.trim()) return systemNotifications;
    return systemNotifications.filter(
      (n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [systemNotifications, searchQuery]);

  const featured = filteredArticles[0] || allArticles[0];
  const listArticles = filteredArticles.slice(1);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-white relative select-none">
      {/* Top Header Bar */}
      <div className="px-4 pt-3 pb-2 border-b border-white/10 bg-black/80 backdrop-blur-md shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Newspaper className="w-5 h-5 text-rose-500" />
            <span className="font-serif font-black text-lg tracking-tight text-white">Empire News</span>
          </div>
          <div className="text-right flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Day {player.daysPlayed}</span>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news wire, notifications, alerts..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500/50"
          />
        </div>

        {/* Categories Tab Bar with Notifications & Alerts */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Top Stories
          </button>

          <button
            onClick={() => setSelectedCategory('notifications')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'notifications'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-indigo-300 hover:text-white border border-indigo-900/60'
            }`}
          >
            <Bell className="w-3 h-3" />
            <span>Alerts & Feed</span>
            <span className="px-1 py-0.2 rounded-full bg-rose-500 text-[9px] text-white font-black">
              {systemNotifications.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('stocks')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'stocks'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Wall Street
          </button>

          <button
            onClick={() => setSelectedCategory('property')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'property'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Real Estate
          </button>

          <button
            onClick={() => setSelectedCategory('economy')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'economy'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Economy
          </button>
        </div>
      </div>

      {/* Main Content Feed */}
      <div className="flex-1 overflow-y-auto p-4 pb-14 space-y-4">
        {/* If Notifications Tab is active */}
        {selectedCategory === 'notifications' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-indigo-400" />
                <span>Financial & System Notifications</span>
              </h4>
              <span className="text-[10px] text-slate-500">Live Updates</span>
            </div>

            {filteredNotifications.map((notif) => {
              const isAlert = notif.status === 'alert';
              const isSuccess = notif.status === 'success';

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition space-y-2 shadow-sm ${
                    isAlert
                      ? 'bg-amber-950/40 border-amber-500/50'
                      : isSuccess
                      ? 'bg-slate-900/90 border-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 font-bold">
                      {isAlert ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Bell className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span className={isAlert ? 'text-amber-300' : isSuccess ? 'text-emerald-300' : 'text-slate-300'}>
                        {notif.source}
                      </span>
                    </div>
                    <span className="text-slate-500">Day {notif.day} • {notif.time}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">
                    {notif.title}
                  </h4>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {notif.content}
                  </p>

                  {notif.amount !== undefined && notif.amount > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                      <span className="text-slate-400">Recorded Amount:</span>
                      <span className={`font-black ${isAlert ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {formatCurrency(notif.amount)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Historical News Wire in Notification Mode */}
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Market Wire Broadcasts
              </h4>
              {newsFeed.map((news) => (
                <div
                  key={news.id}
                  onClick={() => setActiveArticle(news)}
                  className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-indigo-400">{news.source}</span>
                    <span className="text-slate-500">Day {news.day}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-100">{news.title}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{news.content}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Top Featured Lead Card */}
            {featured && (
              <div 
                onClick={() => setActiveArticle(featured)}
                className="p-4 rounded-3xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-black border border-rose-500/30 hover:border-rose-400 transition cursor-pointer group shadow-xl space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-[10px] font-black text-white uppercase tracking-wider">
                    Breaking
                  </span>
                  <span className="text-[10px] text-slate-400">{featured.source}</span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-rose-200 transition leading-snug">
                  {featured.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {featured.content}
                </p>

                {featured.reliability && (
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md w-fit">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Market Rumor • Estimated Reliability: {featured.reliability}%</span>
                  </div>
                )}

                {featured.impactNote && (
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[11px] text-amber-300 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{featured.impactNote}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Today</span>
                  </span>
                  <span className="text-rose-400 font-bold flex items-center gap-0.5">
                    Read Full Story <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )}

            {/* Regular Article List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Latest Dispatches
              </h4>

              {listArticles.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveArticle(item)}
                  className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider">{item.source}</span>
                    <span className="text-slate-500">Day {item.day || player.daysPlayed}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug hover:text-cyan-200 transition">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>

                  {item.reliability && (
                    <div className="text-[10px] text-amber-400 font-medium pt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Reliability: {item.reliability}%</span>
                    </div>
                  )}

                  {item.impactNote && (
                    <div className="text-[10px] text-emerald-400 font-medium truncate pt-0.5">
                      ⚡ {item.impactNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col justify-between p-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold text-slate-400">{activeArticle.source}</span>
            <button 
              onClick={() => setActiveArticle(null)}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 py-4">
            <span className="px-2 py-0.5 rounded-md bg-rose-600/30 border border-rose-500/40 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
              {activeArticle.category || 'Special Report'}
            </span>

            <h2 className="text-lg font-black text-white leading-snug">
              {activeArticle.title}
            </h2>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Day {activeArticle.day || player.daysPlayed}</span>
              <span>•</span>
              <span>By Senior Financial Correspondent</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-3">
              <p>{activeArticle.content}</p>
              <p>
                Market analysts recommend that investors evaluate position sizes and verify real estate leasing agreements in affected sectors to capitalize on anticipated volatility.
              </p>
            </div>

            {activeArticle.reliability && (
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Market Rumor Factor: Estimated Intelligence Reliability at {activeArticle.reliability}%.</span>
              </div>
            )}

            {activeArticle.impactNote && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Market & Economic Impact:</span>
                </div>
                <p className="text-[11px] text-amber-100">{activeArticle.impactNote}</p>
              </div>
            )}

            {activeArticle.targetStockIds && activeArticle.targetStockIds.length > 0 && (
              <div className="text-xs text-slate-400">
                <span className="font-bold text-indigo-400">Relevant Tickers: </span>
                {activeArticle.targetStockIds.join(', ')}
              </div>
            )}

            {activeArticle.targetNeighborhoods && activeArticle.targetNeighborhoods.length > 0 && (
              <div className="text-xs text-slate-400">
                <span className="font-bold text-emerald-400">Target Neighborhoods: </span>
                {activeArticle.targetNeighborhoods.join(', ')}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveArticle(null)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
          >
            Back to News Feed
          </button>
        </div>
      )}
    </div>
  );
};
