import React from 'react';
import { useGame } from '../../context/GameContext';
import { AlertTriangle, Home, Briefcase, Zap, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const EventModal: React.FC = () => {
  const { currentEvent, chooseEventOption, player } = useGame();

  if (!currentEvent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl">
            {currentEvent.category === 'rental' ? (
              <Home className="w-5 h-5" />
            ) : currentEvent.category === 'business' ? (
              <Briefcase className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              {currentEvent.category === 'rental' ? 'Property Event' : 'Life Decision'}
            </span>
            <h2 className="text-base font-bold text-slate-100">{currentEvent.title}</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800">
          {currentEvent.description}
        </p>

        {/* Choice buttons */}
        <div className="space-y-2 pt-1">
          {currentEvent.choices.map((choice) => {
            const canAfford = !choice.cost || player.cash >= choice.cost;
            const hasEnergy = !choice.energyChange || choice.energyChange >= 0 || player.energy >= Math.abs(choice.energyChange);
            const isUsable = canAfford && hasEnergy;

            return (
              <button
                key={choice.id}
                disabled={!isUsable}
                onClick={() => chooseEventOption(choice.id)}
                className={`w-full p-3 rounded-2xl text-left border transition active:scale-[0.99] cursor-pointer ${
                  isUsable
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-100 hover:border-slate-500'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{choice.label}</span>
                  {choice.cost !== undefined && choice.cost > 0 && (
                    <span className="text-xs font-bold text-rose-400">
                      -{formatCurrency(choice.cost)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{choice.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
