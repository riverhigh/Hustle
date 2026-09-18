import React, { useState } from 'react';
import { 
  Download, 
  Share, 
  X, 
  Smartphone, 
  WifiOff, 
  RotateCw, 
  Sparkles, 
  RefreshCw,
  Info
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../../hooks/usePWAInstall';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';
import { IOSInstallModal } from './IOSInstallModal';
import { PWAUpdateModal } from './PWAUpdateModal';

interface PWABannerProps {
  forceShow?: boolean;
}

export const PWABanner: React.FC<PWABannerProps> = ({ forceShow = false }) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isDismissed,
    install,
    dismissBanner,
  } = usePWAInstall();

  const { needRefresh, updateApp } = usePWAUpdate();
  const isOnline = useOnlineStatus();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await updateApp();
  };

  return (
    <>
      {/* Offline Status Bar */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-white text-[11px] px-3 py-1.5 flex items-center justify-center gap-1.5 font-bold shadow-md sticky top-0 z-50 animate-in fade-in">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode Active — Game progress is saving locally</span>
        </div>
      )}

      {/* NEW UPDATE READY BANNER (High Priority, Shows even in Standalone Mode!) */}
      {needRefresh && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white px-3 py-2 shadow-xl sticky top-0 z-50 border-b border-emerald-400/40 animate-in slide-in-from-top duration-300">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-2.5 w-2.5 shrink-0 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <div className="min-w-0">
                <div className="text-xs font-black tracking-tight flex items-center gap-1 truncate">
                  <span>New Update Ready!</span>
                  <span className="text-[10px] font-normal text-emerald-100 hidden sm:inline">(No re-download needed)</span>
                </div>
                <p className="text-[10px] text-emerald-100/90 truncate">
                  Tap to apply latest features & fixes immediately
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                disabled={isUpdating}
                onClick={handleUpdate}
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-emerald-50 active:scale-95 text-slate-900 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                <RotateCw className={`w-3 h-3 text-emerald-600 ${isUpdating ? 'animate-spin' : ''}`} />
                <span>{isUpdating ? 'Updating...' : 'Update & Reload'}</span>
              </button>

              <button
                onClick={() => setShowUpdateModal(true)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Update details"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main PWA Installation Banner (for non-installed users) */}
      {!isInstalled && (!isDismissed || forceShow) && (
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-indigo-500/30 px-3 py-2 text-left shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
            {/* App Icon + Pitch */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/apple-touch-icon.png"
                  alt="App Icon"
                  className="w-9 h-9 rounded-xl shadow border border-indigo-500/40 object-cover"
                />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-tight truncate">
                    {isIOS ? 'Install on iPhone / iPad' : 'Install Hustle & Empire'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-extrabold uppercase tracking-wide border border-indigo-500/30">
                    {isIOS ? 'iOS PWA' : isAndroid ? 'Android' : 'App'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  {isIOS
                    ? 'Add to Home Screen for full screen & instant play'
                    : 'Fast native launch, full screen & offline support'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {isIOS ? (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-[11px] transition shadow cursor-pointer"
                >
                  <Share className="w-3 h-3 text-indigo-200" />
                  <span>Install</span>
                </button>
              ) : isInstallable ? (
                <button
                  onClick={install}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-[11px] transition shadow cursor-pointer"
                >
                  <Download className="w-3 h-3 text-emerald-100" />
                  <span>Install</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-[11px] transition shadow cursor-pointer"
                >
                  <Smartphone className="w-3 h-3 text-indigo-200" />
                  <span>Get App</span>
                </button>
              )}

              {/* Dismiss button */}
              <button
                onClick={dismissBanner}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                aria-label="Dismiss banner"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
      <PWAUpdateModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
    </>
  );
};
