import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, Newspaper, TrendingUp, Building2, Globe, AlertCircle } from 'lucide-react';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose }) => {
  const { newsFeed, setActiveTab } = useGame();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Market Wire & Intelligence</h2>
              <p className="text-xs text-slate-400">Live economic trends, rumors & city events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* News Feed Items */}
        <div className="overflow-y-auto py-3 space-y-3.5 pr-1">
          {newsFeed.map((news) => {
            return (
              <div
                key={news.id}
                className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-2xl space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-400">{news.source}</span>
                  <span className="text-slate-500">Day {news.day}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 leading-snug">{news.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{news.content}</p>

                {news.reliability && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-1 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Market Rumor • Estimated Reliability: {news.reliability}%</span>
                  </div>
                )}

                {news.impactNote && (
                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-emerald-400 font-semibold">Strategic Impact: </span>
                    {news.impactNote}
                  </div>
                )}

                {/* Quick actions to visit market or properties */}
                <div className="flex items-center gap-2 pt-1">
                  {news.targetStockIds && news.targetStockIds.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveTab('market');
                        onClose();
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg border border-indigo-800/40 cursor-pointer transition"
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span>Check Stocks</span>
                    </button>
                  )}

                  {news.targetNeighborhoods && news.targetNeighborhoods.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveTab('properties');
                        onClose();
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 px-2.5 py-1 rounded-lg border border-emerald-800/40 cursor-pointer transition"
                    >
                      <Building2 className="w-3 h-3" />
                      <span>View Properties</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
