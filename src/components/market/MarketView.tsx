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
  Layers, 
  X, 
  ArrowUpRight, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const MarketView: React.FC = () => {
  const {
    player,
    stocks,
    portfolio,
    buyStock,
    sellStock,
    toggleWatchlistStock,
    newsFeed,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [tradeShares, setTradeShares] = useState<number>(1);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');

  // Portfolio calculation
  const totalStockValue = portfolio.reduce((sum, h) => {
    const s = stocks.find((item) => item.id === h.stockId);
    return sum + (s ? s.price * h.shares : 0);
  }, 0);

  const totalCostBasis = portfolio.reduce((sum, h) => sum + h.shares * h.avgBuyPrice, 0);
  const totalGainLoss = totalStockValue - totalCostBasis;
  const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  const filteredStocks = stocks.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  // Simple clean SVG line chart generator
  const renderMiniChart = (history: number[], isPositive: boolean) => {
    if (!history || history.length < 2) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const width = 80;
    const height = 28;

    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isPositive ? '#34d399' : '#f87171'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  // Detailed Modal SVG chart
  const renderDetailedChart = (history: number[], isPositive: boolean) => {
    if (!history || history.length < 2) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const width = 280;
    const height = 80;

    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#chartGrad)"
          points={`0,${height} ${points} ${width},${height}`}
        />
        <polyline
          fill="none"
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Portfolio Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SECURITIES & REITS PORTFOLIO
            </span>
            <div className="text-2xl font-black text-slate-100 tracking-tight mt-0.5">
              {formatCurrency(totalStockValue)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400">Total Unrealized P/L</span>
            <div className={`text-xs sm:text-sm font-bold flex items-center justify-end gap-1 ${
              totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {totalGainLoss >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)} ({totalGainLossPercent.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <span>Available Liquid Cash: <strong className="text-emerald-400">{formatCurrency(player.cash)}</strong></span>
          <span>Holdings: <strong className="text-slate-200">{portfolio.length} Assets</strong></span>
        </div>
      </div>

      {/* Asset Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'All Assets' },
          { id: 'index', label: 'Index Funds' },
          { id: 'bluechip', label: 'Blue Chips' },
          { id: 'growth', label: 'Growth' },
          { id: 'reit', label: 'REITs' },
          { id: 'penny', label: 'Penny Spec' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-slate-800 text-indigo-400 border border-indigo-500/40'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stock Cards List */}
      <div className="space-y-2.5">
        {filteredStocks.map((stock) => {
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
              className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-3.5 shadow-md flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatchlistStock(stock.id);
                  }}
                  className="text-slate-500 hover:text-amber-400 p-1 cursor-pointer"
                >
                  <Bookmark className={`w-4 h-4 ${stock.isWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-100">{stock.ticker}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                      {stock.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 truncate block max-w-[140px] sm:max-w-[200px]">
                    {stock.name}
                  </span>
                  {holding && (
                    <span className="text-[10px] text-indigo-300 font-medium">
                      Owned: {holding.shares} shares ({formatCurrency(holding.shares * stock.price)})
                    </span>
                  )}
                </div>
              </div>

              {/* Sparkline chart */}
              <div className="hidden xs:block px-2">
                {renderMiniChart(stock.history, isPositive)}
              </div>

              {/* Price & Change */}
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-slate-100">{formatCurrency(stock.price)}</div>
                <div className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
                {stock.dividendYield > 0 && (
                  <span className="text-[10px] text-slate-500">
                    Div: {(stock.dividendYield * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* STOCK DETAIL & TRADE MODAL */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-100">{selectedStock.ticker}</h3>
                  <span className="text-xs text-slate-400">{selectedStock.sector}</span>
                </div>
                <p className="text-xs text-slate-400">{selectedStock.name}</p>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price & Chart */}
            <div className="bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-black text-slate-100">{formatCurrency(selectedStock.price)}</span>
                  <span className={`text-xs font-bold ml-2 ${
                    selectedStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}% today
                  </span>
                </div>
                {selectedStock.dividendYield > 0 && (
                  <span className="text-xs font-semibold text-indigo-400">
                    Yield: {(selectedStock.dividendYield * 100).toFixed(1)}%
                  </span>
                )}
              </div>

              {renderDetailedChart(selectedStock.history, selectedStock.changePercent >= 0)}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/20 p-2.5 rounded-xl border border-slate-800/60">
              {selectedStock.description}
            </p>

            {/* Buy / Sell Tabs */}
            <div className="space-y-3 pt-1">
              <div className="flex bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setTradeMode('buy')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    tradeMode === 'buy' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Buy Shares
                </button>
                <button
                  onClick={() => setTradeMode('sell')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    tradeMode === 'sell' ? 'bg-rose-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Sell Shares
                </button>
              </div>

              {/* Shares input slider/counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Number of Shares: <strong>{tradeShares}</strong></span>
                  <span>Total Order: <strong className="text-emerald-400">{formatCurrency(tradeShares * selectedStock.price)}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 5, 10, 25, 50].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setTradeShares(qty)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        tradeShares === qty
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Order */}
              <button
                onClick={() => {
                  if (tradeMode === 'buy') {
                    if (buyStock(selectedStock.id, tradeShares)) {
                      setSelectedStock(null);
                    }
                  } else {
                    if (sellStock(selectedStock.id, tradeShares)) {
                      setSelectedStock(null);
                    }
                  }
                }}
                className={`w-full py-3 rounded-2xl font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                  tradeMode === 'buy'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                <span>Confirm {tradeMode.toUpperCase()} Order ({formatCurrency(tradeShares * selectedStock.price)})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
