import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ArrowDown, Sparkles } from 'lucide-react';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';

interface PullToRefreshProps {
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  const { checkForUpdates, needRefresh, updateApp } = usePWAUpdate();
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusText, setStatusText] = useState('Pull down to refresh');
  
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const PULL_THRESHOLD = 75;
  const MAX_PULL = 110;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only initiate pull-to-refresh if user is at the very top of the page
      if (window.scrollY <= 2 && !isRefreshing) {
        startYRef.current = e.touches[0].clientY;
        isPullingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      if (diff > 0 && window.scrollY <= 2) {
        // Damping factor for smooth spring feel
        const clampedPull = Math.min(MAX_PULL, diff * 0.45);
        setPullY(clampedPull);

        if (clampedPull >= PULL_THRESHOLD * 0.45) {
          setStatusText('Release to check for updates & reload');
        } else {
          setStatusText('Pull down to refresh');
        }
      } else {
        setPullY(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;

      if (pullY >= PULL_THRESHOLD * 0.45 && !isRefreshing) {
        setIsRefreshing(true);
        setStatusText('Checking for updates...');
        setPullY(50); // Keep indicator visible while checking

        try {
          if (needRefresh) {
            await updateApp();
          } else {
            const result = await checkForUpdates(true);
            setStatusText(result.message);
          }
        } catch {
          window.location.reload();
        } finally {
          setTimeout(() => {
            setIsRefreshing(false);
            setPullY(0);
          }, 600);
        }
      } else {
        setPullY(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullY, isRefreshing, needRefresh, checkForUpdates, updateApp]);

  return (
    <div className="relative w-full">
      {/* Visual Pull to Refresh Header indicator */}
      {(pullY > 0 || isRefreshing) && (
        <div
          style={{ height: `${pullY}px` }}
          className="overflow-hidden flex items-center justify-center transition-all duration-100 ease-out z-30"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 shadow-lg text-slate-200 text-xs font-semibold backdrop-blur-md">
            {isRefreshing ? (
              <RotateCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            ) : pullY >= PULL_THRESHOLD * 0.45 ? (
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <ArrowDown
                className="w-3.5 h-3.5 text-slate-400 transition-transform duration-150"
                style={{
                  transform: `rotate(${Math.min(180, (pullY / (PULL_THRESHOLD * 0.45)) * 180)}deg)`,
                }}
              />
            )}
            <span className="text-[11px] font-medium">{statusText}</span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
