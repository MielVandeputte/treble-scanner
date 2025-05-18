import { createContext } from 'react';

import { ScanAttempt } from '../types/scan-attempt.ts';

export const ScanHistoryContext = createContext<{
  scanHistory: ScanAttempt[] | undefined;
  addScanAttempt: (scanAttempt: ScanAttempt) => void;
}>({
  scanHistory: undefined,
  addScanAttempt: (_: ScanAttempt): void => {},
});
