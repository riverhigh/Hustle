import React from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Briefcase, 
  Building2, 
  Smartphone, 
  Car, 
  User 
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, ownedProperties, dailyMissions, setIsPhoneOpen } = useGame();

  // Check if any daily mission is unclaimed
  const hasUnclaimedMissions = dailyMissions.some((m) => m.completed && !m.claimed);
  // Check if any property has unclaimed rent
  const hasUnclaimedRent = ownedProperties.some((p) => p.collectedRentUnclaimed > 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl max-w-md mx-auto sm:max-w-xl md:max-w-2xl">
      <div className="grid grid-cols-5 gap-1 items-center">
        {/* Tab 1: Ventures & Education */}
        <button
          onClick={() => setActiveTab('hustle')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'hustle'
              ? 'text-emerald-400 bg-slate-800/90 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Briefcase className={`w-5 h-5 transition-transform ${activeTab === 'hustle' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-wider mt-1 whitespace-nowrap">VENTURES</span>
        </button>

        {/* Tab 2: Properties */}
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative cursor-pointer ${
            activeTab === 'properties'
              ? 'text-emerald-400 bg-slate-800/90 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <div className="relative">
            <Building2 className={`w-5 h-5 transition-transform ${activeTab === 'properties' ? 'scale-110' : ''}`} />
            {hasUnclaimedRent && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-wider mt-1 whitespace-nowrap">ESTATES</span>
        </button>

        {/* Tab 3: SMARTPHONE (Center Feature) */}
        <button
          onClick={() => setIsPhoneOpen(true)}
          className="flex flex-col items-center justify-center py-0.5 px-1 rounded-xl transition-all duration-200 cursor-pointer -mt-2 group relative"
          title="Open Smartphone (Finance, Jobs, Stocks, Radar, Auctions, Farbes 100)"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 border border-indigo-300/40 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white group-hover:scale-110 group-active:scale-95 transition-all">
            <Smartphone className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-wider mt-0.5 text-indigo-300 group-hover:text-white transition whitespace-nowrap">PHONE</span>
        </button>

        {/* Tab 4: Assets & Transport */}
        <button
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'market'
              ? 'text-emerald-400 bg-slate-800/90 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Car className={`w-5 h-5 transition-transform ${activeTab === 'market' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-wider mt-1 whitespace-nowrap">ASSETS</span>
        </button>

        {/* Tab 5: Self & Lifestyle */}
        <button
          onClick={() => setActiveTab('self')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative cursor-pointer ${
            activeTab === 'self'
              ? 'text-emerald-400 bg-slate-800/90 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 transition-transform ${activeTab === 'self' ? 'scale-110' : ''}`} />
            {hasUnclaimedMissions && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-wider mt-1 whitespace-nowrap">SELF</span>
        </button>
      </div>
    </nav>
  );
};
