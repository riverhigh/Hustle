import React from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Briefcase, 
  Building2, 
  Landmark, 
  TrendingUp, 
  User 
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, ownedProperties, dailyMissions } = useGame();

  // Check if any daily mission is unclaimed
  const hasUnclaimedMissions = dailyMissions.some((m) => m.completed && !m.claimed);
  // Check if any property has unclaimed rent
  const hasUnclaimedRent = ownedProperties.some((p) => p.collectedRentUnclaimed > 0);

  const navItems = [
    {
      id: 'hustle' as const,
      label: 'HUSTLE',
      icon: Briefcase,
      badge: false,
    },
    {
      id: 'properties' as const,
      label: 'PROPERTIES',
      icon: Building2,
      badge: hasUnclaimedRent,
    },
    {
      id: 'finance' as const,
      label: 'FINANCE',
      icon: Landmark,
      badge: false,
    },
    {
      id: 'market' as const,
      label: 'MARKET',
      icon: TrendingUp,
      badge: false,
    },
    {
      id: 'self' as const,
      label: 'SELF',
      icon: User,
      badge: hasUnclaimedMissions,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl max-w-md mx-auto sm:max-w-xl md:max-w-2xl">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative cursor-pointer ${
                isActive
                  ? 'text-emerald-400 bg-slate-800/90 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-wider mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
