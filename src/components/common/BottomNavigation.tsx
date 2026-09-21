import React from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Briefcase, 
  Building2, 
  Home, 
  Car, 
  Smartphone 
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, ownedProperties, setIsPhoneOpen } = useGame();

  // Check if any property has unclaimed rent
  const hasUnclaimedRent = ownedProperties.some((p) => p.collectedRentUnclaimed > 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 shadow-2xl max-w-md mx-auto sm:max-w-xl md:max-w-2xl">
      <div className="grid grid-cols-5 gap-1 items-center">
        {/* Tab 1: Ventures & Enterprises */}
        <button
          id="nav-tab-ventures"
          onClick={() => setActiveTab('hustle')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'hustle'
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className={`w-5 h-5 transition-transform ${activeTab === 'hustle' ? 'scale-110 text-[#007AFF]' : ''}`} />
          <span className={`text-[10px] tracking-wide mt-1 whitespace-nowrap ${activeTab === 'hustle' ? 'text-white font-bold' : 'text-slate-400'}`}>
            Ventures
          </span>
        </button>

        {/* Tab 2: Estates & Real Estate */}
        <button
          id="nav-tab-estates"
          onClick={() => setActiveTab('properties')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 relative cursor-pointer ${
            activeTab === 'properties'
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Building2 className={`w-5 h-5 transition-transform ${activeTab === 'properties' ? 'scale-110 text-[#007AFF]' : ''}`} />
            {hasUnclaimedRent && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 whitespace-nowrap ${activeTab === 'properties' ? 'text-white font-bold' : 'text-slate-400'}`}>
            Estates
          </span>
        </button>

        {/* Tab 3: CENTER ELEVATED WHITE BUTTON (Home / Main Screen Matching IMG_6546) */}
        <div className="flex justify-center -mt-6">
          <button
            id="nav-tab-home-center"
            onClick={() => setActiveTab('hustle')}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-black"
            title="Main Dashboard"
          >
            <Home className="w-5 h-5 fill-black stroke-none" />
          </button>
        </div>

        {/* Tab 4: Assets & Transport */}
        <button
          id="nav-tab-assets"
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'market'
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Car className={`w-5 h-5 transition-transform ${activeTab === 'market' ? 'scale-110 text-[#007AFF]' : ''}`} />
          <span className={`text-[10px] tracking-wide mt-1 whitespace-nowrap ${activeTab === 'market' ? 'text-white font-bold' : 'text-slate-400'}`}>
            Assets
          </span>
        </button>

        {/* Tab 5: Smartphone App Launcher */}
        <button
          id="nav-tab-phone"
          onClick={() => setIsPhoneOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 relative cursor-pointer text-slate-400 hover:text-white"
          title="Open Smartphone (Banking, Stocks, Radar, Farbes 100, News, Career)"
        >
          <div className="relative">
            <Smartphone className="w-5 h-5 transition-transform hover:scale-110" />
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-pulse" />
          </div>
          <span className="text-[10px] tracking-wide mt-1 whitespace-nowrap text-slate-400">
            Phone
          </span>
        </button>
      </div>
    </nav>
  );
};
