import React from 'react';
import { useGame } from '../../context/GameContext';
import { MEAL_TIERS } from '../../constants/gameData';
import { formatCurrency } from '../../utils/formatters';
import { X, Utensils, BedDouble, Zap, Clock } from 'lucide-react';

interface RestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RestModal: React.FC<RestModalProps> = ({ isOpen, onClose }) => {
  const { player, eatMeal, takeNap, sleep } = useGame();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">Refuel & Rest</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status */}
        <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-2xl border border-slate-800 my-4">
          <div>
            <span className="text-xs text-slate-400">Current Energy</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold text-amber-400">{player.energy}</span>
              <span className="text-xs text-slate-400">/{player.maxEnergy}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Cash Available</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {formatCurrency(player.cash)}
            </div>
          </div>
        </div>

        {/* Meal Options */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Order Food & Drinks
        </h3>
        <div className="space-y-2.5 mb-5">
          {MEAL_TIERS.map((meal) => {
            const canAfford = player.cash >= meal.cost;
            return (
              <div
                key={meal.tier}
                className="flex items-center justify-between p-3 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800/80 rounded-2xl transition"
              >
                <div className="pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-200">{meal.name}</span>
                    <span className="text-xs font-bold text-emerald-400">{formatCurrency(meal.cost)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{meal.description}</p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400 font-medium">
                    <Zap className="w-3 h-3 fill-amber-400" />
                    <span>+{meal.energyRestored} Energy</span>
                  </div>
                </div>
                <button
                  disabled={!canAfford}
                  onClick={() => eatMeal(meal.tier)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  Eat
                </button>
              </div>
            );
          })}
        </div>

        {/* Rest & Sleep actions */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Resting & Sleep
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              takeNap();
              onClose();
            }}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-2xl cursor-pointer transition active:scale-95 text-left"
          >
            <Clock className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-xs font-bold text-slate-200">Power Nap</span>
            <span className="text-[11px] text-slate-400 mt-0.5">1h 30m • +25 Energy</span>
          </button>

          <button
            onClick={() => {
              sleep();
              onClose();
            }}
            className="flex flex-col items-center justify-center p-3.5 bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border border-indigo-400/50 rounded-2xl cursor-pointer transition active:scale-95 shadow-md"
          >
            <BedDouble className="w-6 h-6 text-white mb-1" />
            <span className="text-xs font-black text-white">Full Night Sleep</span>
            <span className="text-[11px] text-indigo-100 font-semibold mt-0.5">+100⚡ • Next Morning</span>
          </button>
        </div>
      </div>
    </div>
  );
};
