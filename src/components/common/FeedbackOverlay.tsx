import React from 'react';
import { useGame } from '../../context/GameContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const FeedbackOverlay: React.FC = () => {
  const { feedbackQueue, dismissFeedback } = useGame();

  if (feedbackQueue.length === 0) return null;

  return (
    <div className="fixed top-28 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 space-y-2">
      {feedbackQueue.map((item) => {
        const isSuccess = item.type === 'success';
        const isWarning = item.type === 'warning';
        const isError = item.type === 'error';

        const bgClass = isSuccess
          ? 'bg-slate-900/95 border-emerald-500/80 text-slate-100 shadow-emerald-950/50'
          : isWarning
          ? 'bg-slate-900/95 border-amber-500/80 text-slate-100 shadow-amber-950/50'
          : isError
          ? 'bg-slate-900/95 border-rose-500/80 text-slate-100 shadow-rose-950/50'
          : 'bg-slate-900/95 border-indigo-500/80 text-slate-100 shadow-indigo-950/50';

        return (
          <div
            key={item.id}
            onClick={() => dismissFeedback(item.id)}
            className={`pointer-events-auto max-w-sm w-full border rounded-2xl p-3 shadow-xl backdrop-blur-md transition-all transform animate-in fade-in slide-in-from-top-4 duration-200 cursor-pointer ${bgClass}`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {isError && <XCircle className="w-5 h-5 text-rose-400" />}
                {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-indigo-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold tracking-tight">{item.text}</p>
                {item.details && item.details.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {item.details.map((detail, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 bg-slate-800/90 text-slate-300 rounded-md border border-slate-700/60"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
