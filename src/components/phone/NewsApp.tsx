import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NewsItem } from '../../types/game';
import { 
  Newspaper, 
  TrendingUp, 
  Building2, 
  AlertCircle, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  Search,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';

export const NewsApp: React.FC = () => {
  const { newsFeed, player } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stocks' | 'property' | 'economy'>('all');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Augmented news articles with additional economic journalism
  const allArticles: NewsItem[] = [
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
  ];

  const filtered = allArticles.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = filtered[0] || allArticles[0];
  const listArticles = filtered.slice(1);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-white relative select-none">
      {/* Top Header Bar */}
      <div className="px-4 pt-3 pb-2 border-b border-white/10 bg-black/80 backdrop-blur-md shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Newspaper className="w-5 h-5 text-rose-500" />
            <span className="font-serif font-black text-lg tracking-tight text-white">Empire News</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Day {player.daysPlayed}</span>
            <span className="text-[10px] text-emerald-400 font-bold">Markets Active</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news, stocks, zoning..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500/50"
          />
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          {(['all', 'stocks', 'property', 'economy'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap transition cursor-pointer ${selectedCategory === cat ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              {cat === 'all' ? 'Top Stories' : cat === 'stocks' ? 'Wall Street' : cat === 'property' ? 'Real Estate' : 'Economy'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Articles Scrollable Feed */}
      <div className="flex-1 overflow-y-auto p-4 pb-12 space-y-4">
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

              {item.impactNote && (
                <div className="text-[10px] text-emerald-400 font-medium truncate pt-0.5">
                  ⚡ {item.impactNote}
                </div>
              )}
            </div>
          ))}
        </div>
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
                Market analysts recommend that operators and investors evaluate position sizes and verify real estate leasing agreements in affected sectors to capitalize on anticipated volatility.
              </p>
            </div>

            {activeArticle.impactNote && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Market & Economic Impact:</span>
                </div>
                <p className="text-[11px] text-amber-100">{activeArticle.impactNote}</p>
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
