import { useState, useEffect, useCallback } from 'react';
import { registerSW } from 'virtual:pwa-register';

export interface PWAUpdateState {
  needRefresh: boolean;
  offlineReady: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  updateApp: () => Promise<void>;
  checkForUpdates: (forceReloadIfNone?: boolean) => Promise<{ updated: boolean; message: string }>;
  hardRefresh: () => Promise<void>;
}

export function usePWAUpdate(): PWAUpdateState {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [updateFunction, setUpdateFunction] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Register service worker with update handlers
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('[PWA] New content available; need refresh.');
        setNeedRefresh(true);
      },
      onOfflineReady() {
        console.log('[PWA] App is ready to work offline.');
        setOfflineReady(true);
      },
      onRegisteredSW(swUrl, registration) {
        console.log('[PWA] Service worker registered at:', swUrl);
        if (registration) {
          setSwRegistration(registration);

          // Check for updates periodically (every 60 seconds while online)
          const intervalId = window.setInterval(() => {
            if (navigator.onLine) {
              registration.update().catch((err) => {
                console.warn('[PWA] Auto update check failed:', err);
              });
            }
          }, 60 * 1000);

          return () => {
            window.clearInterval(intervalId);
          };
        }
      },
      onRegisterError(error) {
        console.warn('[PWA] Service worker registration error:', error);
      },
    });

    setUpdateFunction(() => updateSW);

    // Also check for updates when user returns to the app (visibility change or focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine && swRegistration) {
        swRegistration.update().catch(() => {});
      }
    };

    const handleFocus = () => {
      if (navigator.onLine && swRegistration) {
        swRegistration.update().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [swRegistration]);

  // Activate new service worker and reload page
  const updateApp = useCallback(async () => {
    try {
      if (updateFunction) {
        await updateFunction(true);
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.warn('[PWA] updateApp error, fallback to reload:', e);
      window.location.reload();
    }
  }, [updateFunction]);

  // Manually check for updates
  const checkForUpdates = useCallback(async (forceReloadIfNone = false): Promise<{ updated: boolean; message: string }> => {
    setIsChecking(true);
    setLastChecked(new Date());

    try {
      if ('serviceWorker' in navigator) {
        const registration = swRegistration || (await navigator.serviceWorker.getRegistration());
        if (registration) {
          await registration.update();

          // If there's an installing or waiting worker, an update is ready!
          if (registration.waiting) {
            setNeedRefresh(true);
            setIsChecking(false);
            return { updated: true, message: 'New update downloaded! Ready to reload.' };
          }

          if (registration.installing) {
            registration.installing.addEventListener('statechange', (e: Event) => {
              const target = e.target as ServiceWorker;
              if (target && target.state === 'installed') {
                setNeedRefresh(true);
              }
            });
            setIsChecking(false);
            return { updated: true, message: 'Downloading new update in background...' };
          }
        }
      }

      // If no service worker update was pending, but user tapped manual refresh
      if (forceReloadIfNone) {
        setTimeout(() => {
          window.location.reload();
        }, 400);
        return { updated: false, message: 'Refreshing game...' };
      }

      setIsChecking(false);
      return { updated: false, message: 'You are on the latest version!' };
    } catch (err) {
      console.warn('[PWA] Manual update check error:', err);
      setIsChecking(false);
      if (forceReloadIfNone) {
        window.location.reload();
      }
      return { updated: false, message: 'Could not connect. Playing offline/cached.' };
    }
  }, [swRegistration]);

  // Hard refresh: clean stale caches (leaving localStorage saves safe) and reload
  const hardRefresh = useCallback(async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }
    } catch (e) {
      console.warn('[PWA] Hard refresh cache clear warning:', e);
    } finally {
      window.location.reload();
    }
  }, []);

  return {
    needRefresh,
    offlineReady,
    isChecking,
    lastChecked,
    updateApp,
    checkForUpdates,
    hardRefresh,
  };
}
