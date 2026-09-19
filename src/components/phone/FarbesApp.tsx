import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Search,
  TrendingUp,
  Globe,
  Award,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  Building2,
  Car,
  Plane,
  Anchor,
  X,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import {
  FARBES_TOP_100,
  getFarbesListWithPlayer,
  FarbesBillionaire,
} from '../../constants/farbesData';

interface FarbesAppProps {
  onBack: () => void;
}

export const FarbesApp: React.FC<FarbesAppProps> = ({ onBack }) => {
  const { player, netWorth } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedProfile, setSelectedProfile] = useState<FarbesBillionaire | null>(null);

  const industries = ['All', 'Technology', 'Real Estate', 'Finance & Investments', 'Luxury & Fashion', 'Automotive', 'Energy'];

  // Generate full 100 rankings with player merged dynamically
  const rankedList = useMemo(() => {
    return getFarbesListWithPlayer(player.name, netWorth);
  }, [player.name, netWorth]);

  // Find player's position
  const playerEntry = useMemo(() => {
    return rankedList.find((b) => b.isPlayer);
  }, [rankedList]);

  // Filtered list
  const filteredList = useMemo(() => {
    return rankedList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry =
        selectedIndustry === 'All' || item.industry.toLowerCase().includes(selectedIndustry.toLowerCase());
      return matchesSearch && matchesIndustry;
    });
  }, [rankedList, searchQuery, selectedIndustry]);

  const formatWealth = (val: number) => {
    if (val >= 1_000_000_000_000) {
      return `$${(val / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (val >= 1_000_000_000) {
      return `$${(val / 1_000_000_000).toFixed(1)}B`;
    }
    if (val >= 1_000_000) {
      return `$${(val / 1_000_000).toFixed(1)}M`;
    }
    return `$${val.toLocaleString()}`;
  };

  const cutoff = 300_000_000;
  const isPlayerOnList = Boolean(playerEntry);
  const distanceToCutoff = Math.max(0, cutoff - netWorth);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Farbes Masthead Header */}
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-950 to-slate-950 border-b border-amber-500/20 px-4 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif tracking-widest text-xl font-black text-amber-400">FARBES</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
              RICHEST 100
            </span>
          </div>
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 transition"
          >
            Done
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 font-serif italic">
          The Definitive Real-Time Wealth Index of Global Titans
        </p>
      </div>

      {/* Player Standing Card */}
      <div className="px-3 pt-2.5 pb-1 shrink-0">
        <div
          className={`rounded-2xl p-3 border transition ${
            isPlayerOnList
              ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-amber-500/50 shadow-lg'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
                  isPlayerOnList
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isPlayerOnList ? `#${playerEntry?.rank}` : '100+'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">{player.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    YOU
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-400">
                  Net Worth: {formatWealth(netWorth)}
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              {isPlayerOnList ? (
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>TOP 100 TITAN</span>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] text-slate-400 block">Gap to Top 100</span>
                  <span className="text-rose-400 font-bold">+{formatWealth(distanceToCutoff)}</span>
                </div>
              )}
            </div>
          </div>

          {!isPlayerOnList && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Cutoff (#100): <strong className="text-slate-200">$300,000,000</strong></span>
              <span className="text-amber-400/90 font-medium">Acquire businesses, real estate & luxury assets to climb</span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Industry Filters */}
      <div className="px-3 py-1.5 shrink-0 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search billionaires, companies, countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Industry Pill Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                selectedIndustry === ind
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Billionaire Rankings List */}
      <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1.5 no-scrollbar">
        {filteredList.map((titan) => {
          const isPlayer = titan.isPlayer;
          const isTop3 = titan.rank <= 3;

          return (
            <div
              key={`${titan.rank}-${titan.name}`}
              onClick={() => setSelectedProfile(titan)}
              className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                isPlayer
                  ? 'bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-slate-900 border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                  : isTop3
                  ? 'bg-gradient-to-r from-slate-900 to-slate-950 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    titan.rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : titan.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : titan.rank === 3
                      ? 'bg-amber-700 text-amber-100'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  #{titan.rank}
                </div>

                {/* Avatar Icon / Flag */}
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-sm shrink-0">
                  {titan.avatarEmoji || '👑'}
                </div>

                {/* Name & Source */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-semibold text-xs truncate ${
                        isPlayer ? 'text-amber-300 font-bold' : 'text-slate-100'
                      }`}
                    >
                      {titan.name}
                    </span>
                    {isPlayer && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                        YOU
                      </span>
                    )}
                    {titan.rank === 1 && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        #1 TITAN
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {titan.source} • <span className="text-slate-500">{titan.country}</span>
                  </div>
                </div>
              </div>

              {/* Wealth & Chevron */}
              <div className="text-right shrink-0 pl-2">
                <div className="text-xs font-bold text-emerald-400">
                  {formatWealth(titan.netWorth)}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                  <span>{titan.industry}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-xs">
            No billionaires match your filter.
          </div>
        )}
      </div>

      {/* Billionaire Detail Profile Modal */}
      {selectedProfile && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-sm p-4 text-slate-100 shadow-2xl relative animate-in slide-in-from-bottom-4">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-amber-500/40 flex items-center justify-center text-2xl">
                {selectedProfile.flag || '👑'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-white">{selectedProfile.name}</span>
                  <span className="text-xs font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                    #{selectedProfile.rank}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{selectedProfile.country} • {selectedProfile.industry}</div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Confirmed Net Worth</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {formatWealth(selectedProfile.netWorth)}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                <strong>Primary Enterprise:</strong> {selectedProfile.wealthSource}
              </div>
            </div>

            {selectedProfile.bio && (
              <p className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                "{selectedProfile.bio}"
              </p>
            )}

            <button
              onClick={() => setSelectedProfile(null)}
              className="mt-3 w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
