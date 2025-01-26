import { useState, useEffect, useCallback } from 'react';

export function useWakeLock(): {
  isScreenActiveEnabled: boolean;
  error: string | null;
} {
  const [isScreenActiveEnabled, setIsScreenActiveEnabled] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enableKeepScreenActive = useCallback(async () => {
    if (wakeLock) {
      // Wake lock is already active, no need to request again
      return;
    }

    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setIsScreenActiveEnabled(true);
        setError(null);
        console.log('Screen will stay active');

        lock.addEventListener('release', () => {
          console.log('Screen lock has been released');
          setWakeLock(null);
          setIsScreenActiveEnabled(false);
          // Try to re-acquire the wake lock
          void enableKeepScreenActive();
        });
      } else {
        throw new Error('Wake Lock API is not supported in this browser');
      }
    } catch (err) {
      console.error(`Failed to keep screen active: ${err}`);
      setError(`Kan het scherm niet actief houden: ${err}`);
      setIsScreenActiveEnabled(false);
    }
  }, [wakeLock]);

  useEffect((): (() => void) => {
    void enableKeepScreenActive();

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        void enableKeepScreenActive();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        void wakeLock.release();
      }
    };
  }, [enableKeepScreenActive, wakeLock]);

  return { isScreenActiveEnabled, error };
}
