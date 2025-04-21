import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  globalThis.addEventListener('online', callback);
  globalThis.addEventListener('offline', callback);

  return () => {
    globalThis.removeEventListener('online', callback);
    globalThis.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore<boolean>(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
