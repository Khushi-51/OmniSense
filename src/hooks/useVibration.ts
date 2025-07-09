import { useCallback } from 'react';

export const useVibration = () => {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (isSupported) {
      navigator.vibrate(pattern);
    }
  }, [isSupported]);

  const vibrateSuccess = useCallback(() => {
    vibrate([100, 50, 100]);
  }, [vibrate]);

  const vibrateError = useCallback(() => {
    vibrate([200, 100, 200, 100, 200]);
  }, [vibrate]);

  const vibrateFound = useCallback(() => {
    vibrate([50, 50, 50]);
  }, [vibrate]);

  return {
    vibrate,
    vibrateSuccess,
    vibrateError,
    vibrateFound,
    isSupported
  };
};