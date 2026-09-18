import React, { useState } from 'react';
import { 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Smartphone, 
  DownloadCloud, 
  Trash2, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAUpdateModal: React.FC<PWAUpdateModalProps> = ({ isOpen, onClose }) => {
  const { needRefresh, isChecking, checkForUpdates, updateApp, hardRefresh } = usePWAUpdate();
  const { isInstalled, isIOS, isAndroid } = usePWAInstall();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckNow = async () => {
    setStatusMessage('Checking server for updates...');
    const res = await checkForUpdates(false);
    setStatusMessage(res.message);
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleHardRefresh = async () => {
    setStatusMessage('Clearing cached assets & refreshing...');
    await hardRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 text-left relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                Game Updates & Refresh
              </h3>
              <p className="text-[11px] text-slate-400">
                {isInstalled 
                  ? `Installed PWA (${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'})` 
                  : 'Web Application'}
              </p>
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

        {/* Big Reassurance Card */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Never Re-Download or Delete the App!</span>
          </div>
          <p className="text-[11px] text-emerald-200/90 leading-relaxed">
            Progressive Web Apps update seamlessly in the background. You <strong>never</strong> need to delete the app from your home screen or download it again to get new updates or fixes.
          </p>
        </div>

        {/* Update Ready Notice if pending */}
        {needRefresh && (
          <div className="bg-indigo-950/60 border border-indigo-500/50 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>New Update Ready Right Now!</span>
            </div>
            <p className="text-[11px] text-slate-300">
              A newer version of the game was downloaded. Tap below to reload instantly with all the new features.
            </p>
            <button
              onClick={() => updateApp()}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Update & Reload Now</span>
            </button>
          </div>
        )}

        {/* 3 Simple Ways to Refresh */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            3 EASY WAYS TO GET UPDATES:
          </span>

          <div className="space-y-2">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px] border border-indigo-800/60">
                1
              </div>
              <div className="text-slate-300 text-[11px] leading-snug">
                <strong className="text-white">Automatic Check:</strong> The app automatically checks for new updates every time you open or switch back to the game.
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px] border border-indigo-800/60">
                2
              </div>
              <div className="text-slate-300 text-[11px] leading-snug">
                <strong className="text-white">Top Bar Refresh Button:</strong> Tap the <RotateCw className="w-3 h-3 inline text-indigo-400" /> icon in the top header anytime to reload and check.
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px] border border-indigo-800/60">
                3
              </div>
              <div className="text-slate-300 text-[11px] leading-snug">
                <strong className="text-white">Pull to Refresh:</strong> Swipe down at the top of your mobile screen to trigger an instant update check and reload.
              </div>
            </div>
          </div>
        </div>

        {/* Status Feedback Message */}
        {statusMessage && (
          <div className="text-[11px] font-bold text-center text-amber-300 bg-amber-950/40 border border-amber-800/50 p-2 rounded-xl animate-in fade-in">
            {statusMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            disabled={isChecking}
            onClick={handleCheckNow}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Server...' : 'Check for Updates Now'}</span>
          </button>

          <button
            onClick={handleHardRefresh}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-300 text-[11px] font-semibold transition border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
            title="Clears cached scripts while keeping your save slots safe"
          >
            <Trash2 className="w-3 h-3 text-slate-400" />
            <span>Clear Cache & Reload (Keeps Game Saves Safe)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
