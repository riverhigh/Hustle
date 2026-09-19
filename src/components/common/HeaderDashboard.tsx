import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, formatTime, getCreditScoreTier, getDayName, getDayPhase } from '../../utils/formatters';
import { 
  Sun, 
  Moon, 
  Sunset, 
  Sunrise, 
  Coffee, 
  BedDouble, 
  Bell, 
  TrendingUp, 
  ShieldAlert, 
  Award,
  Zap,
  DollarSign,
  CreditCard,
  Building,
  Save,
  Home,
  AlertCircle,
  Smartphone,
  Download,
  Gem,
  RotateCw,
  Settings,
  X,
  Crown,
  Receipt
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';
import { IOSInstallModal } from '../pwa/IOSInstallModal';
import { PWAUpdateModal } from '../pwa/PWAUpdateModal';

interface HeaderDashboardProps {
  onOpenRest: () => void;
  onOpenNews: () => void;
}

export const HeaderDashboard: React.FC<HeaderDashboardProps> = ({ onOpenRest, onOpenNews }) => {
  const { 
    player, 
    netWorth, 
    sleep, 
    activeSlotId, 
    manualSave, 
    exitToMainMenu, 
    setIsStoreModalOpen, 
    setIsPhoneOpen,
    payYearlyTaxBill
  } = useGame();
  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();
  const { needRefresh, isChecking, checkForUpdates, updateApp } = usePWAUpdate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showIOSInstall, setShowIOSInstall] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);
  const phase = getDayPhase(player.currentHour);
  const creditTier = getCreditScoreTier(player.creditScore);

  const getPhaseIcon = () => {
    switch (phase) {
      case 'Morning':
        return <Sunrise className="w-3.5 h-3.5 text-amber-400" />;
      case 'Afternoon':
        return <Sun className="w-3.5 h-3.5 text-yellow-400" />;
      case 'Evening':
        return <Sunset className="w-3.5 h-3.5 text-orange-400" />;
      case 'Night':
        return <Moon className="w-3.5 h-3.5 text-indigo-300" />;
    }
  };

  const isLowEnergy = player.energy < 20;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2.5 shadow-lg select-none space-y-2">
      {/* Top Navigation & Status Bar */}
      <div className="flex items-center justify-between">
        {/* Left: Player Identity & Rank */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700/70 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Auto-saving enabled" />
            <span className="font-bold text-xs text-slate-100 max-w-[110px] sm:max-w-[160px] truncate">
              {player.name}
            </span>
            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-700/60">
              Lvl {player.level}
            </span>
          </div>
          {player.hasPropertyManagerPass && (
            <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Pass Active</span>
            </span>
          )}
        </div>

        {/* Right: Quick Action Pill Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Phone Launcher Button */}
          <button
            onClick={() => setIsPhoneOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 border border-indigo-500/50 text-indigo-200 text-xs font-bold transition active:scale-95 cursor-pointer shadow-md group relative"
            title="Open In-Game Smartphone (Farbes, VIP Club, Bank, Stocks, Auctions)"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span className="font-extrabold text-[11px] tracking-wide">Phone</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </button>

          {/* Diamond Store Button */}
          <button
            onClick={() => setIsStoreModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-cyan-950 to-indigo-950 hover:from-cyan-900 hover:to-indigo-900 border border-cyan-500/50 text-cyan-300 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer shadow-sm"
            title="Premium Diamond Store"
          >
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>{player.gems || 0}</span>
            <span className="text-[10px] text-cyan-300 bg-cyan-500/30 px-1 rounded font-black">+</span>
          </button>

          {/* System Settings & Menu Gear */}
          <button
            onClick={() => setShowSystemMenu(true)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition active:scale-95 cursor-pointer"
            title="Game Settings & Save"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tax Lien Notification Banner (Clean & Non-Intimidating) */}
      {player.accumulatedTaxOwed > 0 && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/40 rounded-xl text-xs">
          <div className="flex items-center gap-2 text-amber-200">
            <Receipt className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-[11px]">
              Annual IRS Tax Due: <strong className="text-amber-300">{formatCurrency(player.accumulatedTaxOwed)}</strong>
            </span>
          </div>
          <button
            onClick={() => payYearlyTaxBill()}
            disabled={player.cash < player.accumulatedTaxOwed}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
              player.cash >= player.accumulatedTaxOwed
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm active:scale-95'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {player.cash >= player.accumulatedTaxOwed ? 'Pay Bill' : 'Insufficient Funds'}
          </button>
        </div>
      )}

      {/* Clean 2-Card Primary Overview */}
      <div className="grid grid-cols-2 gap-2">
        {/* Card 1: Wealth & Cash */}
        <div className="bg-slate-800/85 border border-slate-700/60 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold tracking-wider text-slate-400">LIQUID CASH</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-400 tracking-tight truncate my-0.5">
            {formatCurrency(player.cash)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
            <span className="truncate">Net Worth: <strong className="text-slate-200 font-semibold">{formatCurrency(netWorth)}</strong></span>
            <span className={`font-bold ${creditTier.color} text-[10px]`}>{player.creditScore} FICO</span>
          </div>
        </div>

        {/* Card 2: Life, Energy & Clock */}
        <div className="bg-slate-800/85 border border-slate-700/60 rounded-2xl p-2.5 flex flex-col justify-between shadow-sm">
          {/* Energy header with Refuel */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 font-bold text-slate-400">
              <Zap className={`w-3.5 h-3.5 ${isLowEnergy ? 'text-rose-400 fill-rose-400' : 'text-amber-400'}`} />
              <span className={isLowEnergy ? 'text-rose-300 font-black animate-pulse' : 'text-slate-300'}>
                {player.energy} / {player.maxEnergy}
              </span>
            </div>
            <button
              onClick={onOpenRest}
              className="text-[10px] font-black text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded-md active:scale-95 transition cursor-pointer"
            >
              Refuel
            </button>
          </div>

          {/* Energy Progress Bar */}
          <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden my-1.5">
            <div 
              className={`h-full transition-all duration-300 ${
                isLowEnergy ? 'bg-rose-500' : player.energy < 50 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (player.energy / player.maxEnergy) * 100)}%` }}
            />
          </div>

          {/* Clock, Sleep & News */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/40">
            <div className="flex items-center gap-1 font-medium text-slate-300">
              {getPhaseIcon()}
              <span>Day {player.daysPlayed}</span>
              <span className="text-slate-500">•</span>
              <span className="font-semibold text-slate-100">{formatTime(player.currentHour, player.currentMinute)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={sleep}
                className="px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-0.5"
                title="End Day & Sleep"
              >
                <BedDouble className="w-3 h-3 text-indigo-100" />
                <span>Sleep</span>
              </button>
              <button
                onClick={onOpenNews}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer relative"
                title="Market News"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings & Save Modal */}
      {showSystemMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-black text-white">System & Save Menu</h3>
              </div>
              <button
                onClick={() => setShowSystemMenu(false)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
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
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Now</span>
                </button>
              </div>

              {/* Install PWA App */}
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
                  className="w-full flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 text-slate-200 text-xs font-bold">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>Install App to Home Screen</span>
                  </div>
                  <Download className="w-4 h-4 text-emerald-400" />
                </button>
              )}

              {/* Check for Updates */}
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
                className="w-full flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2 text-slate-200 text-xs font-bold">
                  <RotateCw className={`w-4 h-4 ${isChecking ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
                  <span>Check for Updates</span>
                </div>
                <span className="text-[11px] text-slate-400">{needRefresh ? 'Update Ready' : 'v1.4.0'}</span>
              </button>

              {/* Exit to Main Menu */}
              <button
                onClick={() => {
                  setShowSystemMenu(false);
                  setShowExitConfirm(true);
                }}
                className="w-full flex items-center gap-2 p-3 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-600/40 rounded-xl text-rose-300 text-xs font-bold transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-rose-400" />
                <span>Exit to Main Menu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return to Main Menu Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xs w-full space-y-4 shadow-2xl text-left">
            <div className="flex items-center gap-3 text-indigo-400">
              <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60">
                <Home className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Exit to Main Menu?</h3>
                <p className="text-[11px] text-slate-400">Save Slot {activeSlotId || 1}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your career progress for <strong className="text-white">{player.name}</strong> will be auto-saved to Slot {activeSlotId || 1}.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  exitToMainMenu();
                }}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {refreshToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 px-3.5 py-1.5 rounded-full bg-indigo-950/95 border border-indigo-500/60 shadow-2xl text-[11px] font-bold text-indigo-200 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>{refreshToast}</span>
        </div>
      )}

      {/* iOS PWA Install Guide Modal */}
      <IOSInstallModal
        isOpen={showIOSInstall}
        onClose={() => setShowIOSInstall(false)}
      />

      {/* PWA Update & Refresh Guide Modal */}
      <PWAUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      />
    </header>
  );
};
