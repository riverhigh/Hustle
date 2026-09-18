import React from 'react';
import { useGame } from '../../context/GameContext';
import { Sparkles, ArrowRight, CheckCircle2, DollarSign, Zap, Clock, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const TutorialModal: React.FC = () => {
  const { tutorialStep, setTutorialStep, doJob, player } = useGame();

  if (tutorialStep === 0 || tutorialStep > 3) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {tutorialStep === 1 && (
          <>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">
                  Orientation • Day 1
                </span>
                <h2 className="text-base font-bold text-slate-100">Mom's Couch</h2>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50 space-y-1 text-xs text-slate-300">
              <p className="italic text-slate-200 leading-relaxed font-serif">
                “You don't need millions to start. You need your first opportunity.”
              </p>
              <div className="pt-2 flex items-center justify-between text-slate-400 text-[11px]">
                <span>Cash: <strong className="text-emerald-400">{formatCurrency(player.cash)}</strong></span>
                <span>Energy: <strong className="text-amber-400">{player.energy}/100</strong></span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your first hustle is ready. Grab the pressure washer and blast clean Mrs. Gable's driveway to earn your first honest paycheck!
            </p>

            <button
              onClick={() => {
                doJob('job_pressure_wash');
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <span>Work: Pressure Wash Driveway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {tutorialStep === 2 && (
          <>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                  First Cash Earned!
                </span>
                <h2 className="text-base font-bold text-slate-100">The Core Loop</h2>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Every action advances time and consumes physical energy. As you complete gigs, your Handyman, Sales, and Negotiation skills will level up.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Energy</span>
                </div>
                <p className="text-[11px] text-slate-400">Refuel with meals or rest when below 20.</p>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Progression</span>
                </div>
                <p className="text-[11px] text-slate-400">Unlocks bank accounts, credit, stocks & properties.</p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setTutorialStep(0)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Skip Walkthrough
              </button>
              <button
                onClick={() => setTutorialStep(3)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Next Tip
              </button>
            </div>
          </>
        )}

        {tutorialStep === 3 && (
          <>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                <DollarSign className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">
                  Your Path Forward
                </span>
                <h2 className="text-base font-bold text-slate-100">Hustle → Empire</h2>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Use the bottom tabs to navigate:
            </p>

            <ul className="text-xs text-slate-300 space-y-2 pl-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-400">🧰 HUSTLE:</span>
                <span>Work gigs, unlock higher tier contracts, start micro-businesses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-400">🏘️ PROPERTIES:</span>
                <span>Swipe deals, inspect fixer-uppers, lease to tenants, join auctions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-400">📈 MARKET:</span>
                <span>Trade stocks, REITs, and watch economic news.</span>
              </li>
            </ul>

            <button
              onClick={() => setTutorialStep(0)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg cursor-pointer"
            >
              Start Building Empire
            </button>
          </>
        )}
      </div>
    </div>
  );
};
