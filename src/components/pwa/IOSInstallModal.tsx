import React from 'react';
import { Share, PlusSquare, X, Check, Smartphone } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 text-left relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <img 
              src="/apple-touch-icon.png" 
              alt="Hustle & Empire" 
              className="w-12 h-12 rounded-2xl shadow-md border border-slate-700/80 object-cover" 
            />
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                Install on iOS Safari
              </h3>
              <p className="text-[11px] text-slate-400">Add to iPhone or iPad Home Screen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual 3-Step Guide */}
        <div className="space-y-2.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-xs">
          {/* Step 1 */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 font-bold shrink-0 text-[11px]">
              1
            </div>
            <div className="flex-1 text-slate-300 leading-snug">
              In <strong className="text-white">Safari</strong>, tap the{' '}
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-medium align-baseline text-[11px]">
                <Share className="w-3 h-3 text-indigo-400" /> Share
              </span>{' '}
              button on the bottom bar.
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 font-bold shrink-0 text-[11px]">
              2
            </div>
            <div className="flex-1 text-slate-300 leading-snug">
              Scroll down the menu and select{' '}
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-medium align-baseline text-[11px]">
                <PlusSquare className="w-3 h-3 text-amber-400" /> Add to Home Screen
              </span>.
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 font-bold shrink-0 text-[11px]">
              3
            </div>
            <div className="flex-1 text-slate-300 leading-snug">
              Tap <strong className="text-emerald-400">Add</strong> in the top right corner to launch as a standalone app!
            </div>
          </div>
        </div>

        {/* Benefits Highlight */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Full-screen app view</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Faster native feel</span>
          </div>
        </div>

        {/* Got It Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold transition shadow-lg cursor-pointer"
        >
          Got It, Thanks!
        </button>
      </div>
    </div>
  );
};
