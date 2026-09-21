import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { MainMenuView } from './components/menu/MainMenuView';
import { HeaderDashboard } from './components/common/HeaderDashboard';
import { BottomNavigation } from './components/common/BottomNavigation';
import { PWABanner } from './components/pwa/PWABanner';
import { RestModal } from './components/modals/RestModal';
import { EventModal } from './components/modals/EventModal';
import { TutorialModal } from './components/modals/TutorialModal';
import { PremiumStoreModal } from './components/modals/PremiumStoreModal';
import { DailySummaryModal } from './components/modals/DailySummaryModal';
import { HustleView } from './components/hustle/HustleView';
import { PropertiesView } from './components/properties/PropertiesView';
import { MarketView } from './components/market/MarketView';
import { FinanceView } from './components/finance/FinanceView';
import { SelfView } from './components/self/SelfView';
import { PhoneView } from './components/phone/PhoneView';
import { PullToRefresh } from './components/pwa/PullToRefresh';

const MainAppContent: React.FC = () => {
  const { activeTab, isStoreModalOpen, setIsStoreModalOpen, isPhoneOpen, setIsPhoneOpen } = useGame();
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 font-sans flex justify-center selection:bg-blue-600 selection:text-white">
      {/* Mobile-constrained responsive wrapper */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl min-h-screen flex flex-col bg-black shadow-2xl relative">
        <PullToRefresh>
          {/* PWA Android & iOS Install / Offline Banner */}
          <PWABanner />

          {/* Sticky Dashboard Header */}
          <HeaderDashboard
            onOpenRest={() => setIsRestModalOpen(true)}
          />

          {/* Interactive Main View Port */}
          <main className="flex-1 px-3.5 pt-3">
            {activeTab === 'hustle' && <HustleView />}
            {activeTab === 'properties' && <PropertiesView />}
            {activeTab === 'finance' && <FinanceView />}
            {activeTab === 'market' && <MarketView />}
            {activeTab === 'self' && <SelfView />}
          </main>
        </PullToRefresh>

        {/* Fixed Bottom Navigation */}
        <BottomNavigation />

        {/* Modals & Overlays */}
        <RestModal
          isOpen={isRestModalOpen}
          onClose={() => setIsRestModalOpen(false)}
        />
        <PremiumStoreModal
          isOpen={isStoreModalOpen}
          onClose={() => setIsStoreModalOpen(false)}
        />
        <DailySummaryModal />
        <EventModal />
        <TutorialModal />
        <PhoneView />
      </div>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { activeSlotId } = useGame();

  if (activeSlotId === null) {
    return (
      <div className="min-h-screen bg-[#070709] text-slate-100 font-sans flex justify-center selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl min-h-screen flex flex-col bg-black shadow-2xl relative">
          <PullToRefresh>
            <PWABanner />
            <MainMenuView />
          </PullToRefresh>
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

