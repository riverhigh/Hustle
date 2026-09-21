import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { X, ArrowRight, Clapperboard, ChevronDown, ChevronUp } from 'lucide-react';

export const DailySummaryModal: React.FC = () => {
  const { dailySummary, isDailySummaryOpen, setIsDailySummaryOpen } = useGame();
  const [showDetails, setShowDetails] = useState(false);

  if (!isDailySummaryOpen || !dailySummary) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="modal-daily-summary"
        className="bg-[#0e0e11] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Daily Summary
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Day {dailySummary.day} • {dailySummary.dayName}
            </p>
          </div>
          <button
            id="btn-close-summary"
            onClick={() => setIsDailySummaryOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Boost Banner */}
        <div className="flex items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>🎬 = +20% Revenue Boost</span>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-[#151519] border border-white/5 rounded-2xl p-4 space-y-3">
          {/* Revenue */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white">Revenue</span>
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="block text-[11px] text-sky-400 hover:text-sky-300 cursor-pointer font-medium mt-0.5"
                >
                  {showDetails ? 'Hide details <' : 'Tap for details >'}
                </button>
              </div>
              <span className="text-sm font-bold text-white">
                +{formatCurrency(dailySummary.revenue)}
              </span>
            </div>

            {/* Expanded details */}
            {showDetails && dailySummary.revenueDetails && dailySummary.revenueDetails.length > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-white/5 space-y-1.5 pl-2 text-xs">
                {dailySummary.revenueDetails.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-400">
                    <span>{item.label}</span>
                    <span className="text-emerald-400 font-medium">+{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/5 pt-2.5 space-y-2 text-sm">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs sm:text-sm">Employee Wages</span>
              <span className="font-semibold text-slate-200">
                {dailySummary.employeeWages > 0 ? `-${formatCurrency(dailySummary.employeeWages)}` : '$0'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs sm:text-sm">Building Rent</span>
              <span className="font-semibold text-slate-200">
                {dailySummary.buildingRent > 0 ? `-${formatCurrency(dailySummary.buildingRent)}` : '$0'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs sm:text-sm">Marketing</span>
              <span className="font-semibold text-slate-200">
                {dailySummary.marketing > 0 ? `-${formatCurrency(dailySummary.marketing)}` : '$0'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs sm:text-sm">HQ Office Rent</span>
              <span className="font-semibold text-slate-200">
                {dailySummary.hqRent > 0 ? `-${formatCurrency(dailySummary.hqRent)}` : '$0'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs sm:text-sm">Vehicle Maintenance</span>
              <span className="font-semibold text-slate-200">
                {dailySummary.vehicleMaintenance > 0 ? `-${formatCurrency(dailySummary.vehicleMaintenance)}` : '$0'}
              </span>
            </div>
          </div>

          {/* Net Profit row */}
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between mt-3">
            <span className="text-sm font-bold text-white">Net Profit</span>
            <span className={`text-base font-black ${dailySummary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {dailySummary.netProfit >= 0 ? '+' : ''}{formatCurrency(dailySummary.netProfit)}
            </span>
          </div>
        </div>

        {/* Cash Flow Card */}
        <div className="bg-[#151519] border border-white/5 rounded-2xl p-4 space-y-2.5 text-sm">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
            Cash Flow
          </h3>

          <div className="flex items-center justify-between text-slate-300">
            <span>Starting Cash</span>
            <span className="font-semibold text-white">{formatCurrency(dailySummary.startingCash)}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Net Profit</span>
            <span className="font-semibold text-emerald-400">
              {dailySummary.netProfit >= 0 ? '+' : ''}{formatCurrency(dailySummary.netProfit)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Cash Change</span>
            <span className="font-semibold text-emerald-400">
              {dailySummary.cashChange >= 0 ? '+' : ''}{formatCurrency(dailySummary.cashChange)}
            </span>
          </div>

          <div className="border-t border-white/5 pt-2 flex items-center justify-between">
            <span className="font-bold text-white">Ending Cash</span>
            <span className="font-black text-base text-white">{formatCurrency(dailySummary.endingCash)}</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          id="btn-summary-continue"
          onClick={() => setIsDailySummaryOpen(false)}
          className="w-full py-4 rounded-2xl bg-[#007AFF] hover:bg-[#0069D9] active:scale-[0.98] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 fill-white stroke-none" />
          <span>Continue</span>
        </button>
      </div>
    </div>
  );
};
