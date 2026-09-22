import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { SaveSlotMeta } from '../../types/game';
import { 
  Play, 
  PlusCircle, 
  FolderOpen, 
  Trash2, 
  ArrowLeft, 
  Sparkles, 
  Dices, 
  Building, 
  DollarSign, 
  Shield, 
  Zap, 
  Award, 
  Calendar, 
  Home, 
  Clock, 
  AlertTriangle, 
  User, 
  Check,
  Briefcase,
  TrendingUp,
  CreditCard,
  Smartphone,
  Download,
  RotateCw,
  Trophy,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';
import { IOSInstallModal } from '../pwa/IOSInstallModal';
import { PWAUpdateModal } from '../pwa/PWAUpdateModal';

const RANDOM_NAMES = [
  'Jordan Vance',
  'Marcus Sterling',
  'Elena Drake',
  'Maya Chen',
  'Alex Cole',
  'Chloe Hayes',
  'Dorian Pierce',
  'Lucas King',
  'Aria Mercer',
  'Zane Morales',
  'Devon Cross',
  'Sienna Brooks',
];

const TYCOON_TIPS = [
  'The Staffing Manager helps you find higher-skilled staff.',
  'High credit scores unlock commercial mortgages with 5% down.',
  'Reinvesting business profits into Marketing compounds daily revenue.',
  'Education degrees unlock high-paying corporate director roles.',
  'Inspect the Stock Radar on your Phone for sudden market dip bargains.',
];

export const MainMenuView: React.FC = () => {
  const { 
    slotsMeta, 
    loadGameSlot, 
    startNewGameInSlot, 
    deleteGameSlot 
  } = useGame();

  const { isInstalled, isInstallable, isIOS, isAndroid, install } = usePWAInstall();
  const { needRefresh, isChecking, checkForUpdates, updateApp } = usePWAUpdate();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [menuToast, setMenuToast] = useState<string | null>(null);

  // Tip cycler
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TYCOON_TIPS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Menu screen mode: 'main' | 'new_game' | 'load_game'
  const [screenMode, setScreenMode] = useState<'main' | 'new_game' | 'load_game'>('main');

  // New Game form states
  const [selectedSlotForNew, setSelectedSlotForNew] = useState<1 | 2 | 3>(1);
  const [characterName, setCharacterName] = useState('Alex Vance');
  const [startingBonus, setStartingBonus] = useState<'energy' | 'cash' | 'credit'>('cash');
  const [nameError, setNameError] = useState('');

  // Delete slot confirmation state
  const [slotToDelete, setSlotToDelete] = useState<SaveSlotMeta | null>(null);

  // Overwrite slot confirmation state when starting new game in occupied slot
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);

  // Pick random name
  const handleRandomizeName = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
    const chosen = RANDOM_NAMES[randomIndex];
    setCharacterName(chosen);
    setNameError('');
  };

  // Find most recent slot with data
  const nonEmptySlots = slotsMeta.filter((s) => !s.isEmpty);
  const mostRecentSlot = nonEmptySlots.length > 0 
    ? [...nonEmptySlots].sort((a, b) => (b.lastSaved || 0) - (a.lastSaved || 0))[0] 
    : null;

  // Format relative timestamp
  const formatLastSaved = (timestamp?: number) => {
    if (!timestamp || timestamp === 0) return 'Never';
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Attempt to submit new game
  const handleNewGameSubmit = () => {
    const trimmed = characterName.trim();
    if (!trimmed) {
      setNameError('Please enter a character name');
      return;
    }
    if (trimmed.length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setNameError('Name must be 20 characters or fewer');
      return;
    }

    const targetSlot = slotsMeta.find((s) => s.slotId === selectedSlotForNew);
    if (targetSlot && !targetSlot.isEmpty && !showOverwriteConfirm) {
      setShowOverwriteConfirm(true);
      return;
    }

    startNewGameInSlot(selectedSlotForNew, trimmed, startingBonus);
  };

  // Quick Continue Handler
  const handleContinue = () => {
    if (mostRecentSlot) {
      loadGameSlot(mostRecentSlot.slotId);
    } else {
      const firstEmpty = slotsMeta.find((s) => s.isEmpty);
      setSelectedSlotForNew(firstEmpty ? firstEmpty.slotId : 1);
      setScreenMode('new_game');
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden select-none">
      {/* Background Graphic: Luxury Skyscraper Towers & Construction Crane Silhouette (Matching IMG_6545) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full object-cover" viewBox="0 0 400 800" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="35%" stopColor="#0284C7" />
              <stop offset="65%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <rect width="400" height="800" fill="url(#skyGrad)" />
          {/* High-Rise Towers */}
          <polygon points="120,800 120,220 280,220 280,800" fill="#0B132B" opacity="0.9" />
          <polygon points="125,220 275,220 275,800 125,800" fill="url(#glassGrad)" />
          {/* Window Grid lines */}
          <line x1="120" y1="260" x2="280" y2="260" stroke="#38BDF8" strokeWidth="0.8" opacity="0.4" />
          <line x1="120" y1="300" x2="280" y2="300" stroke="#38BDF8" strokeWidth="0.8" opacity="0.4" />
          <line x1="120" y1="340" x2="280" y2="340" stroke="#38BDF8" strokeWidth="0.8" opacity="0.4" />
          <line x1="120" y1="380" x2="280" y2="380" stroke="#38BDF8" strokeWidth="0.8" opacity="0.4" />
          <line x1="120" y1="420" x2="280" y2="420" stroke="#38BDF8" strokeWidth="0.8" opacity="0.4" />
          <line x1="120" y1="460" x2="280" y2="460" stroke="#38BDF8" strokeWidth="0.8" opacity="0.4" />
          {/* Construction Crane at top */}
          <line x1="200" y1="220" x2="200" y2="130" stroke="#F59E0B" strokeWidth="3" />
          <line x1="130" y1="140" x2="270" y2="140" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="200" y1="130" x2="270" y2="140" stroke="#F59E0B" strokeWidth="1" />
          <line x1="200" y1="130" x2="130" y2="140" stroke="#F59E0B" strokeWidth="1" />
          <line x1="250" y1="140" x2="250" y2="190" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
          {/* Surrounding City Towers */}
          <polygon points="0,800 0,380 90,380 90,800" fill="#070C18" />
          <polygon points="310,800 310,320 400,320 400,800" fill="#070C18" />
          {/* Sun Glow */}
          <circle cx="280" cy="180" r="40" fill="#FEF08A" opacity="0.3" filter="blur(20px)" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto flex-1 flex flex-col justify-between p-4 sm:p-6 z-10">
        
        {/* ========================================================================= */}
        {/* MODE: MAIN SCREEN (MATCHING IMG_6545) */}
        {/* ========================================================================= */}
        {screenMode === 'main' && (
          <div className="flex-1 flex flex-col justify-between py-4">
            {/* Top Brand Section */}
            <div className="text-center space-y-2 pt-6">
              <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                HUSTLE EMPIRE
              </h1>
              <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 tracking-widest uppercase drop-shadow-md">
                TYCOON SIMULATOR
              </div>

              {/* Floating Dynamic Tip Capsule (Matching IMG_6545) */}
              <div className="pt-4 max-w-sm mx-auto">
                <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs text-slate-300 shadow-lg flex items-center justify-center gap-2 text-center transition-all duration-300">
                  <span className="text-amber-400 font-bold shrink-0">💡 TIP:</span>
                  <span className="truncate">{TYCOON_TIPS[currentTipIndex]}</span>
                </div>
              </div>
            </div>

            {/* Middle & Bottom: Action Buttons */}
            <div className="space-y-3 max-w-sm w-full mx-auto py-6">
              {/* PRIMARY GOLDEN HERO ACTION: CONTINUE (Matching IMG_6545) */}
              <button
                id="btn-menu-continue"
                onClick={handleContinue}
                className="w-full py-4 px-6 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-black text-lg shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
              >
                <span>Continue</span>
                {mostRecentSlot && (
                  <span className="text-xs font-bold text-amber-950 bg-amber-400/50 px-2 py-0.5 rounded-md">
                    Day {mostRecentSlot.daysPlayed}
                  </span>
                )}
              </button>

              {/* Open Game Saves Card (Matching IMG_6545) */}
              <button
                id="btn-menu-load-game"
                onClick={() => setScreenMode('load_game')}
                className="w-full p-4 rounded-2xl bg-[#141417]/90 hover:bg-[#1c1c20] border border-white/10 text-white font-bold shadow-md flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-white">
                    <FolderOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black">Open Game Saves</div>
                    <div className="text-xs text-slate-400 font-normal">
                      Manage your 3 career slots
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  {nonEmptySlots.length}/3 Saved
                </div>
              </button>

              {/* 100-Day Challenge Card (Matching IMG_6545) */}
              <button
                id="btn-menu-100-day-challenge"
                onClick={() => {
                  const firstEmpty = slotsMeta.find((s) => s.isEmpty);
                  setSelectedSlotForNew(firstEmpty ? firstEmpty.slotId : 1);
                  setCharacterName('Speed Tycoon');
                  setStartingBonus('cash');
                  setShowOverwriteConfirm(false);
                  setScreenMode('new_game');
                }}
                className="w-full p-4 rounded-2xl bg-[#141417]/90 hover:bg-[#1c1c20] border border-white/10 text-white font-bold shadow-md flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black flex items-center gap-1.5">
                      <span>100-Day Challenge</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        Rush
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-normal">
                      Reach $1,000,000 Net Worth in 100 days
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
              </button>

              {/* Start New Career Card */}
              <button
                id="btn-menu-new-game"
                onClick={() => {
                  const firstEmpty = slotsMeta.find((s) => s.isEmpty);
                  if (firstEmpty) {
                    setSelectedSlotForNew(firstEmpty.slotId);
                  }
                  setShowOverwriteConfirm(false);
                  setScreenMode('new_game');
                }}
                className="w-full p-4 rounded-2xl bg-[#141417]/90 hover:bg-[#1c1c20] border border-white/10 text-white font-bold shadow-md flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black">Start New Career</div>
                    <div className="text-xs text-slate-400 font-normal">
                      Customize character name & perk
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
              </button>

              {/* Install PWA Button (if mobile web) */}
              {!isInstalled && (
                <button
                  id="btn-menu-install-pwa"
                  onClick={() => {
                    if (isIOS) {
                      setShowIOSModal(true);
                    } else if (isInstallable) {
                      install();
                    } else {
                      setShowIOSModal(true);
                    }
                  }}
                  className="w-full p-3.5 rounded-2xl bg-[#141417]/80 hover:bg-[#1c1c20] border border-white/10 text-slate-300 font-bold flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold">Install App to Home Screen</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              )}

              {/* Updates Notification */}
              {needRefresh && (
                <button
                  onClick={() => updateApp()}
                  className="w-full p-3.5 rounded-2xl bg-[#007AFF] hover:bg-[#0069D9] text-white font-bold shadow-lg flex items-center justify-between transition cursor-pointer"
                >
                  <div className="text-left text-xs">
                    <div className="font-black">New Update Ready</div>
                    <div className="text-blue-100">Tap to reload latest version</div>
                  </div>
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                </button>
              )}
            </div>

            {/* Bottom Credits & Version */}
            <div className="text-center text-[11px] text-slate-500 pt-2">
              Hustle Empire • Tycoon Simulator v2.4
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: NEW GAME SETUP SCREEN */}
        {/* ========================================================================= */}
        {screenMode === 'new_game' && (
          <div className="flex-1 flex flex-col justify-between py-4 space-y-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                onClick={() => setScreenMode('main')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141417] hover:bg-[#1c1c20] text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer border border-white/5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <h2 className="text-base font-bold text-white">Create New Career</h2>
              <div className="w-16" />
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Step 1: Select Save Slot */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-indigo-400" />
                  <span>Select Save Slot</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3] as const).map((slotNum) => {
                    const slot = slotsMeta.find((s) => s.slotId === slotNum);
                    const isSelected = selectedSlotForNew === slotNum;
                    const isEmpty = slot ? slot.isEmpty : true;

                    return (
                      <button
                        key={slotNum}
                        type="button"
                        onClick={() => {
                          setSelectedSlotForNew(slotNum);
                          setShowOverwriteConfirm(false);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#007AFF] text-white border-blue-400 shadow-md'
                            : 'bg-[#141417] hover:bg-[#1c1c20] border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black">Slot {slotNum}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="mt-1 text-[11px] truncate">
                          {isEmpty ? (
                            <span className="opacity-60">Empty</span>
                          ) : (
                            <span className="font-semibold">{slot?.playerName}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Overwrite Warning Banner if slot occupied */}
              {(() => {
                const targetSlot = slotsMeta.find((s) => s.slotId === selectedSlotForNew);
                if (targetSlot && !targetSlot.isEmpty) {
                  return (
                    <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Slot {selectedSlotForNew} contains active progress:</span>{' '}
                        <span>{targetSlot.playerName} (Day {targetSlot.daysPlayed}, {formatCurrency(targetSlot.netWorth)} Net Worth). Starting here will replace this save file.</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Step 2: Enter Character Name */}
              <div className="bg-[#141417] border border-white/5 rounded-3xl p-4 space-y-3">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Character Name</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleRandomizeName}
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>Randomize</span>
                  </button>
                </label>

                <div className="relative">
                  <input
                    id="input-character-name"
                    type="text"
                    value={characterName}
                    onChange={(e) => {
                      setCharacterName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="Enter character name..."
                    maxLength={20}
                    className="w-full px-3.5 py-2.5 bg-black border border-white/10 rounded-xl text-slate-100 font-semibold placeholder:text-slate-600 focus:outline-none focus:border-[#007AFF] text-sm"
                  />
                  {characterName && (
                    <div className="absolute right-3 top-2.5 text-[10px] text-slate-500">
                      {characterName.length}/20
                    </div>
                  )}
                </div>

                {nameError && (
                  <p className="text-xs text-rose-400 font-medium">{nameError}</p>
                )}
              </div>

              {/* Step 3: Choose Starting Perk */}
              <div className="bg-[#141417] border border-white/5 rounded-3xl p-4 space-y-3">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Choose Starting Ambition (Bonus Perk)</span>
                </label>

                <div className="space-y-2">
                  {[
                    {
                      id: 'cash' as const,
                      title: 'Trust Fund Starter',
                      desc: 'Begin with $2,500 cash (instead of $1,000) for fast early investing.',
                      icon: DollarSign,
                      iconColor: 'text-emerald-400',
                    },
                    {
                      id: 'energy' as const,
                      title: 'Athletic Drive',
                      desc: 'Begin with 120 Max Energy (instead of 100) to hustle longer every single day.',
                      icon: Zap,
                      iconColor: 'text-amber-400',
                    },
                    {
                      id: 'credit' as const,
                      title: 'Financially Educated',
                      desc: 'Begin with 720 FICO Credit Score (instead of 650) for immediate prime mortgages.',
                      icon: Shield,
                      iconColor: 'text-sky-400',
                    },
                  ].map((perk) => {
                    const isSelected = startingBonus === perk.id;
                    const IconComponent = perk.icon;
                    return (
                      <button
                        key={perk.id}
                        type="button"
                        onClick={() => setStartingBonus(perk.id)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#1c1c22] border-[#007AFF] shadow-md ring-1 ring-[#007AFF]'
                            : 'bg-black/40 hover:bg-[#1a1a1f] border-white/5 text-slate-300'
                        }`}
                      >
                        <div className={`p-2 rounded-xl bg-white/5 mt-0.5 shrink-0 ${perk.iconColor}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{perk.title}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#007AFF]" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{perk.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Launch Game Button */}
            <div className="pt-2">
              <button
                id="btn-submit-new-game"
                onClick={handleNewGameSubmit}
                className="w-full py-4 px-6 rounded-2xl bg-[#007AFF] hover:bg-[#0069D9] active:scale-[0.98] transition-all text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white stroke-none" />
                <span>Launch Career (Slot {selectedSlotForNew})</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: LOAD GAME SCREEN */}
        {/* ========================================================================= */}
        {screenMode === 'load_game' && (
          <div className="flex-1 flex flex-col justify-between py-4 space-y-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                onClick={() => setScreenMode('main')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141417] hover:bg-[#1c1c20] text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer border border-white/5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <h2 className="text-base font-bold text-white">Select Save Slot</h2>
              <div className="w-16" />
            </div>

            {/* Slots List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {slotsMeta.map((slot) => {
                return (
                  <div
                    key={slot.slotId}
                    className="p-4 bg-[#141417] border border-white/5 rounded-3xl space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white px-2 py-0.5 rounded-md bg-white/10">
                          Slot {slot.slotId}
                        </span>
                        {!slot.isEmpty && (
                          <span className="text-[11px] text-slate-400">
                            Saved {formatLastSaved(slot.lastSaved)}
                          </span>
                        )}
                      </div>

                      {!slot.isEmpty && (
                        <button
                          onClick={() => setSlotToDelete(slot)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                          title={`Delete Slot ${slot.slotId}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {slot.isEmpty ? (
                      <div className="py-4 text-center space-y-2">
                        <div className="text-xs text-slate-400 font-medium">Empty Save Slot</div>
                        <button
                          onClick={() => {
                            setSelectedSlotForNew(slot.slotId);
                            setScreenMode('new_game');
                          }}
                          className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0069D9] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Start New Game in Slot {slot.slotId}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-black text-white">{slot.playerName}</h3>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>Level {slot.level}</span>
                              <span>•</span>
                              <span>Day {slot.daysPlayed}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-emerald-400">
                              {formatCurrency(slot.netWorth)}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">
                              Net Worth
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => loadGameSlot(slot.slotId)}
                          className="w-full py-3 px-4 rounded-xl bg-[#007AFF] hover:bg-[#0069D9] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                          <span>Load & Play Slot {slot.slotId}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Developer Admin Console Access */}
        <div className="pt-4 pb-2 flex justify-center">
          <button
            onClick={() => {
              window.location.hash = '#admin';
            }}
            className="text-[11px] text-slate-500 hover:text-slate-300 font-semibold flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Admin / God Mode Console</span>
          </button>
        </div>
      </div>

      {/* Delete Slot Confirmation Modal */}
      {slotToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-left">
            <h3 className="text-base font-bold text-white">Delete Save Slot {slotToDelete.slotId}?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently delete {slotToDelete.playerName}&apos;s career (Day {slotToDelete.daysPlayed})? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSlotToDelete(null)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteGameSlot(slotToDelete.slotId);
                  setSlotToDelete(null);
                }}
                className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
      <PWAUpdateModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
    </div>
  );
};
