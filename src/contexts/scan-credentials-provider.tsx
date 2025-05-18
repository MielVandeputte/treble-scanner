import { JSX, ReactNode, useCallback, useMemo, useState } from 'react';
import store from 'store2';

import { ScanCredentialsContext } from './scan-credentials-context.tsx';
import { ScanCredentials } from '../types/scan-credentials.ts';

const SCAN_CREDENTIALS_STORE_KEY = 'SCAN_CREDENTIALS';

export function ScanCredentialsProvider({ children }: { children: ReactNode }): JSX.Element {
  const [scanCredentials, setScanCredentials] = useState<ScanCredentials | null>(
    store.get(SCAN_CREDENTIALS_STORE_KEY) ?? null,
  );

  const setScanCredentialsAndSaveToStore = useCallback((scanCredentials: ScanCredentials | null): void => {
    if (scanCredentials === null) {
      store.clearAll();
      location.reload();
    } else {
      setScanCredentials(scanCredentials);
      store.set(SCAN_CREDENTIALS_STORE_KEY, scanCredentials);
    }
  }, []);

  const contextValue = useMemo(
    () => ({ scanCredentials, setScanCredentials: setScanCredentialsAndSaveToStore }),
    [scanCredentials, setScanCredentialsAndSaveToStore],
  );

  return <ScanCredentialsContext.Provider value={contextValue}>{children}</ScanCredentialsContext.Provider>;
}
