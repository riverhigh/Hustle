import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { HOUSING_TIERS, TRANSPORTATION_TIERS, EDUCATION_COURSES } from '../../constants/gameData';
import { PlayerProfile, Property, CreditCard, PropertyArea } from '../../types/game';
import { 
  Terminal, 
  DollarSign, 
  Zap, 
  ShieldAlert, 
  Home, 
  Car, 
  GraduationCap, 
  Building2, 
  RefreshCw, 
  Wrench, 
  Award, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft,
  Gem,
  Sliders,
  TrendingUp,
  CreditCard as CreditCardIcon,
  Crown
} from 'lucide-react';

interface AdminPageProps {
  onBack?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const { 
    player, 
    setPlayer, 
    bankAccounts, 
    setBankAccounts, 
    creditCards, 
    setCreditCards, 
    loans, 
    setLoans, 
    ownedProperties, 
    setOwnedProperties, 
    marketProperties, 
    setMarketProperties, 
    ownedBusinesses, 
    setOwnedBusinesses, 
    autoCollectRentUnlocked, 
    setAutoCollectRentUnlocked,
    activeSlotId,
    triggerFeedback
  } = useGame();

  const [customCash, setCustomCash] = useState<string>(player.cash.toString());
  const [customGems, setCustomGems] = useState<string>((player.gems || 10).toString());
  const [customCredit, setCustomCredit] = useState<number>(player.creditScore);
  const [customLevel, setCustomLevel] = useState<number>(player.level);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedbackMsg(msg);
    if (triggerFeedback) triggerFeedback(msg, 'success');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // 1. Cash & Resources Controls
  const handleApplyCash = () => {
    const val = parseInt(customCash, 10);
    if (!isNaN(val)) {
      setPlayer((prev: PlayerProfile) => ({ ...prev, cash: Math.max(0, val) }));
      notify(`Set Cash to ${formatCurrency(val)}`);
    }
  };

  const handleAddCash = (amount: number) => {
    setPlayer((prev: PlayerProfile) => ({ ...prev, cash: prev.cash + amount }));
    notify(`Added ${formatCurrency(amount)} Cash`);
  };

  const handleAddGems = (amount: number) => {
    setPlayer((prev: PlayerProfile) => ({ ...prev, gems: (prev.gems || 0) + amount }));
    notify(`Added +${amount} Gems`);
  };

  const handleRefillEnergy = () => {
    setPlayer((prev: PlayerProfile) => ({ ...prev, energy: prev.maxEnergy }));
    notify(`Energy fully restored to 100%`);
  };

  const handleInfiniteEnergy = () => {
    setPlayer((prev: PlayerProfile) => ({ ...prev, energy: 9999, maxEnergy: 9999 }));
    notify(`Infinite God Energy (9,999⚡) enabled!`);
  };

  // 2. Credit Score
  const handleSetCredit = (score: number) => {
    setCustomCredit(score);
    setPlayer((prev: PlayerProfile) => ({ ...prev, creditScore: score }));
    notify(`Credit Score set to ${score}`);
  };

  // 3. Level & XP
  const handleSetLevel = (lvl: number) => {
    setCustomLevel(lvl);
    setPlayer((prev: PlayerProfile) => ({ ...prev, level: lvl, xp: (lvl - 1) * 100 }));
    notify(`Level set to ${lvl}`);
  };

  // 4. Housing & Transport
  const handleSetHousing = (tier: number) => {
    setPlayer((prev: PlayerProfile) => ({ ...prev, housingTier: tier }));
    const h = HOUSING_TIERS.find((item) => item.tier === tier);
    notify(`Housing updated to: ${h?.name}`);
  };

  const handleSetTransport = (tier: number) => {
    setPlayer((prev: PlayerProfile) => ({ ...prev, transportTier: tier }));
    const t = TRANSPORTATION_TIERS.find((item) => item.tier === tier);
    notify(`Vehicle updated to: ${t?.name}`);
  };

  // 5. Unlock all degrees
  const handleUnlockAllDegrees = () => {
    const allCourseIds = EDUCATION_COURSES.map((c) => c.id);
    setPlayer((prev: PlayerProfile) => ({
      ...prev,
      education: Array.from(new Set([...prev.education, ...allCourseIds])),
    }));
    notify(`All educational degrees & licenses unlocked!`);
  };

  // 6. Real Estate Controls
  const handleOwnAllProperties = () => {
    const allProps = marketProperties.map((p: Property) => ({
      ...p,
      isOwned: true,
      overallCondition: 100,
      collectedRentUnclaimed: p.estimatedRent * 2,
      areas: p.areas.map((a: PropertyArea) => ({ ...a, condition: 100, isRenovated: true })),
    }));
    setOwnedProperties(allProps);
    setMarketProperties(allProps);
    notify(`Acquired all ${allProps.length} properties in prime 100% condition!`);
  };

  const handleFixAllProperties = () => {
    setOwnedProperties((prev: Property[]) =>
      prev.map((p: Property) => ({
        ...p,
        overallCondition: 100,
        areas: p.areas.map((a: PropertyArea) => ({ ...a, condition: 100, isRenovated: true })),
      }))
    );
    notify(`All owned properties restored to 100% mint condition!`);
  };

  // 7. Clear all debts
  const handleWipeAllDebts = () => {
    setCreditCards((prev: CreditCard[]) => prev.map((c: CreditCard) => ({ ...c, balance: 0 })));
    setLoans([]);
    notify(`All credit card balances and loan debts wiped to $0!`);
  };

  // 8. Toggle Auto Collect Rent
  const handleToggleAutoRent = () => {
    const next = !autoCollectRentUnlocked;
    setAutoCollectRentUnlocked(next);
    notify(`Auto Rent Collection: ${next ? 'ENABLED' : 'DISABLED'}`);
  };

