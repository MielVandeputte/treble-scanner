import { createContext } from 'react';

import { ScanCredentials } from '../types/scan-credentials.type.ts';

export const ScanCredentialsContext = createContext<{
  scanCredentials: ScanCredentials | undefined | null;
  setScanCredentials: (scanCredentials: ScanCredentials | null) => void;
}>({
  scanCredentials: undefined,
  setScanCredentials: (_: ScanCredentials | null): void => {},
});
