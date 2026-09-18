import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { 
  Briefcase, 
  Sparkles, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  Users, 
  Plus, 
  Building2, 
  TrendingUp, 
  Megaphone, 
  Sliders, 
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const HustleView: React.FC = () => {
  const { 
    player, 
    availableJobs, 
    doJob, 
    ownedBusinesses, 
    startBusiness, 
    hireEmployee, 
    fireEmployee, 
    boostBusinessMarketing, 
    upgradeBusinessOffice, 
    adjustBusinessPricing 
  } = useGame();

  const [activeSection, setActiveSection] = useState<'gigs' | 'businesses'>('gigs');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewBizModal, setShowNewBizModal] = useState<boolean>(false);
  const [newBizName, setNewBizName] = useState<string>('');
  const [newBizType, setNewBizType] = useState<string>('pressure_wash_pro');

  const filteredJobs = availableJobs.filter((job) => {
    if (selectedCategory === 'all') return true;
    return job.category === selectedCategory;
  });

  const isMicrobusinessUnlocked = player.level >= 7 || player.unlockedFeatures.includes('microbusiness') || ownedBusinesses.length > 0;

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Section Switcher (Gigs vs Micro-Businesses) */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveSection('gigs')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSection === 'gigs'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Hustle & Gigs</span>
        </button>

        <button
          onClick={() => setActiveSection('businesses')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSection === 'businesses'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Businesses {ownedBusinesses.length > 0 && `(${ownedBusinesses.length})`}</span>
          {!isMicrobusinessUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
        </button>
      </div>

      {/* GIGS SECTION */}
      {activeSection === 'gigs' && (
        <div className="space-y-3">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {['all', 'manual', 'delivery', 'tech', 'sales', 'management'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div className="space-y-2.5">
            {filteredJobs.map((job) => {
              const hasEnergy = player.energy >= job.energyCost;
              const hasTransport = !job.requiredTransportTier || player.transportationTier >= job.requiredTransportTier;
              const hasSkill = !job.requiredSkill || player.skills[job.requiredSkill.skill].level >= job.requiredSkill.minLevel;
              const canWork = hasEnergy && hasTransport && hasSkill;

              return (
                <div
                  key={job.id}
                  className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-3.5 shadow-md space-y-2.5 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-100">{job.title}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase tracking-wider border border-slate-700/60">
                          {job.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{job.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-emerald-400">
                        {formatCurrency(job.payoutBase)}
                        {job.bonusTipMax ? <span className="text-[11px] text-emerald-500">+tip</span> : ''}
                      </div>
                      <span className="text-[10px] text-slate-500">estimated pay</span>
                    </div>
                  </div>

                  {/* Requirements & Skill Gain Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border ${
                      hasEnergy ? 'bg-amber-950/30 border-amber-900/50 text-amber-300' : 'bg-rose-950/40 border-rose-900/50 text-rose-300'
                    }`}>
                      <Zap className="w-3 h-3" />
                      <span>{job.energyCost} Energy</span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{job.timeMinutes}m</span>
                    </div>

                    {job.skillRewards.map((sr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-indigo-300 font-medium"
                      >
                        +{sr.xp} {sr.skill.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Lock Warning if missing requirements */}
                  {(!hasTransport || !hasSkill) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/20 px-2.5 py-1 rounded-xl border border-rose-900/30">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {!hasTransport ? (
                        <span>Requires Transportation Tier {job.requiredTransportTier}</span>
                      ) : (
                        <span>Requires {job.requiredSkill?.skill.toUpperCase()} Level {job.requiredSkill?.minLevel}</span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    disabled={!canWork}
                    onClick={() => doJob(job.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md active:scale-98 ${
                      canWork
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                    }`}
                  >
                    <span>WORK SHIFT</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BUSINESSES SECTION */}
      {activeSection === 'businesses' && (
        <div className="space-y-4">
          {!isMicrobusinessUnlocked ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Micro-Business Locked</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Reach <strong className="text-indigo-300">Level 7</strong> through gigs to unlock the ability to incorporate and manage your first commercial enterprise.
              </p>
              <div className="text-xs font-semibold text-slate-300">
                Current Level: <span className="text-emerald-400">{player.level}/7</span>
              </div>
            </div>
          ) : (
            <>
              {/* Top Business Action & Summary */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Your Commercial Portfolio</h3>
                  <p className="text-xs text-slate-400">Manage payroll, advertising & offices</p>
                </div>
                <button
                  onClick={() => setShowNewBizModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Business</span>
                </button>
              </div>

              {ownedBusinesses.length === 0 ? (
                <div className="bg-slate-900/80 border border-dashed border-slate-800 rounded-3xl p-8 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    You don't own any active businesses yet. Start a small service company to generate recurring monthly profits!
                  </p>
                  <button
                    onClick={() => setShowNewBizModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Incorporate First Business
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ownedBusinesses.map((biz) => {
                    const netProfit = biz.revenueMonthly - biz.expensesMonthly;
                    return (
                      <div
                        key={biz.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3.5"
                      >
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                              {biz.category} • Tier {biz.officeTier} Office
                            </span>
                            <h4 className="text-base font-bold text-slate-100">{biz.name}</h4>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-emerald-400 rounded-xl border border-slate-700">
                            {biz.reputation}% Rep
                          </span>
                        </div>

                        {/* Financial stats */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-800 text-center">
                          <div>
                            <span className="text-[10px] text-slate-400">REVENUE</span>
                            <div className="text-xs sm:text-sm font-bold text-emerald-400">
                              {formatCurrency(biz.revenueMonthly)}/mo
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400">EXPENSES</span>
                            <div className="text-xs sm:text-sm font-bold text-rose-400">
                              {formatCurrency(biz.expensesMonthly)}/mo
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400">NET PROFIT</span>
                            <div className={`text-xs sm:text-sm font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {formatCurrency(netProfit)}/mo
                            </div>
                          </div>
                        </div>

                        {/* Staff & Clients info */}
                        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-indigo-400" />
                            <span>{biz.employees.length} Employees</span>
                          </div>
                          <span>{biz.customersCount} Active Clients</span>
                        </div>

                        {/* Quick Business Actions */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <button
                            onClick={() => hireEmployee(biz.id, 'Operations Specialist', 900)}
                            className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-center cursor-pointer transition text-[11px] font-semibold text-slate-200"
                          >
                            Hire Staff ($900/mo)
                          </button>

                          <button
                            onClick={() => boostBusinessMarketing(biz.id, 250)}
                            className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-center cursor-pointer transition text-[11px] font-semibold text-slate-200"
                          >
                            Ad Campaign ($250)
                          </button>

                          <button
                            onClick={() => upgradeBusinessOffice(biz.id)}
                            className="p-2 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/60 rounded-xl text-center cursor-pointer transition text-[11px] font-semibold text-indigo-300"
                          >
                            Expand Office
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* START BUSINESS MODAL */}
      {showNewBizModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-100">Incorporate New Micro-Business</h3>
            
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Business Name</label>
              <input
                type="text"
                placeholder="e.g. Apex Power Cleaners"
                value={newBizName}
                onChange={(e) => setNewBizName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Industry Blueprint</label>
              <div className="space-y-2">
                {[
                  { id: 'pressure_wash_pro', name: 'Pressure Washing Commercial', cost: 1200, rev: 1800, exp: 600 },
                  { id: 'cleaning_crew', name: 'Office Cleaning Solutions', cost: 2500, rev: 3200, exp: 1100 },
                  { id: 'landscaping_pros', name: 'Elite Landscape & Turf', cost: 4500, rev: 5400, exp: 1800 },
                  { id: 'tech_agency', name: 'Digital Web & Growth Agency', cost: 6000, rev: 8500, exp: 2400 },
                  { id: 'moving_logistics', name: 'Regional Cargo & Moving', cost: 12000, rev: 16000, exp: 5500 },
                ].map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setNewBizType(b.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition ${
                      newBizType === b.id
                        ? 'bg-indigo-950/50 border-indigo-500'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>{b.name}</span>
                      <span className="text-emerald-400">{formatCurrency(b.cost)} startup</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>Est. Rev: {formatCurrency(b.rev)}/mo</span>
                      <span>Expenses: {formatCurrency(b.exp)}/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowNewBizModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const finalName = newBizName.trim() || 'Vance Ventures';
                  if (startBusiness(newBizType, finalName)) {
                    setShowNewBizModal(false);
                    setNewBizName('');
                  }
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Confirm & Launch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
