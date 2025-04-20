import { useEffect, useState } from 'react';

export function useOnlineStatus(): boolean {
  const [onlineStatusState, setOnlineStatusState] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    function refreshOnlineStatusState(): void {
      setOnlineStatusState(navigator.onLine);
    }

    globalThis.addEventListener('online', refreshOnlineStatusState);
    globalThis.addEventListener('offline', refreshOnlineStatusState);

    return () => {
      globalThis.removeEventListener('online', refreshOnlineStatusState);
      globalThis.removeEventListener('offline', refreshOnlineStatusState);
    };
  }, []);

  return onlineStatusState;
}
