import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency } from '../../utils/formatters';
import { JobOpportunity } from '../../types/game';
import { 
  Briefcase, 
  Zap, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  Lock, 
  ArrowUpRight, 
  ChevronRight,
  SlidersHorizontal,
  DollarSign,
  AlertCircle,
  Calendar,
  Building2,
  Sparkles
} from 'lucide-react';

interface JobsAppProps {
  onBack: () => void;
}

export const JobsApp: React.FC<JobsAppProps> = ({ onBack }) => {
  const { 
    player, 
    availableJobs, 
    doJob, 
    applyWeeklyJob, 
    quitWeeklyJob 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'instant' | 'weekly'>('instant');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [jobToast, setJobToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  const playerDegrees = player.education || [];

  const filteredJobs = availableJobs.filter((job) => {
    if (activeTab === 'instant' && job.payType === 'weekly') return false;
    if (activeTab === 'weekly' && job.payType !== 'weekly') return false;
    if (selectedCategory === 'all') return true;
    return job.category === selectedCategory;
  });

  const activeWeeklyJob = availableJobs.find((j) => j.id === player.activeWeeklyJobId);

  const handleWorkGig = (job: JobOpportunity) => {
    if (player.energy < job.energyCost) {
      setJobToast({ message: `Need ${job.energyCost}⚡ energy! Rest or eat to replenish.`, type: 'warning' });
      setTimeout(() => setJobToast(null), 3000);
      return;
    }

    const success = doJob(job.id);
    if (success) {
      setJobToast({ 
        message: `Completed "${job.title}"! Earned +$${job.payoutBase.toLocaleString()} & +${job.xpReward} XP!`, 
        type: 'success' 
      });
      setTimeout(() => setJobToast(null), 3000);
    }
  };

  const handleApplyWeekly = (jobId: string) => {
    const success = applyWeeklyJob(jobId);
    if (success) {
      setJobToast({ message: 'Hired! Weekly salary will be deposited automatically.', type: 'success' });
      setTimeout(() => setJobToast(null), 3000);
    }
  };

  const handleQuitWeekly = () => {
    quitWeeklyJob();
    setJobToast({ message: 'Resigned from position.', type: 'warning' });
    setTimeout(() => setJobToast(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 border-b border-indigo-500/20 px-4 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-wide">WorkForce PRO</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gig & Career
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Available Hustles & Salaried Positions</div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-400">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{player.energy}/{player.maxEnergy}⚡</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-2.5 flex bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('instant')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'instant'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Gigs ({availableJobs.filter((j) => j.payType !== 'weekly').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'weekly'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Salaried Jobs ({availableJobs.filter((j) => j.payType === 'weekly').length})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[10px] font-bold">
          {['all', 'manual', 'delivery', 'tech', 'sales', 'management'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Toast notification */}
      {jobToast && (
        <div className="px-3 pt-2 shrink-0 animate-in fade-in">
          <div className={`p-2 rounded-xl text-xs font-semibold text-center shadow-md ${
            jobToast.type === 'success' 
              ? 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-300' 
              : 'bg-amber-950/90 border border-amber-500/50 text-amber-300'
          }`}>
            {jobToast.message}
          </div>
        </div>
      )}

      {/* Main Jobs Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 no-scrollbar">
        {/* Active Weekly Job Banner if user is employed */}
        {activeWeeklyJob && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">Current Employment</span>
              </div>
              <button
                onClick={handleQuitWeekly}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
              >
                Resign
              </button>
            </div>
            <div className="mt-1 font-bold text-xs text-white">{activeWeeklyJob.title}</div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-300">
              <span>Salary: <strong className="text-emerald-400">{formatCurrency(activeWeeklyJob.weeklySalary || 0)}/wk</strong></span>
              <span>Next Payday: in {player.weeklyJobDaysRemaining || 7} days</span>
            </div>
          </div>
        )}

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No opportunities match your filter.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isWeekly = job.payType === 'weekly';
            const isEmployedHere = player.activeWeeklyJobId === job.id;
            const hasEduReq = job.requiredEducation && !playerDegrees.includes(job.requiredEducation.id);
            const hasEnergy = player.energy >= job.energyCost;

            return (
              <div
                key={job.id}
                className={`p-3 rounded-2xl border transition ${
                  isEmployedHere
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow'
                    : 'bg-slate-900/70 border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white leading-snug">{job.title}</span>
                      {isEmployedHere && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-bold uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{job.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-emerald-400">
                      {isWeekly ? `${formatCurrency(job.weeklySalary || 0)}/wk` : `+${formatCurrency(job.payoutBase)}`}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{job.energyCost}⚡</span>
                      <span>•</span>
                      <span>{job.timeMinutes}m</span>
                    </div>
                  </div>
                </div>

                {/* Requirements / Rewards Row */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    {job.requiredEducation ? (
                      <span className={`flex items-center gap-1 font-medium ${
                        hasEduReq ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        <GraduationCap className="w-3 h-3" />
                        <span>{job.requiredEducation.name}</span>
                        {hasEduReq && <Lock className="w-2.5 h-2.5" />}
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        Skill: <strong className="text-slate-300 capitalize">{job.category}</strong> (+{job.xpReward} XP)
                      </span>
                    )}
                  </div>

                  {isWeekly ? (
                    isEmployedHere ? (
                      <span className="text-[10px] font-bold text-emerald-400">Employed</span>
                    ) : (
                      <button
                        onClick={() => handleApplyWeekly(job.id)}
                        disabled={Boolean(hasEduReq)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          hasEduReq
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow active:scale-95'
                        }`}
                      >
                        {hasEduReq ? 'Degree Needed' : 'Apply Position'}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleWorkGig(job)}
                      disabled={!hasEnergy}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                        hasEnergy
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Work (-{job.energyCost}⚡)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
