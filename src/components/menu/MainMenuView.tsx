import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IOSInstallModal } from '../pwa/IOSInstallModal';

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

export const MainMenuView: React.FC = () => {
  const { 
    slotsMeta, 
    loadGameSlot, 
    startNewGameInSlot, 
    deleteGameSlot 
  } = useGame();

  const { isInstalled, isInstallable, isIOS, isAndroid, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Visual background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto flex-1 flex flex-col justify-between p-4 sm:p-6 z-10">
        
        {/* ========================================================================= */}
        {/* MODE: MAIN SCREEN */}
        {/* ========================================================================= */}
        {screenMode === 'main' && (
          <div className="flex-1 flex flex-col justify-between py-6">
            {/* Top Brand Section */}
            <div className="text-center space-y-3 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Life & Empire Simulation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex flex-col items-center">
                <span>HUSTLE</span>
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  & EMPIRE
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                From broke on Mom&apos;s couch to managing a multi-million dollar real estate and investment dynasty.
              </p>

              {/* Feature Highlights Badges */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-amber-400" /> Gig Hustles
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> Stock Trading
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
                  <Building className="w-3 h-3 text-indigo-400" /> Multi-Family Units
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-blue-400" /> Credit Scores
                </span>
              </div>
            </div>

            {/* Menu Buttons Area */}
            <div className="space-y-3 max-w-sm w-full mx-auto py-6">
              {/* Quick Continue Button (if recent save exists) */}
              {mostRecentSlot && (
                <button
                  id="btn-menu-continue"
                  onClick={() => loadGameSlot(mostRecentSlot.slotId)}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-between transition-all active:scale-98 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">
                        Continue (Slot {mostRecentSlot.slotId})
                      </div>
                      <div className="text-base font-black text-white">
                        {mostRecentSlot.playerName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-100">
                      Day {mostRecentSlot.daysPlayed}
                    </div>
                    <div className="text-xs text-emerald-200">
                      {formatCurrency(mostRecentSlot.netWorth)} NW
                    </div>
                  </div>
                </button>
              )}

              {/* Start New Game Button */}
              <button
                id="btn-menu-new-game"
                onClick={() => {
                  // Default to first empty slot if available
                  const firstEmpty = slotsMeta.find((s) => s.isEmpty);
                  if (firstEmpty) {
                    setSelectedSlotForNew(firstEmpty.slotId);
                  }
                  setShowOverwriteConfirm(false);
                  setScreenMode('new_game');
                }}
                className="w-full p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-950/40 flex items-center justify-between transition-all active:scale-98 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-700/80 flex items-center justify-center text-indigo-100 group-hover:bg-indigo-600">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black">New Game</div>
                    <div className="text-xs text-indigo-200 font-normal">
                      Choose save slot & enter your name
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold bg-indigo-700/60 px-3 py-1.5 rounded-xl text-indigo-100">
                  3 Slots
                </div>
              </button>

              {/* Load Game Button */}
              <button
                id="btn-menu-load-game"
                onClick={() => setScreenMode('load_game')}
                className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-slate-100 font-bold shadow-md flex items-center justify-between transition-all active:scale-98 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black">Load Game</div>
                    <div className="text-xs text-slate-400 font-normal">
                      View and manage your 3 save slots
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-lg">
                  {nonEmptySlots.length}/3 Saved
                </div>
              </button>

              {/* PWA Mobile Install Button (if not already running in standalone) */}
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
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 hover:border-indigo-500/70 border border-indigo-500/30 text-slate-100 font-bold shadow-md flex items-center justify-between transition-all active:scale-98 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 group-hover:text-indigo-100">
                      {isInstallable ? (
                        <Download className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Smartphone className="w-5 h-5 text-indigo-300" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black flex items-center gap-1.5">
                        <span>Install Mobile App</span>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-extrabold uppercase tracking-wide">
                          {isIOS ? 'iOS' : isAndroid ? 'Android' : 'PWA'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-normal">
                        Full-screen gameplay, faster load & offline saves
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-2.5 py-1 rounded-lg">
                    Install
                  </div>
                </button>
              )}
            </div>

            {/* Footer Information */}
            <div className="text-center text-[11px] text-slate-500 space-y-1">
              <p>Hustle & Empire Simulation • Version 1.2.0</p>
              <p>Offline persistent storage • Auto-saves after every action</p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: NEW GAME SCREEN */}
        {/* ========================================================================= */}
        {screenMode === 'new_game' && (
          <div className="flex-1 flex flex-col justify-between py-3 space-y-4">
            {/* Header with back button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <button
                onClick={() => {
                  setShowOverwriteConfirm(false);
                  setScreenMode('main');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-slate-900 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Menu</span>
              </button>
              <div className="text-xs font-bold text-indigo-400">Step 1 of 2: Create Character</div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Step 1: Select Save Slot */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-indigo-400" />
                  <span>Select Save Slot (1 of 3)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {slotsMeta.map((slot) => {
                    const isSelected = selectedSlotForNew === slot.slotId;
                    return (
                      <div
                        key={slot.slotId}
                        onClick={() => {
                          setSelectedSlotForNew(slot.slotId);
                          setShowOverwriteConfirm(false);
                        }}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                            Slot {slot.slotId}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>

                        {slot.isEmpty ? (
                          <div className="text-[11px] text-emerald-400 font-medium">
                            [Empty]
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="text-[11px] font-bold text-slate-200 truncate">
                              {slot.playerName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Day {slot.daysPlayed} • Lvl {slot.level}
                            </div>
                            <div className="text-[10px] text-amber-400 font-semibold">
                              Overwrite
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overwrite notice if chosen slot is occupied */}
              {(() => {
                const targetSlot = slotsMeta.find((s) => s.slotId === selectedSlotForNew);
                if (targetSlot && !targetSlot.isEmpty) {
                  return (
                    <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Slot {selectedSlotForNew} contains existing progress:</span>{' '}
                        <span>{targetSlot.playerName} (Day {targetSlot.daysPlayed}, {formatCurrency(targetSlot.netWorth)} Net Worth). Starting a new game here will replace this save file.</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Step 2: Enter Character Name */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Character Name</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleRandomizeName}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-semibold placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
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

              {/* Step 3: Choose Starting Background Perk */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Choose Starting Ambition (Bonus Perk)</span>
                </label>

                <div className="space-y-2">
                  {[
                    {
                      id: 'cash' as const,
                      title: 'The Seed Capitalist',
                      badge: '+$50 Cash ($150 Total)',
                      desc: 'Scraped together extra initial savings to jumpstart micro-investing and food.',
                      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
                    },
                    {
                      id: 'energy' as const,
                      title: 'The Relentless Hustler',
                      badge: '+10 Starting Energy (90/100)',
                      desc: 'High work stamina, allowing you to pull an extra gig shift on Day 1.',
                      icon: <Zap className="w-4 h-4 text-amber-400" />,
                    },
                    {
                      id: 'credit' as const,
                      title: 'The Credit Conscious',
                      badge: '+30 Credit Score (580)',
                      desc: 'Paid off an old utility bill early; unlocks better credit cards and personal loans sooner.',
                      icon: <Shield className="w-4 h-4 text-blue-400" />,
                    },
                  ].map((perk) => {
                    const isSelected = startingBonus === perk.id;
                    return (
                      <div
                        key={perk.id}
                        onClick={() => setStartingBonus(perk.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          isSelected
                            ? 'bg-indigo-950/50 border-indigo-500'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {perk.icon}
                            <span className="text-xs font-bold text-slate-100">{perk.title}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                            {perk.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{perk.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit New Game Button */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                id="btn-start-journey"
                onClick={handleNewGameSubmit}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Journey as {characterName || 'Player'} in Slot {selectedSlotForNew}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: LOAD GAME (3 SLOTS) */}
        {/* ========================================================================= */}
        {screenMode === 'load_game' && (
          <div className="flex-1 flex flex-col justify-between py-3 space-y-4">
            {/* Header with back button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <button
                onClick={() => setScreenMode('main')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-slate-900 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Menu</span>
              </button>
              <div className="text-xs font-bold text-slate-300">Save Slots Management (3 Slots)</div>
            </div>

            {/* 3 Slots List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {slotsMeta.map((slot) => {
                return (
                  <div
                    key={slot.slotId}
                    className={`rounded-2xl border p-4 transition space-y-3 ${
                      slot.isEmpty
                        ? 'bg-slate-900/40 border-dashed border-slate-800 hover:border-slate-700'
                        : 'bg-slate-900/90 border-slate-800 shadow-md hover:border-slate-700'
                    }`}
                  >
                    {/* Slot Top Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700">
                          Slot {slot.slotId}
                        </span>
                        {!slot.isEmpty && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {formatLastSaved(slot.lastSaved)}
                          </span>
                        )}
                      </div>

                      {!slot.isEmpty && (
                        <button
                          onClick={() => setSlotToDelete(slot)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition cursor-pointer"
                          title={`Delete Slot ${slot.slotId}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Slot Body: Empty vs Populated */}
                    {slot.isEmpty ? (
                      <div className="py-3 text-center space-y-2">
                        <div className="text-xs text-slate-400 font-medium">
                          Empty Save Slot
                        </div>
                        <button
                          onClick={() => {
                            setSelectedSlotForNew(slot.slotId);
                            setScreenMode('new_game');
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Start New Game in Slot {slot.slotId}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Character Details Banner */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-black text-white">{slot.playerName}</h3>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>Level {slot.level}</span>
                              <span>•</span>
                              <span>Day {slot.daysPlayed}</span>
                              <span>•</span>
                              <span className="text-slate-300">{slot.housingName}</span>
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

                        {/* Secondary Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Cash Available</span>
                            <span className="text-xs font-bold text-emerald-300">{formatCurrency(slot.cash)}</span>
                          </div>
                          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Credit Score</span>
                            <span className="text-xs font-bold text-blue-400">{slot.creditScore}</span>
                          </div>
                        </div>

                        {/* Action: Play Game Button */}
                        <button
                          onClick={() => loadGameSlot(slot.slotId)}
                          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Load & Play Slot {slot.slotId}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom New Game Shortcut */}
            <div className="pt-2 border-t border-slate-800/80 text-center">
              <button
                onClick={() => {
                  const firstEmpty = slotsMeta.find((s) => s.isEmpty);
                  setSelectedSlotForNew(firstEmpty ? firstEmpty.slotId : 1);
                  setScreenMode('new_game');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create New Character in Any Slot</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: DELETE SLOT CONFIRMATION */}
      {/* ========================================================================= */}
      {slotToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/50">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Delete Save Slot {slotToDelete.slotId}?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-slate-200">{slotToDelete.playerName}</div>
              <div className="text-slate-400">Level {slotToDelete.level} • Day {slotToDelete.daysPlayed}</div>
              <div className="text-emerald-400 font-semibold">{formatCurrency(slotToDelete.netWorth)} Net Worth</div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSlotToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteGameSlot(slotToDelete.slotId);
                  setSlotToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OVERWRITE CONFIRMATION (for New Game) */}
      {/* ========================================================================= */}
      {showOverwriteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/50">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Overwrite Slot {selectedSlotForNew}?</h3>
                <p className="text-xs text-slate-400">Existing game data will be replaced.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to start a new career as <strong className="text-white">{characterName}</strong> in Save Slot {selectedSlotForNew}? The previous character will be erased.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowOverwriteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowOverwriteConfirm(false);
                  startNewGameInSlot(selectedSlotForNew, characterName.trim(), startingBonus);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                Yes, Overwrite & Start
              </button>
            </div>
          </div>
        </div>
      )}
      {/* iOS PWA Install Guide Modal */}
      <IOSInstallModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </div>
  );
};
