import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, getCreditScoreTier } from '../../utils/formatters';
import { 
  Zap, 
  ArrowRight, 
  Settings, 
  X, 
  Crown, 
  Receipt, 
  Gem, 
  Save, 
  Download, 
  RotateCw, 
  Smartphone 
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';
import { IOSInstallModal } from '../pwa/IOSInstallModal';
import { PWAUpdateModal } from '../pwa/PWAUpdateModal';

interface HeaderDashboardProps {
  onOpenRest: () => void;
  onOpenNews?: () => void;
}

const WEEKDAYS = [
  { label: 'M', dayIndex: 1 },
  { label: 'T', dayIndex: 2 },
  { label: 'W', dayIndex: 3 },
  { label: 'T', dayIndex: 4 },
  { label: 'F', dayIndex: 5 },
  { label: 'S', dayIndex: 6 },
  { label: 'S', dayIndex: 0 },
];

export const HeaderDashboard: React.FC<HeaderDashboardProps> = ({ onOpenRest }) => {
  const { 
    player, 
    simulateNextDay, 
    activeSlotId, 
    manualSave, 
    exitToMainMenu, 
    setIsStoreModalOpen, 
    payYearlyTaxBill
  } = useGame();

  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();
  const { needRefresh, isChecking, checkForUpdates, updateApp } = usePWAUpdate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showIOSInstall, setShowIOSInstall] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  const creditTier = getCreditScoreTier(player.creditScore);
  const isLowEnergy = player.energy < 20;

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/5 px-4 pt-3.5 pb-3 select-none space-y-3">
      {/* Top Bar: Welcome, Name, Day Pill, and Quick Tools */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
            Welcome,
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            {player.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Diamond Gems Pill */}
          <button
            onClick={() => setIsStoreModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#141417] hover:bg-[#1c1c20] border border-white/10 rounded-xl text-xs font-bold text-cyan-300 transition active:scale-95 cursor-pointer shadow-sm"
            title="Premium Diamond Store"
          >
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>{player.gems || 0}</span>
          </button>

          {/* Day Pill Box */}
          <div className="bg-[#141417] border border-white/10 rounded-2xl px-3 py-1 text-center min-w-[65px] shadow-sm">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
              Day
            </span>
            <span className="block text-xl font-black text-white tracking-tight leading-none mt-0.5">
              {player.daysPlayed}
            </span>
          </div>

          {/* Settings Menu Gear */}
          <button
            id="btn-open-settings"
            onClick={() => setShowSystemMenu(true)}
            className="p-2 rounded-xl bg-[#141417] hover:bg-[#1c1c20] border border-white/10 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
            title="Settings & Save Menu"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Action Button: Simulate Day X (Matching IMG_6546) */}
      <button
        id="btn-simulate-day"
        onClick={simulateNextDay}
        className="w-full py-3.5 px-4 rounded-2xl bg-[#007AFF] hover:bg-[#0069D9] active:scale-[0.98] transition-all text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
        title="Simulate day, collect earnings, and view daily summary"
      >
        <ArrowRight className="w-5 h-5 fill-white stroke-none" />
        <span>Simulate Day {player.daysPlayed}</span>
      </button>

      {/* Weekday Timeline Strip (M T W T F S S) */}
      <div className="flex items-center justify-between px-2 pt-0.5">
        {WEEKDAYS.map((wd, index) => {
          const isActive = (player.dayOfWeek % 7) === wd.dayIndex;
          return (
            <div
              key={index}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#007AFF] text-white font-black text-xs shadow-md shadow-blue-500/30'
                  : 'text-slate-500 font-bold text-xs'
              }`}
            >
              {wd.label}
            </div>
          );
        })}
      </div>

      {/* Secondary Status Strip: Energy & Credit & Pass */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {/* Energy chip */}
          <div className="flex items-center gap-1.5 bg-[#141417] border border-white/5 px-2.5 py-1 rounded-xl">
            <Zap className={`w-3.5 h-3.5 ${isLowEnergy ? 'text-rose-400 animate-pulse' : 'text-amber-400 fill-amber-400'}`} />
            <span className="font-semibold text-white">
              {player.energy}<span className="text-slate-500">/{player.maxEnergy}</span>
            </span>
            <button
              onClick={onOpenRest}
              className="ml-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
            >
              Refuel
            </button>
          </div>

          {/* Level chip */}
          <div className="bg-[#141417] border border-white/5 px-2.5 py-1 rounded-xl font-bold text-[11px] text-slate-300">
            Lvl {player.level}
          </div>

          {player.hasPropertyManagerPass && (
            <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Pass</span>
            </span>
          )}
        </div>

        {/* FICO score pill */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400">FICO</span>
          <span className={`font-bold text-xs ${creditTier.color}`}>
            {player.creditScore}
          </span>
        </div>
      </div>

      {/* Tax Lien Notification Banner (if taxes are pending) */}
      {player.accumulatedTaxOwed > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-xs">
          <div className="flex items-center gap-2 text-amber-200">
            <Receipt className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-[11px]">
              Annual IRS Tax: <strong className="text-amber-300">{formatCurrency(player.accumulatedTaxOwed)}</strong>
            </span>
          </div>
          <button
            onClick={() => payYearlyTaxBill()}
            disabled={player.cash < player.accumulatedTaxOwed}
            className={`px-3 py-1 rounded-xl text-[11px] font-black transition cursor-pointer ${
              player.cash >= player.accumulatedTaxOwed
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            {player.cash >= player.accumulatedTaxOwed ? 'Pay Bill' : 'Insufficient'}
          </button>
        </div>
      )}

      {/* System Settings & Save Modal */}
      {showSystemMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Game Settings</h3>
              </div>
              <button
                onClick={() => setShowSystemMenu(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-[#18181c] rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Active Career Save</div>
                  <div className="text-[11px] text-slate-400">Slot {activeSlotId || 1} • {player.name}</div>
                </div>
                <button
                  onClick={() => {
                    manualSave();
                    setRefreshToast('Game saved successfully!');
                    setTimeout(() => setRefreshToast(null), 2500);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

              {/* Install PWA */}
              {!isInstalled && (
                <button
                  onClick={() => {
                    setShowSystemMenu(false);
                    if (isIOS) {
                      setShowIOSInstall(true);
                    } else if (isInstallable) {
                      install();
                    } else {
                      setShowIOSInstall(true);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-[#18181c] hover:bg-[#202025] rounded-2xl border border-white/5 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5 text-slate-200 text-xs font-bold">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>Install to Home Screen</span>
                  </div>
                  <Download className="w-4 h-4 text-emerald-400" />
                </button>
              )}

              {/* Check for updates */}
              <button
                onClick={async () => {
                  if (needRefresh) {
                    await updateApp();
                  } else {
                    setRefreshToast('Checking for updates...');
                    const res = await checkForUpdates(false);
                    setRefreshToast(res.message);
                    setTimeout(() => setRefreshToast(null), 3200);
                  }
                }}
                className="w-full flex items-center justify-between p-3.5 bg-[#18181c] hover:bg-[#202025] rounded-2xl border border-white/5 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5 text-slate-200 text-xs font-bold">
                  <RotateCw className={`w-4 h-4 text-indigo-400 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{needRefresh ? 'Install Update' : 'Check for Updates'}</span>
                </div>
              </button>

              {/* Exit to Main Menu */}
              <div className="pt-2">
                {!showExitConfirm ? (
                  <button
                    onClick={() => setShowExitConfirm(true)}
                    className="w-full py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold transition active:scale-95 cursor-pointer text-center"
                  >
                    Exit to Main Menu
                  </button>
                ) : (
                  <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-2xl space-y-2">
                    <p className="text-xs text-rose-200 font-medium text-center">
                      Exit without manual save?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowExitConfirm(false)}
                        className="flex-1 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          manualSave();
                          exitToMainMenu();
                        }}
                        className="flex-1 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 transition cursor-pointer"
                      >
                        Save & Exit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {refreshToast && (
              <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs text-center text-indigo-200">
                {refreshToast}
              </div>
            )}
          </div>
        </div>
      )}

      <IOSInstallModal isOpen={showIOSInstall} onClose={() => setShowIOSInstall(false)} />
      <PWAUpdateModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
    </header>
  );
};
