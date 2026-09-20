import React from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Smartphone, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  PieChart,
  Car,
  Home
} from 'lucide-react';

export const MarketView: React.FC = () => {
  const {
    player,
    stocks,
    portfolio,
    openPhoneApp,
    setActiveTab,
  } = useGame();

  // Portfolio calculation
  const totalStockValue = portfolio.reduce((sum, h) => {
    const s = stocks.find((item) => item.id === h.stockId);
    return sum + (s ? s.price * h.shares : 0);
  }, 0);

  const totalCostBasis = portfolio.reduce((sum, h) => sum + h.shares * h.avgBuyPrice, 0);
  const totalGainLoss = totalStockValue - totalCostBasis;
  const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Hero Card: Moved to Smartphone */}
      <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/40 rounded-3xl p-5 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <TrendingUp className="w-7 h-7" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold mb-1.5">
            <Smartphone className="w-3 h-3" />
            <span>Now on Mobile</span>
          </div>
          <h2 className="text-lg font-black text-white tracking-tight">iStocks Exchange</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Live NYSE & NASDAQ securities trading, real-time charts, REITs, and portfolio management have moved to your in-game smartphone!
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => openPhoneApp('stocks')}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-950/60 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
        >
          <Smartphone className="w-4 h-4" />
          <span>Launch iStocks App on Phone</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Portfolio Quick Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Securities Overview</span>
          <span className="text-[11px] font-semibold text-indigo-300">{portfolio.length} Positions</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Portfolio Equity</span>
            <div className="text-base font-black text-white mt-0.5">{formatCurrency(totalStockValue)}</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Unrealized P/L</span>
            <div className={`text-base font-black mt-0.5 flex items-center gap-1 ${
              totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </div>
          </div>
        </div>

        {portfolio.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 block">Current Holdings</span>
            <div className="space-y-1.5">
              {portfolio.map((item) => {
                const stock = stocks.find((s) => s.id === item.stockId);
                if (!stock) return null;
                const value = item.shares * stock.price;
                const isPos = stock.changePercent >= 0;

                return (
                  <div
                    key={item.stockId}
                    onClick={() => openPhoneApp('stocks')}
                    className="flex items-center justify-between p-2.5 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/60 rounded-xl cursor-pointer transition"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{stock.ticker}</span>
                        <span className="text-[10px] text-slate-400">{item.shares} shares</span>
                      </div>
                      <span className="text-[10px] text-slate-500 truncate block max-w-[140px]">{stock.name}</span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200">{formatCurrency(value)}</div>
                      <div className={`text-[10px] font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Links: Lifestyle Assets */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab('self')}
          className="p-3.5 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-2xl flex items-center justify-between group transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Vehicles</span>
              <span className="text-[10px] text-slate-400">Transport fleet</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className="p-3.5 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-2xl flex items-center justify-between group transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Real Estate</span>
              <span className="text-[10px] text-slate-400">Estates & MLS</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
        </button>
      </div>
    </div>
  );
};