  // 9. Time Travel
  const handleAdvanceDays = (days: number) => {
    setPlayer((prev: PlayerProfile) => ({
      ...prev,
      daysPlayed: prev.daysPlayed + days,
      dayOfWeek: (prev.dayOfWeek + days) % 7,
    }));
    notify(`Fast-forwarded +${days} days into the future!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 select-none max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-rose-500/30 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/50">
                <Terminal className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-black tracking-tight text-white">Game Master God Mode</h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                /admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active Slot #{activeSlotId || 1} • Player: <strong className="text-white">{player.name}</strong>
            </p>
          </div>
        </div>

        {feedbackMsg && (
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {feedbackMsg && (
        <div className="sm:hidden bg-emerald-950/90 border border-emerald-500/50 p-2 rounded-xl text-xs font-bold text-emerald-300 text-center">
          {feedbackMsg}
        </div>
      )}

      {/* Grid of Control Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel 1: Currency & Energy */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-md">
          <div className="flex items-center gap-2 text-sm font-black text-emerald-400 border-b border-slate-800/80 pb-2">
            <DollarSign className="w-4 h-4" />
            <span>Cash & Energy Injection</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">Custom Cash ($)</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customCash}
                onChange={(e) => setCustomCash(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleApplyCash}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition cursor-pointer"
              >
                Set Cash
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[10000, 50000, 250000, 1000000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAddCash(amt)}
                  className="py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 text-emerald-300 text-[11px] font-black transition cursor-pointer"
                >
                  +{amt >= 1000000 ? '$1M' : `$${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Energy & Stamina</span>
              <span className="font-bold text-amber-400">{player.energy} / {player.maxEnergy}⚡</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefillEnergy}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Refill 100% Energy</span>
              </button>
              <button
                onClick={handleInfiniteEnergy}
                className="py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                title="God Mode 9,999 Energy"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Infinite 9,999⚡</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">VIP Gems</span>
              <span className="font-bold text-amber-300">{player.gems || 10} Gems</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[50, 200, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAddGems(amt)}
                  className="py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30 hover:bg-amber-900/60 text-amber-300 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Gem className="w-3 h-3 text-amber-400" />
                  <span>+{amt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Credit Score, Level & Time Travel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-md">
          <div className="flex items-center gap-2 text-sm font-black text-indigo-400 border-b border-slate-800/80 pb-2">
            <Sliders className="w-4 h-4" />
            <span>Credit Score & Progression</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Credit Score (FICO)</span>
              <span className="font-black text-indigo-300 text-sm">{player.creditScore}</span>
            </div>
            <input
              type="range"
              min={300}
              max={850}
              value={customCredit}
              onChange={(e) => handleSetCredit(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetCredit(850)}
                className="flex-1 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Max 850 (Exceptional)
              </button>
              <button
                onClick={() => handleSetCredit(720)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                720 (Prime)
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Empire Player Level</span>
              <span className="font-black text-amber-300">Level {player.level}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 5, 10, 20].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleSetLevel(lvl)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    player.level === lvl
                      ? 'bg-amber-600 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Lvl {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Simulation Clock (Day {player.daysPlayed})</span>
              <span className="font-bold text-slate-300">Fast-Forward</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdvanceDays(1)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                +1 Day
              </button>
              <button
                onClick={() => handleAdvanceDays(7)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                +1 Week
              </button>
              <button
                onClick={() => handleAdvanceDays(30)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                +1 Month
              </button>
            </div>
          </div>
        </div>

        {/* Panel 3: Real Estate Portfolio Superpowers */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-md">
          <div className="flex items-center gap-2 text-sm font-black text-amber-400 border-b border-slate-800/80 pb-2">
            <Building2 className="w-4 h-4" />
            <span>Real Estate God Controls</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">Owned Properties: {ownedProperties.length}</div>
            <button
              onClick={handleOwnAllProperties}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Unlock & Own ALL Properties (100% Condition)</span>
            </button>

            <button
              onClick={handleFixAllProperties}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Repair All Owned Properties to 100%</span>
            </button>

            <button
              onClick={handleToggleAutoRent}
              className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                autoCollectRentUnlocked
                  ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Auto-Collect Rent: {autoCollectRentUnlocked ? 'ACTIVE (Always On)' : 'DISABLED'}</span>
            </button>
          </div>
        </div>

        {/* Panel 4: Lifestyle, Education & Debts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-md">
          <div className="flex items-center gap-2 text-sm font-black text-rose-400 border-b border-slate-800/80 pb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Debt Wipe & Upgrades</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">Financial Relief</div>
            <button
              onClick={handleWipeAllDebts}
              className="w-full py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CreditCardIcon className="w-4 h-4" />
              <span>Wipe All Debts & Loans to $0</span>
            </button>

            <button
              onClick={handleUnlockAllDegrees}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Unlock All Degrees & Real Estate License</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="text-xs text-slate-400">Instant Housing Tier</div>
            <div className="grid grid-cols-3 gap-1.5">
              {HOUSING_TIERS.slice(0, 3).map((h) => (
                <button
                  key={h.tier}
                  onClick={() => handleSetHousing(h.tier)}
                  className={`py-1.5 rounded-lg text-[11px] font-bold truncate transition cursor-pointer ${
                    player.housingTier === h.tier
                      ? 'bg-amber-600 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {h.name.split(' ')[0]}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {HOUSING_TIERS.slice(3).map((h) => (
                <button
                  key={h.tier}
                  onClick={() => handleSetHousing(h.tier)}
                  className={`py-1.5 rounded-lg text-[11px] font-bold truncate transition cursor-pointer ${
                    player.housingTier === h.tier
                      ? 'bg-amber-600 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {h.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
