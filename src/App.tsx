import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { MainMenuView } from './components/menu/MainMenuView';
import { HeaderDashboard } from './components/common/HeaderDashboard';
import { BottomNavigation } from './components/common/BottomNavigation';
import { PWABanner } from './components/pwa/PWABanner';
import { RestModal } from './components/modals/RestModal';
import { NewsModal } from './components/modals/NewsModal';
import { EventModal } from './components/modals/EventModal';
import { TutorialModal } from './components/modals/TutorialModal';
import { HustleView } from './components/hustle/HustleView';
import { PropertiesView } from './components/properties/PropertiesView';
import { FinanceView } from './components/finance/FinanceView';
import { MarketView } from './components/market/MarketView';
import { SelfView } from './components/self/SelfView';

const MainAppContent: React.FC = () => {
  const { activeTab } = useGame();
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex justify-center selection:bg-indigo-500 selection:text-white">
      {/* Mobile-constrained responsive wrapper */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl min-h-screen flex flex-col bg-slate-950 shadow-2xl relative">
        {/* PWA Android & iOS Install / Offline Banner */}
        <PWABanner />

        {/* Sticky Dashboard Header */}
        <HeaderDashboard
          onOpenRest={() => setIsRestModalOpen(true)}
          onOpenNews={() => setIsNewsModalOpen(true)}
        />

        {/* Interactive Main View Port */}
        <main className="flex-1 px-3.5 pt-3">
          {activeTab === 'hustle' && <HustleView />}
          {activeTab === 'properties' && <PropertiesView />}
          {activeTab === 'finance' && <FinanceView />}
          {activeTab === 'market' && <MarketView />}
          {activeTab === 'self' && <SelfView />}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNavigation />

        {/* Modals & Overlays */}
        <RestModal
          isOpen={isRestModalOpen}
          onClose={() => setIsRestModalOpen(false)}
        />
        <NewsModal
          isOpen={isNewsModalOpen}
          onClose={() => setIsNewsModalOpen(false)}
        />
        <EventModal />
        <TutorialModal />
      </div>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { activeSlotId } = useGame();

  if (activeSlotId === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex justify-center selection:bg-indigo-500 selection:text-white">
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl min-h-screen flex flex-col bg-slate-950 shadow-2xl relative">
          <PWABanner />
          <MainMenuView />
        </div>
      </div>
    );
  }

  return <MainAppContent />;
};

export default function App() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  );
}

