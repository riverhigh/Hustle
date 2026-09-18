import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { HOUSING_TIERS, TRANSPORTATION_TIERS } from '../../constants/gameData';
import { formatCurrency, formatTime, getCreditScoreTier, getDayName } from '../../utils/formatters';
import { 
  User, 
  Home, 
  Car, 
  Award, 
  Target, 
  CheckCircle2, 
  Zap, 
  RotateCcw, 
  ChevronRight,
  Sparkles,
  Lock,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  Save,
  FolderSync,
  LogOut
} from 'lucide-react';
import { SkillName } from '../../types/game';

export const SelfView: React.FC = () => {
  const {
    player,
    upgradeHousing,
    buyTransportation,
    dailyMissions,
    claimMissionReward,
    achievements,
    goals,
    setSelectedGoal,
    resetGame,
    netWorth,
    activeSlotId,
    manualSave,
    exitToMainMenu,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'profile' | 'housing' | 'transport' | 'skills' | 'goals'>('profile');

  const currentHousing = HOUSING_TIERS.find((h) => h.tier === player.housingTier)!;
  const currentTransport = TRANSPORTATION_TIERS.find((t) => t.tier === player.transportationTier)!;
  const creditTier = getCreditScoreTier(player.creditScore);

  const skillKeys: { key: SkillName; label: string; desc: string }[] = [
    { key: 'handyman', label: 'Handyman', desc: 'DIY repairs, lower renovation costs' },
    { key: 'sales', label: 'Sales', desc: 'Higher gig tips and customer conversion' },
    { key: 'negotiation', label: 'Negotiation', desc: 'Lower purchase prices & higher offers' },
    { key: 'finance', label: 'Finance', desc: 'Portfolio returns & loan terms' },
    { key: 'business', label: 'Business', desc: 'Micro-business revenues and growth' },
    { key: 'marketing', label: 'Marketing', desc: 'Customer acquisition and outreach' },
    { key: 'management', label: 'Management', desc: 'Employee productivity and operations' },
    { key: 'realEstate', label: 'Real Estate', desc: 'Property underwriting & auction insight' },
    { key: 'technology', label: 'Technology', desc: 'High-paying digital contracts' },
  ];

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Top Segmented Navigation */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'housing', label: 'Housing' },
          { id: 'transport', label: 'Vehicles' },
          { id: 'skills', label: 'Skills' },
          { id: 'goals', label: 'Goals & Badges' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          {/* Character Identity Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                {player.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-100">{player.name}</h3>
                  <span className="text-xs font-bold text-indigo-400 px-2.5 py-0.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40">
                    Level {player.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Day {player.daysPlayed} • Living at: <strong className="text-slate-200">{currentHousing.name}</strong>
                </p>

                {/* Level Progress Bar */}
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>XP Progress</span>
                    <span>{player.xp} / {player.xpToNext} XP</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (player.xp / player.xpToNext) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Status Stats */}
            <div className="grid grid-cols-3 gap-2 bg-slate-800/60 p-3 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400">NET WORTH</span>
                <div className="text-xs sm:text-sm font-bold text-slate-100">{formatCurrency(netWorth)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">CREDIT SCORE</span>
                <div className="text-xs sm:text-sm font-bold text-blue-400">{player.creditScore}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">REPUTATION</span>
                <div className="text-xs sm:text-sm font-bold text-emerald-400">{player.reputation}%</div>
              </div>
            </div>
          </div>

          {/* Daily Missions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  TODAY'S OBJECTIVES
                </span>
                <h3 className="text-sm font-bold text-slate-100">Daily Missions</h3>
              </div>
              <span className="text-[11px] text-slate-400">Resets each morning</span>
            </div>

            <div className="space-y-2">
              {dailyMissions.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-slate-800/40 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{m.title}</h4>
                    <p className="text-[11px] text-slate-400">{m.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-emerald-400">
                      <span>+{formatCurrency(m.rewardCash)}</span>
                      <span>+{m.rewardXp} XP</span>
                    </div>
                  </div>

                  {m.completed ? (
                    <button
                      disabled={m.claimed}
                      onClick={() => claimMissionReward(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition ${
                        m.claimed
                          ? 'bg-slate-800 text-slate-500 border border-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                      }`}
                    >
                      {m.claimed ? 'Claimed' : 'Claim Reward'}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-semibold shrink-0">
                      {m.currentProgress}/{m.targetGoal}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Slot & Career Profile Controls */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderSync className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Save Slot Management</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-[10px] font-black text-indigo-300">
                Active: Slot {activeSlotId || 1} of 3
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Auto-save synchronizes changes continuously. You can also trigger immediate manual saves or switch profiles from the main menu.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={manualSave}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-bold text-slate-200 transition active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Progress</span>
              </button>

              <button
                onClick={exitToMainMenu}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/60 text-xs font-bold text-indigo-200 transition active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-indigo-300" />
                <span>Main Menu</span>
              </button>
            </div>

            <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Need a fresh start?</span>
              <button
                onClick={() => {
                  if (window.confirm(`Restart career in Slot ${activeSlotId || 1} from Day 1? All cash and properties in this slot will be reset.`)) {
                    resetGame();
                  }
                }}
                className="text-rose-400 hover:text-rose-300 font-bold inline-flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restart Slot {activeSlotId || 1}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOUSING TAB */}
      {activeTab === 'housing' && (
        <div className="space-y-3">
          <div className="px-1">
            <h3 className="text-sm font-bold text-slate-100">Residential Lifestyle Progression</h3>
            <p className="text-xs text-slate-400">Better housing restores more energy every morning and boosts reputation.</p>
          </div>

          <div className="space-y-2.5">
            {HOUSING_TIERS.map((h) => {
              const isCurrent = player.housingTier === h.tier;
              const canAfford = h.purchasePrice > 0 ? player.cash >= h.purchasePrice : player.cash >= h.costMonthly;

              return (
                <div
                  key={h.tier}
                  className={`p-3.5 rounded-2xl border transition space-y-2 ${
                    isCurrent
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">Tier {h.tier}: {h.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 text-[10px] font-bold border border-emerald-800/50">
                            Current Residence
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{h.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-400">
                        {h.purchasePrice > 0 ? formatCurrency(h.purchasePrice) : `${formatCurrency(h.costMonthly)}/mo`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Overnight Energy: <strong>{h.energyRestBonus}</strong></span>
                    </span>
                    <span>Comfort: <strong>{h.comfort}%</strong></span>
                  </div>

                  {!isCurrent && (
                    <button
                      disabled={!canAfford}
                      onClick={() => upgradeHousing(h.tier)}
                      className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                        canAfford
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {h.purchasePrice > 0 ? 'Purchase Home' : 'Sign Lease & Move In'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TRANSPORTATION TAB */}
      {activeTab === 'transport' && (
        <div className="space-y-3">
          <div className="px-1">
            <h3 className="text-sm font-bold text-slate-100">Transportation Progression</h3>
            <p className="text-xs text-slate-400">Unlocks cross-district gigs, heavy hauling contracts, and speed multipliers.</p>
          </div>

          <div className="space-y-2.5">
            {TRANSPORTATION_TIERS.map((t) => {
              const isCurrent = player.transportationTier === t.tier;
              const canAfford = player.cash >= t.cost;

              return (
                <div
                  key={t.tier}
                  className={`p-3.5 rounded-2xl border transition space-y-2 ${
                    isCurrent
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">Tier {t.tier}: {t.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 text-[10px] font-bold border border-emerald-800/50">
                            Active Transport
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-400">
                        {t.cost > 0 ? formatCurrency(t.cost) : 'Free'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                    <span>Speed Multiplier: <strong className="text-indigo-300">{t.speedMultiplier}x</strong></span>
                    <span>Daily Operating Cost: <strong>${t.dailyCost}</strong></span>
                  </div>

                  {!isCurrent && (
                    <button
                      disabled={!canAfford}
                      onClick={() => buyTransportation(t.tier)}
                      className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                        canAfford
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      Acquire Vehicle ({formatCurrency(t.cost)})
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SKILLS TAB */}
      {activeTab === 'skills' && (
        <div className="space-y-3">
          <div className="px-1">
            <h3 className="text-sm font-bold text-slate-100">Branching Skill Mastery</h3>
            <p className="text-xs text-slate-400">Higher skill tiers unlock premium contracts, cheaper renovations, and better financing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {skillKeys.map(({ key, label, desc }) => {
              const skill = player.skills[key];
              const pct = Math.min(100, Math.round((skill.xp / skill.xpToNext) * 100));

              return (
                <div
                  key={key}
                  className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{label}</span>
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      Level {skill.level}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight">{desc}</p>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>XP Progress</span>
                      <span>{skill.xp} / {skill.xpToNext} XP</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GOALS & BADGES TAB */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          {/* Goals */}
          <div className="space-y-3">
            <div className="px-1">
              <h3 className="text-sm font-bold text-slate-100">Long-Term Empire Targets</h3>
              <p className="text-xs text-slate-400">Set and track milestone markers for your financial ascension.</p>
            </div>

            <div className="space-y-2">
              {goals.map((g) => {
                const isSelected = player.selectedGoalId === g.id;
                let currentVal = 0;
                if (g.type === 'cash') currentVal = player.cash;
                if (g.type === 'networth') currentVal = netWorth;
                if (g.type === 'credit') currentVal = player.creditScore;

                const isAchieved = currentVal >= g.targetValue;

                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-slate-800 border-indigo-500 shadow-md'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <h4 className="text-xs font-bold text-slate-200">{g.title}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isAchieved ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isAchieved ? 'Achieved!' : 'In Progress'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>Reward: <strong className="text-slate-300">{g.rewardTitle}</strong></span>
                      <span>Target: <strong className="text-slate-200">{g.targetValue.toLocaleString()}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements Gallery */}
          <div className="space-y-3 pt-2">
            <div className="px-1">
              <h3 className="text-sm font-bold text-slate-100">Achievement Trophy Case</h3>
              <p className="text-xs text-slate-400">Unlock permanent prestige badges across your career.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border space-y-1 ${
                    ach.unlocked
                      ? 'bg-slate-800/80 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Award className={`w-4 h-4 ${ach.unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
                    <h4 className="text-xs font-bold text-slate-200 truncate">{ach.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{ach.description}</p>
                  {ach.unlocked && (
                    <span className="text-[10px] font-semibold text-amber-400 block pt-0.5">
                      ✓ Earned Day {ach.unlockedDay || 1}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
