import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AssetCategory, StockItem } from '../../types/game';
import { formatCurrency } from '../../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Bookmark, 
  DollarSign, 
  ChevronLeft,
  X, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  PieChart,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface StocksAppProps {
  onBack: () => void;
}

export const StocksApp: React.FC<StocksAppProps> = ({ onBack }) => {
  const {
    player,
    stocks,
    portfolio,
    buyStock,
    sellStock,
    toggleWatchlistStock,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [tradeShares, setTradeShares] = useState<number>(1);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [tradeToast, setTradeToast] = useState<string | null>(null);

  // Portfolio metrics
  const totalStockValue = portfolio.reduce((sum, h) => {
    const s = stocks.find((item) => item.id === h.stockId);
    return sum + (s ? s.price * h.shares : 0);
  }, 0);

  const totalCostBasis = portfolio.reduce((sum, h) => sum + h.shares * h.avgBuyPrice, 0);
  const totalGainLoss = totalStockValue - totalCostBasis;
  const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  // Filtered stocks list
  const filteredStocks = stocks.filter((s) => {
    if (onlyWatchlist && !s.isWatchlist) return false;
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    }
    return true;
  });

  const showToast = (msg: string) => {
    setTradeToast(msg);
    setTimeout(() => setTradeToast(null), 2500);
  };

  // Sparkline generator
  const renderSparkline = (history: number[], isPositive: boolean) => {
    if (!history || history.length < 2) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const width = 64;
    const height = 22;

    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isPositive ? '#10b981' : '#f43f5e'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  // Detailed Modal Chart
  const renderDetailedChart = (history: number[], isPositive: boolean) => {
    if (!history || history.length < 2) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const width = 300;
    const height = 90;

    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 12) - 6;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
        <defs>
          <linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
            <stop offset="100%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#stockAreaGrad)"
          points={`0,${height} ${points} ${width},${height}`}
        />
        <polyline
          fill="none"
          stroke={isPositive ? '#10b981' : '#f43f5e'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const selectedHolding = selectedStock ? portfolio.find((h) => h.stockId === selectedStock.id) : null;
  const maxAffordableShares = selectedStock ? Math.floor(player.cash / selectedStock.price) : 0;
  const currentHoldingShares = selectedHolding?.shares || 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Top App Header */}
      <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
              <span>iStocks Exchange</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <span className="text-[10px] text-slate-400">Live NYSE & NASDAQ Simulator</span>
          </div>
        </div>

        <button
          onClick={() => setOnlyWatchlist(!onlyWatchlist)}
          className={`p-1.5 rounded-xl border transition cursor-pointer ${
            onlyWatchlist
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Watchlist Filter"
        >
          <Bookmark className={`w-3.5 h-3.5 ${onlyWatchlist ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Portfolio Card */}
      <div className="p-3 bg-gradient-to-br from-indigo-950/70 via-slate-900/80 to-slate-950 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Portfolio Value
            </span>
            <div className="text-xl font-black text-white tracking-tight mt-0.5">
              {formatCurrency(totalStockValue)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Unrealized P/L
            </span>
            <div className={`text-xs font-black flex items-center justify-end gap-1 mt-0.5 ${
              totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {totalGainLoss >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)} ({totalGainLossPercent.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
          <span>Buying Power: <strong className="text-emerald-400">{formatCurrency(player.cash)}</strong></span>
          <span>Positions: <strong className="text-indigo-300">{portfolio.length} Assets</strong></span>
        </div>

        {tradeToast && (
          <div className="mt-2 text-xs bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-3 py-1.5 rounded-xl text-center font-bold animate-in fade-in">
            {tradeToast}
          </div>
        )}
      </div>

      {/* Search & Category Tabs */}
      <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/80 space-y-2 shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symbol (e.g. SPY, TSLA, AAPL)..."
            className="w-full pl-8 pr-7 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'index', label: 'Index' },
            { id: 'bluechip', label: 'Blue Chips' },
            { id: 'growth', label: 'Growth' },
            { id: 'reit', label: 'REITs' },
            { id: 'penny', label: 'Penny' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stocks List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 no-scrollbar">
        {filteredStocks.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <p className="text-xs text-slate-500">No assets match your search filters.</p>
            {onlyWatchlist && (
              <button
                onClick={() => setOnlyWatchlist(false)}
                className="text-xs text-indigo-400 font-bold hover:underline"
              >
                Clear Watchlist Filter
              </button>
            )}
          </div>
        ) : (
          filteredStocks.map((stock) => {
            const isPositive = stock.changePercent >= 0;
            const holding = portfolio.find((h) => h.stockId === stock.id);

            return (
              <div
                key={stock.id}
                onClick={() => {
                  setSelectedStock(stock);
                  setTradeShares(1);
                  setTradeMode('buy');
                }}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition active:scale-[0.99] shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlistStock(stock.id);
                    }}
                    className="text-slate-500 hover:text-amber-400 p-0.5 cursor-pointer"
                  >
                    <Bookmark className={`w-4 h-4 ${stock.isWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-white">{stock.ticker}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                        {stock.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate block max-w-[120px] sm:max-w-[170px]">
                      {stock.name}
                    </span>
                    {holding && (
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {holding.shares} shares • {formatCurrency(holding.shares * stock.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="px-1.5">
                  {renderSparkline(stock.history, isPositive)}
                </div>

                {/* Price & Change */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-white">{formatCurrency(stock.price)}</div>
                  <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                  </div>
                  {stock.dividendYield > 0 && (
                    <span className="text-[9px] text-indigo-300 font-semibold block">
                      Div: {(stock.dividendYield * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* TRADE & DETAIL BOTTOM DRAWER */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="bg-slate-900 border-t border-slate-700 w-full max-w-md rounded-t-3xl p-4 shadow-2xl space-y-3.5 max-h-[85vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">{selectedStock.ticker}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      {selectedStock.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{selectedStock.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWatchlistStock(selectedStock.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400"
                >
                  <Bookmark className={`w-4 h-4 ${selectedStock.isWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price & Chart */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-white">{formatCurrency(selectedStock.price)}</div>
                <div className={`text-xs font-bold flex items-center gap-0.5 ${
                  selectedStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedStock.changePercent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%</span>
                </div>
              </div>
              <div className="pt-1">
                {renderDetailedChart(selectedStock.history, selectedStock.changePercent >= 0)}
              </div>
            </div>

            {/* Fundamental metrics */}
            <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Sector</span>
                <span className="font-bold text-slate-300 truncate block">{selectedStock.sector}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Dividend Yield</span>
                <span className="font-bold text-emerald-400">
                  {selectedStock.dividendYield > 0 ? `${(selectedStock.dividendYield * 100).toFixed(1)}%` : 'None'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">You Own</span>
                <span className="font-bold text-indigo-300">{currentHoldingShares} shares</span>
              </div>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTradeMode('buy')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  tradeMode === 'buy' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Buy {selectedStock.ticker}
              </button>
              <button
                onClick={() => setTradeMode('sell')}
                disabled={currentHoldingShares === 0}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentHoldingShares === 0
                    ? 'text-slate-600 cursor-not-allowed'
                    : tradeMode === 'sell'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sell ({currentHoldingShares})
              </button>
            </div>

            {/* Quick Share Quantity Selectors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Number of Shares:</span>
                <span className="text-white font-bold">{tradeShares} shares</span>
              </div>

              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {[1, 5, 10, 25, 50].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTradeShares(num)}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      tradeShares === num
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    +{num}
                  </button>
                ))}
                {tradeMode === 'buy' && maxAffordableShares > 0 && (
                  <button
                    onClick={() => setTradeShares(Math.max(1, maxAffordableShares))}
                    className="py-1 px-2 rounded-lg text-xs font-bold border bg-slate-950 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/40"
                  >
                    Max ({maxAffordableShares})
                  </button>
                )}
                {tradeMode === 'sell' && currentHoldingShares > 0 && (
                  <button
                    onClick={() => setTradeShares(currentHoldingShares)}
                    className="py-1 px-2 rounded-lg text-xs font-bold border bg-slate-950 text-rose-400 border-rose-500/40 hover:bg-rose-950/40"
                  >
                    All ({currentHoldingShares})
                  </button>
                )}
              </div>
            </div>

            {/* Cost Breakdown & Action */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {tradeMode === 'buy' ? 'Total Purchase Cost:' : 'Estimated Sale Proceeds:'}
                </span>
                <span className={`text-base font-black ${tradeMode === 'buy' ? 'text-white' : 'text-emerald-400'}`}>
                  {formatCurrency(selectedStock.price * tradeShares)}
                </span>
              </div>

              {tradeMode === 'buy' ? (
                <button
                  disabled={player.cash < selectedStock.price * tradeShares || tradeShares <= 0}
                  onClick={() => {
                    const cost = selectedStock.price * tradeShares;
                    if (buyStock(selectedStock.id, tradeShares)) {
                      showToast(`Executed Order: Bought ${tradeShares} shares of ${selectedStock.ticker}!`);
                      setSelectedStock(null);
                    } else {
                      showToast('Purchase failed! Check available cash.');
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-black text-xs transition cursor-pointer shadow-lg active:scale-98 ${
                    player.cash >= selectedStock.price * tradeShares && tradeShares > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {player.cash >= selectedStock.price * tradeShares
                    ? `Execute Buy Order (${formatCurrency(selectedStock.price * tradeShares)})`
                    : 'Insufficient Liquid Cash'}
                </button>
              ) : (
                <button
                  disabled={currentHoldingShares < tradeShares || tradeShares <= 0}
                  onClick={() => {
                    if (sellStock(selectedStock.id, tradeShares)) {
                      showToast(`Executed Order: Sold ${tradeShares} shares of ${selectedStock.ticker}!`);
                      setSelectedStock(null);
                    } else {
                      showToast('Sale failed! Not enough owned shares.');
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-black text-xs transition cursor-pointer shadow-lg active:scale-98 ${
                    currentHoldingShares >= tradeShares && tradeShares > 0
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {currentHoldingShares >= tradeShares
                    ? `Execute Sell Order (+${formatCurrency(selectedStock.price * tradeShares)})`
                    : 'Not Enough Owned Shares'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
