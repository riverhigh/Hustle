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
import { PremiumStoreModal } from './components/modals/PremiumStoreModal';
import { HustleView } from './components/hustle/HustleView';
import { PropertiesView } from './components/properties/PropertiesView';
import { FinanceView } from './components/finance/FinanceView';
import { MarketView } from './components/market/MarketView';
import { SelfView } from './components/self/SelfView';
import { PhoneView } from './components/phone/PhoneView';
import { PullToRefresh } from './components/pwa/PullToRefresh';
import { Smartphone, Landmark } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, isStoreModalOpen, setIsStoreModalOpen, isPhoneOpen, setIsPhoneOpen, openPhoneApp } = useGame();
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex justify-center selection:bg-indigo-500 selection:text-white">
      {/* Mobile-constrained responsive wrapper */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl min-h-screen flex flex-col bg-slate-950 shadow-2xl relative">
        <PullToRefresh>
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
            {activeTab === 'finance' && (
              <div className="py-8 space-y-4 text-center">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-w-sm mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Landmark className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Vance Mobile Banking</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Personal deposits, checking accounts, loans, and credit lines have moved to your smartphone app!
                    </p>
                  </div>
                  <button
                    onClick={() => openPhoneApp('bank')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Open Mobile Bank App</span>
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'market' && <MarketView />}
            {activeTab === 'self' && <SelfView />}
          </main>
        </PullToRefresh>

        {/* Floating Quick Phone Launcher Button */}
        {!isPhoneOpen && (
          <button
            onClick={() => setIsPhoneOpen(true)}
            className="fixed bottom-20 right-4 sm:right-6 md:right-8 z-40 flex items-center gap-2 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/60 hover:border-indigo-400 text-indigo-200 px-3.5 py-2 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group backdrop-blur-md"
            title="Open Smartphone"
          >
            <Smartphone className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold tracking-wide">Phone</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        )}

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
        <PremiumStoreModal
          isOpen={isStoreModalOpen}
          onClose={() => setIsStoreModalOpen(false)}
        />
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
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex justify-center selection:bg-indigo-500 selection:text-white">
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl min-h-screen flex flex-col bg-slate-950 shadow-2xl relative">
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

