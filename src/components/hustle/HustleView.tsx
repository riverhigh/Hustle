import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { BUSINESS_TEMPLATES } from '../../constants/gameData';
import { 
  Briefcase, 
  Sparkles, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Users, 
  Plus, 
  Building2, 
  TrendingUp, 
  Megaphone, 
  Sliders, 
  AlertCircle,
  CheckCircle2,
  Lock,
  GraduationCap,
  Award,
  BookOpen,
  School,
  ShieldCheck,
  Wallet,
  Landmark,
  Calendar,
  X,
  Banknote,
  Newspaper,
  ArrowRight
} from 'lucide-react';

export const HustleView: React.FC = () => {
  const { 
    player, 
    availableJobs, 
    educationCourses,
    enrollInEducation,
    doJob, 
    applyWeeklyJob,
    quitWeeklyJob,
    ownedBusinesses, 
    startBusiness, 
    depositToBusiness,
    withdrawFromBusiness,
    hireEmployee, 
    fireEmployee, 
    boostBusinessMarketing, 
    upgradeBusinessOffice, 
    adjustBusinessPricing,
    netWorth,
    newsFeed,
    openPhoneApp
  } = useGame();

  const latestNews = newsFeed && newsFeed.length > 0 ? newsFeed[0] : null;

  const [activeSection, setActiveSection] = useState<'businesses' | 'education' | 'gigs'>('businesses');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [payTypeFilter, setPayTypeFilter] = useState<'all' | 'instant' | 'weekly'>('all');
  const [showNewBizModal, setShowNewBizModal] = useState<boolean>(false);
  const [newBizName, setNewBizName] = useState<string>('');
  const [newBizType, setNewBizType] = useState<string>(BUSINESS_TEMPLATES[0].id);

  // Treasury modal state
  const [treasuryModalBiz, setTreasuryModalBiz] = useState<{ id: string; name: string; treasury: number; mode: 'deposit' | 'withdraw' } | null>(null);
  const [treasuryAmount, setTreasuryAmount] = useState<string>('25000');

  const filteredJobs = availableJobs.filter((job) => {
    if (payTypeFilter === 'instant' && job.payType === 'weekly') return false;
    if (payTypeFilter === 'weekly' && job.payType !== 'weekly') return false;
    if (selectedCategory === 'all') return true;
    return job.category === selectedCategory;
  });

  const isMicrobusinessUnlocked = player.level >= 7 || player.unlockedFeatures.includes('microbusiness') || ownedBusinesses.length > 0;
  const playerDegrees = player.education || [];

  const handleTreasuryAction = () => {
    if (!treasuryModalBiz) return;
    const amount = parseInt(treasuryAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    if (treasuryModalBiz.mode === 'deposit') {
      if (depositToBusiness(treasuryModalBiz.id, amount)) {
        setTreasuryModalBiz(null);
      }
    } else {
      if (withdrawFromBusiness(treasuryModalBiz.id, amount)) {
        setTreasuryModalBiz(null);
      }
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* 1. Finances Overview Section (Matching IMG_6546) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Banknote className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">Finances</h2>
            <p className="text-[11px] text-slate-400">Your financial overview</p>
          </div>
        </div>

        <div className="bg-[#141417] border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3 shadow-md">
          <div>
            <span className="text-xs font-semibold text-slate-400">Bank Balance</span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
              {formatCurrency(player.cash)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
            <div className="bg-[#1a1a1e] rounded-xl p-2.5 border border-white/5">
              <span className="text-[11px] text-slate-400">Net Worth</span>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 truncate">
                {formatCurrency(netWorth)}
              </div>
            </div>
            <div className="bg-[#1a1a1e] rounded-xl p-2.5 border border-white/5">
              <span className="text-[11px] text-slate-400">Credit Score</span>
              <div className="text-sm font-bold text-sky-400 mt-0.5">
                {player.creditScore} FICO
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Market News Section (Matching IMG_6546) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Market News</h2>
              <p className="text-[11px] text-slate-400">Latest business updates</p>
            </div>
          </div>
          <button
            onClick={() => openPhoneApp('news')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-[#141417] border border-white/5 rounded-3xl p-4 shadow-md">
          {latestNews ? (
            <div 
              onClick={() => openPhoneApp('news')}
              className="space-y-1.5 cursor-pointer hover:opacity-90 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded-md text-[10px]">
                  {latestNews.source}
                </span>
                <span className="text-slate-500 text-[11px]">Day {latestNews.day}</span>
              </div>
              <h3 className="font-bold text-sm text-white line-clamp-1">{latestNews.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{latestNews.content}</p>
            </div>
          ) : (
            <div className="py-6 text-center space-y-1">
              <Newspaper className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No recent news</div>
              <p className="text-xs text-slate-500">Business activities will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Section Switcher (Enterprises vs Education vs Gigs) */}
      <div className="flex bg-[#141417] p-1.5 rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveSection('businesses')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSection === 'businesses'
              ? 'bg-[#007AFF] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Businesses {ownedBusinesses.length > 0 && `(${ownedBusinesses.length})`}</span>
          {!isMicrobusinessUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
        </button>

        <button
          onClick={() => setActiveSection('education')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSection === 'education'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Education ({playerDegrees.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('gigs')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSection === 'gigs'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>All Gigs ({availableJobs.length})</span>
        </button>
      </div>

      {/* GIGS SECTION */}
      {activeSection === 'gigs' && (
        <div className="space-y-3">
          {/* Job Type Filter Bar */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setPayTypeFilter('all')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                payTypeFilter === 'all'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Roles ({availableJobs.length})
            </button>
            <button
              onClick={() => setPayTypeFilter('instant')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                payTypeFilter === 'instant'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Pay</span>
            </button>
            <button
              onClick={() => setPayTypeFilter('weekly')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                payTypeFilter === 'weekly'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Weekly Salaried</span>
            </button>
          </div>

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
              const isWeekly = job.payType === 'weekly';
              const isCurrentlyEmployed = player.activeWeeklyJobId === job.id;
              const hasEnergy = player.energy >= job.energyCost;
              const hasTransport = !job.requiredTransportTier || player.transportationTier >= job.requiredTransportTier;
              const hasSkill = !job.requiredSkill || player.skills[job.requiredSkill.skill].level >= job.requiredSkill.minLevel;
              const hasEducation = !job.requiredEducation || playerDegrees.includes(job.requiredEducation.id);
              const canWork = hasEnergy && hasTransport && hasSkill && hasEducation;
              const canApplyWeekly = hasTransport && hasSkill && hasEducation;

              return (
                <div
                  key={job.id}
                  className={`bg-slate-900/90 border rounded-2xl p-3.5 shadow-md space-y-2.5 transition ${
                    isCurrentlyEmployed
                      ? 'border-indigo-500/80 ring-1 ring-indigo-500/40 bg-indigo-950/20'
                      : 'border-slate-800/90 hover:border-slate-700/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-100">{job.title}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase tracking-wider border border-slate-700/60">
                          {job.category}
                        </span>
                        {isWeekly && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950/70 text-indigo-300 border border-indigo-700/50 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Weekly Career
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{job.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      {isWeekly && job.weeklySalary ? (
                        <>
                          <div className="text-base font-bold text-indigo-400">
                            {formatCurrency(job.weeklySalary)}
                            <span className="text-xs text-indigo-300 font-normal">/wk</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">Weekly Payroll</span>
                        </>
                      ) : (
                        <>
                          <div className="text-base font-bold text-emerald-400">
                            {formatCurrency(job.payoutBase)}
                            {job.bonusTipMax ? <span className="text-[11px] text-emerald-500">+tip</span> : ''}
                          </div>
                          <span className="text-[10px] text-slate-500">instant pay</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Requirements & Info Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    {isWeekly && job.weeklyEnergyCost && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-indigo-300 font-semibold">
                        <Zap className="w-3 h-3 text-indigo-400" />
                        <span>-{job.weeklyEnergyCost}⚡ Upkeep /wk</span>
                      </div>
                    )}

                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border ${
                      hasEnergy ? 'bg-amber-950/30 border-amber-900/50 text-amber-300' : 'bg-rose-950/40 border-rose-900/50 text-rose-300'
                    }`}>
                      <Zap className="w-3 h-3" />
                      <span>{job.energyCost} Energy /shift</span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{job.timeMinutes}m shift</span>
                    </div>

                    {job.requiredEducation && (
                      <span className={`px-2 py-0.5 rounded-lg font-medium flex items-center gap-1 ${
                        hasEducation 
                          ? 'bg-emerald-950/30 border border-emerald-900/50 text-emerald-300' 
                          : 'bg-amber-950/30 border border-amber-900/50 text-amber-300'
                      }`}>
                        <GraduationCap className="w-3 h-3" />
                        <span>{hasEducation ? 'Degree Verified' : 'Degree Required'}</span>
                      </span>
                    )}

                    {job.skillRewards.map((sr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-indigo-300 font-medium"
                      >
                        +{sr.xp} {sr.skill.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Education Lock Notice */}
                  {job.requiredEducation && !hasEducation && (
                    <div className="flex items-center justify-between text-[11px] text-amber-300 bg-amber-950/30 px-3 py-2 rounded-xl border border-amber-800/40">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <span>Requires Degree: </span>
                          <span className="font-bold text-amber-200">{job.requiredEducation.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveSection('education')}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] transition active:scale-95 cursor-pointer shadow-sm shrink-0"
                      >
                        Enroll Now
                      </button>
                    </div>
                  )}

                  {/* Lock Warning if missing skills/transport */}
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

                  {/* Action Buttons */}
                  {isWeekly ? (
                    <div className="space-y-2 pt-1">
                      {isCurrentlyEmployed ? (
                        <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-800/50 p-2.5 rounded-xl">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <div className="text-xs">
                              <span className="font-bold text-slate-100">Currently Employed</span>
                              <span className="text-slate-400 block text-[11px]">
                                Next Paycheck ({formatCurrency(job.weeklySalary || 0)}) in {player.weeklyJobDaysRemaining ?? 7} in-game days
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={quitWeeklyJob}
                            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-semibold rounded-lg transition cursor-pointer"
                          >
                            Resign
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled={!canApplyWeekly}
                          onClick={() => applyWeeklyJob(job.id)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md active:scale-98 ${
                            canApplyWeekly
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>ACCEPT WEEKLY CAREER CONTRACT ({formatCurrency(job.weeklySalary || 0)}/wk)</span>
                        </button>
                      )}

                      {/* Optional Overtime Shift button for extra instant cash */}
                      <button
                        disabled={!canWork}
                        onClick={() => doJob(job.id)}
                        className={`w-full py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                          canWork
                            ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                            : 'bg-slate-900/50 text-slate-600 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Work Overtime Shift (+{formatCurrency(job.payoutBase)})</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={!canWork}
                      onClick={() => doJob(job.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md active:scale-98 ${
                        canWork
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                      }`}
                    >
                      <span>WORK SHIFT (INSTANT PAY)</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDUCATION SECTION */}
      {activeSection === 'education' && (
        <div className="space-y-4">
          {/* Header Overview Card */}
          <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-900/40 rounded-3xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  HIGHER EDUCATION & DEGREE PROGRAMS
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">Professional Certifications</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">YOUR CASH</span>
                <div className="text-sm font-bold text-emerald-400">{formatCurrency(player.cash)}</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Investing tuition in formal degrees substantially accelerates your <strong>Skill Masteries</strong>, raises your career tier, and qualifies you for lucrative high-tier jobs and executive positions.
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Earned Credentials:</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700/60">
                High School Diploma
              </span>
              {playerDegrees
                .filter((d) => d !== 'high_school_diploma')
                .map((dId) => {
                  const c = educationCourses.find((item) => item.id === dId);
                  return (
                    <span
                      key={dId}
                      className="px-2 py-0.5 rounded-md bg-emerald-950/50 text-emerald-300 font-semibold border border-emerald-800/60 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {c ? c.name : dId}
                    </span>
                  );
                })}
            </div>
          </div>

          {/* Courses List */}
          <div className="space-y-3">
            {educationCourses.map((course) => {
              const isCompleted = playerDegrees.includes(course.id);
              const hasPrerequisite = !course.prerequisiteEduId || playerDegrees.includes(course.prerequisiteEduId);
              const hasLevel = !course.minPlayerLevel || player.level >= course.minPlayerLevel;
              const hasCash = player.cash >= course.cost;
              const hasEnergy = player.energy >= course.energyCost;
              const canEnroll = !isCompleted && hasPrerequisite && hasLevel && hasCash && hasEnergy;

              // Badge color by degree type
              const typeColor = 
                course.degreeType === 'Master' ? 'bg-purple-950/40 text-purple-300 border-purple-800/50' :
                course.degreeType === 'Bachelor' ? 'bg-blue-950/40 text-blue-300 border-blue-800/50' :
                course.degreeType === 'Associate' ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/50' :
                course.degreeType === 'License' ? 'bg-amber-950/40 text-amber-300 border-amber-800/50' :
                'bg-emerald-950/40 text-emerald-300 border-emerald-800/50';

              return (
                <div
                  key={course.id}
                  className={`bg-slate-900/90 border rounded-2xl p-4 shadow-md space-y-3 transition ${
                    isCompleted 
                      ? 'border-emerald-800/40 bg-slate-900/60' 
                      : 'border-slate-800/90 hover:border-slate-700/80'
                  }`}
                >
                  {/* Top Bar: Institution & Degree Type */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${typeColor}`}>
                          {course.degreeType}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <School className="w-3 h-3 text-slate-500" />
                          {course.institution}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        {course.name}
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-amber-400">
                        {formatCurrency(course.cost)}
                      </div>
                      <span className="text-[10px] text-slate-500">tuition fee</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{course.description}</p>

                  {/* Skills Boosted Showcase */}
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      SKILLS BOOSTED ON GRADUATION:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {course.skillsBoosted.map((boost, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-indigo-950/50 text-indigo-300 text-[11px] font-bold border border-indigo-800/50"
                        >
                          {boost.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Career unlock summary */}
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{course.unlocksJobsSummary}</span>
                  </div>

                  {/* Costs / Requirements Bar */}
                  <div className="flex items-center gap-2 text-[11px]">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border ${
                      hasEnergy ? 'bg-slate-800/80 border-slate-700/60 text-slate-300' : 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                    }`}>
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{course.energyCost} Energy</span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{Math.round(course.timeMinutes / 60)}h Study Time</span>
                    </div>
                  </div>

                  {/* Missing Prerequisite or Level Warning */}
                  {!hasPrerequisite && course.prerequisiteEduName && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/30 px-3 py-1.5 rounded-xl border border-rose-900/40">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{course.prerequisiteEduName}</span>
                    </div>
                  )}

                  {!hasLevel && course.minPlayerLevel && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/30 px-3 py-1.5 rounded-xl border border-rose-900/40">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Requires Player Level {course.minPlayerLevel}</span>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    disabled={!canEnroll}
                    onClick={() => enrollInEducation(course.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md active:scale-98 ${
                      isCompleted
                        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 cursor-default'
                        : canEnroll
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-950/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>GRADUATED & DEGREE EARNED</span>
                      </>
                    ) : !hasCash ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>NEED {formatCurrency(course.cost - player.cash)} MORE TUITION</span>
                      </>
                    ) : !hasEnergy ? (
                      <>
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>NEED {course.energyCost} ENERGY (REST OR EAT FIRST)</span>
                      </>
                    ) : !hasPrerequisite ? (
                      <>
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>PREREQUISITE DEGREE REQUIRED</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4" />
                        <span>ENROLL & GRADUATE ({formatCurrency(course.cost)})</span>
                      </>
                    )}
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

                        {/* Corporate Treasury & Working Capital */}
                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Landmark className="w-4 h-4 text-emerald-400" />
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                                  Corporate Treasury
                                </span>
                                <span className="text-sm font-bold text-emerald-300">
                                  {formatCurrency(biz.treasury || 0)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setTreasuryModalBiz({ id: biz.id, name: biz.name, treasury: biz.treasury || 0, mode: 'deposit' });
                                  setTreasuryAmount('25000');
                                }}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                              >
                                <ArrowDownRight className="w-3.5 h-3.5" />
                                <span>Deposit</span>
                              </button>

                              <button
                                onClick={() => {
                                  setTreasuryModalBiz({ id: biz.id, name: biz.name, treasury: biz.treasury || 0, mode: 'withdraw' });
                                  setTreasuryAmount(Math.min(biz.treasury || 0, 25000).toString());
                                }}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                                <span>Withdraw</span>
                              </button>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Daily net profits accrue here automatically.</span>
                            <span className="text-slate-300 font-medium">Wallet: {formatCurrency(player.cash)}</span>
                          </div>
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

      {/* TREASURY DEPOSIT / WITHDRAW MODAL */}
      {treasuryModalBiz && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {treasuryModalBiz.mode === 'deposit' ? 'Deposit to Treasury' : 'Withdraw from Treasury'}
                  </h3>
                  <p className="text-xs text-slate-400">{treasuryModalBiz.name}</p>
                </div>
              </div>
              <button
                onClick={() => setTreasuryModalBiz(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Balances summary */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Personal Cash</span>
                <span className="font-bold text-emerald-400 text-sm">{formatCurrency(player.cash)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Business Treasury</span>
                <span className="font-bold text-indigo-300 text-sm">{formatCurrency(treasuryModalBiz.treasury)}</span>
              </div>
            </div>

            {/* Quick amount chips */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Select Amount</label>
              <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                {[10000, 50000, 250000, 1000000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTreasuryAmount(preset.toString())}
                    className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer transition"
                  >
                    +${preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}k`}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={treasuryAmount}
                  onChange={(e) => setTreasuryAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (treasuryModalBiz.mode === 'deposit') {
                      setTreasuryAmount(player.cash.toString());
                    } else {
                      setTreasuryAmount(treasuryModalBiz.treasury.toString());
                    }
                  }}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setTreasuryModalBiz(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTreasuryAction}
                className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition active:scale-95 ${
                  treasuryModalBiz.mode === 'deposit'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                Confirm {treasuryModalBiz.mode === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* START BUSINESS MODAL ($250k to $10m) */}
      {showNewBizModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">Incorporate New Commercial Enterprise</h3>
                <p className="text-xs text-slate-400">Costs range from $250k to $10m based on industry scale</p>
              </div>
              <button
                onClick={() => setShowNewBizModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Company Trade Name</label>
              <input
                type="text"
                placeholder="e.g. Apex Global Operations"
                value={newBizName}
                onChange={(e) => setNewBizName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-400">Industry Enterprise Blueprint</label>
                <span className="text-[11px] text-emerald-400 font-bold">Your Cash: {formatCurrency(player.cash)}</span>
              </div>
              <div className="space-y-2.5">
                {BUSINESS_TEMPLATES.map((b) => {
                  const hasCash = player.cash >= b.cost;
                  const isSelected = newBizType === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setNewBizType(b.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 shadow-md'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-100">{b.name}</h4>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold uppercase">
                              {b.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{b.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-xs sm:text-sm font-bold ${hasCash ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(b.cost)}
                          </div>
                          <span className="text-[10px] text-slate-500">Capital Required</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                        <span>Projected Rev: <strong className="text-emerald-400">{formatCurrency(b.revenue)}/mo</strong></span>
                        <span>Projected Exp: <strong className="text-rose-400">{formatCurrency(b.expenses)}/mo</strong></span>
                        <span>Net Profit: <strong className="text-emerald-300">+{formatCurrency(b.revenue - b.expenses)}/mo</strong></span>
                      </div>
                    </div>
                  );
                })}
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
                  const finalName = newBizName.trim() || 'Vance Global Enterprises';
                  if (startBusiness(newBizType, finalName)) {
                    setShowNewBizModal(false);
                    setNewBizName('');
                  }
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition active:scale-95"
              >
                Incorporate & Launch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
