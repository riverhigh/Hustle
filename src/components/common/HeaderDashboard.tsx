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
  RotateCw
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
  const { player, netWorth, sleep, activeSlotId, manualSave, exitToMainMenu, setIsStoreModalOpen, setIsPhoneOpen } = useGame();
  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();
  const { needRefresh, isChecking, checkForUpdates, updateApp } = usePWAUpdate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
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
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2 shadow-lg select-none">
      {/* Top Meta Bar: Active Save Slot & Quick System Controls */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/70 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/60 font-black text-indigo-300">
            Slot {activeSlotId || 1}
          </span>
          <span className="font-bold text-slate-200 truncate max-w-[120px] sm:max-w-[180px]">
            {player.name}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Auto-saving enabled" />
        </div>

        <div className="flex items-center gap-1">
          {/* Diamond Store Shortcut Button */}
          <button
            onClick={() => setIsStoreModalOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-cyan-950 to-indigo-950 hover:from-cyan-900 hover:to-indigo-900 border border-cyan-500/50 text-cyan-300 rounded-md font-bold transition active:scale-95 cursor-pointer shadow-sm"
            title="Premium Diamond Store (Paystack)"
          >
            <Gem className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px] font-black">{player.gems || 0}</span>
            <span className="text-[9px] text-cyan-300 bg-cyan-500/30 px-1 rounded font-black">+</span>
          </button>

          {!isInstalled && (
            <button
              onClick={() => {
                if (isIOS) {
                  setShowIOSInstall(true);
                } else if (isInstallable) {
                  install();
                } else {
                  setShowIOSInstall(true);
                }
              }}
              className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-900 to-indigo-800 hover:from-indigo-800 hover:to-indigo-700 border border-indigo-600/70 text-indigo-200 rounded-md font-bold transition active:scale-95 cursor-pointer shadow-sm"
              title="Install App to Home Screen"
            >
              {isInstallable ? (
                <Download className="w-3 h-3 text-emerald-400" />
              ) : (
                <Smartphone className="w-3 h-3 text-indigo-300" />
              )}
              <span className="text-[10px]">App</span>
            </button>
          )}

          {/* Refresh App & Check for Updates Button */}
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
            className={`relative flex items-center gap-1 px-2 py-0.5 border rounded-md font-bold transition active:scale-95 cursor-pointer ${
              needRefresh
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700/80 text-slate-300'
            }`}
            title={needRefresh ? 'New update available! Tap to reload.' : 'Check for updates & refresh'}
          >
            <RotateCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-indigo-400' : needRefresh ? 'text-white' : 'text-slate-400'}`} />
            <span className="hidden xs:inline">{needRefresh ? 'Update' : 'Refresh'}</span>
            {needRefresh && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={manualSave}
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 hover:border-slate-600 text-slate-200 rounded-md font-bold transition active:scale-95 cursor-pointer"
            title="Manual Save to Current Slot"
          >
            <Save className="w-3 h-3 text-emerald-400" />
            <span className="hidden xs:inline">Save</span>
          </button>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 hover:border-slate-600 text-slate-300 rounded-md font-bold transition active:scale-95 cursor-pointer"
            title="Return to Main Menu"
          >
            <Home className="w-3 h-3 text-indigo-400" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Top 4 Key Metrics Bar */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        {/* Cash */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-[11px]">CASH</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 tracking-tight truncate mt-0.5">
            {formatCurrency(player.cash)}
          </div>
        </div>

        {/* Energy */}
        <div 
          onClick={onOpenRest}
          className={`border rounded-xl p-2 flex flex-col justify-between cursor-pointer transition-all active:scale-95 ${
            isLowEnergy 
              ? 'bg-rose-950/40 border-rose-500/50 animate-pulse' 
              : 'bg-slate-800/80 border-slate-700/60 hover:border-amber-500/40'
          }`}
          title="Click to eat or rest"
        >
          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium text-[11px] ${isLowEnergy ? 'text-rose-300 font-bold' : 'text-slate-400'}`}>
              ENERGY
            </span>
            <Zap className={`w-3.5 h-3.5 ${isLowEnergy ? 'text-rose-400 fill-rose-400' : 'text-amber-400'}`} />
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className={`text-sm sm:text-base font-bold ${isLowEnergy ? 'text-rose-400' : 'text-amber-400'}`}>
              {player.energy}
            </span>
            <span className="text-[10px] text-slate-400">/{player.maxEnergy}</span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-slate-700/60 h-1 rounded-full mt-1 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isLowEnergy ? 'bg-rose-500' : player.energy < 50 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (player.energy / player.maxEnergy) * 100)}%` }}
            />
          </div>
        </div>

        {/* Credit Score */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-[11px]">CREDIT</span>
            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm sm:text-base font-bold text-slate-100">{player.creditScore}</span>
            <span className={`text-[10px] font-semibold ${creditTier.color} hidden sm:inline`}>
              {creditTier.label}
            </span>
          </div>
        </div>

        {/* Net Worth */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-[11px]">NET WORTH</span>
            <Building className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className={`text-sm sm:text-base font-bold tracking-tight truncate mt-0.5 ${netWorth >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
            {formatCurrency(netWorth)}
          </div>
        </div>
      </div>

      {/* Date, Time & Quick Life Controls */}
      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
        {/* Calendar Day & Clock */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700/80 text-slate-300 font-medium">
            {getPhaseIcon()}
            <span>Day {player.daysPlayed}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{getDayName(player.dayOfWeek)}</span>
            <span className="text-slate-500">•</span>
            <span className="font-semibold text-slate-100">{formatTime(player.currentHour, player.currentMinute)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Lvl {player.level}</span>
          </div>
        </div>

        {/* Quick Sleep & Rest Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenRest}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium text-xs transition active:scale-95 cursor-pointer"
            title="Eat Food or Nap"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Refuel</span>
          </button>

          <button
            onClick={sleep}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs shadow-sm transition active:scale-95 cursor-pointer"
            title="End Day & Sleep"
          >
            <BedDouble className="w-3.5 h-3.5 text-indigo-100" />
            <span>Sleep</span>
          </button>

          <button
            onClick={onOpenNews}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition active:scale-95 cursor-pointer relative"
            title="Market News & Reports"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>
        </div>
      </div>

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
      {/* Toast Feedback for Refresh Check */}
      {refreshToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 px-3 py-1.5 rounded-full bg-indigo-950/95 border border-indigo-500/50 shadow-2xl text-[11px] font-bold text-indigo-200 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <RotateCw className="w-3 h-3 text-indigo-400" />
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
