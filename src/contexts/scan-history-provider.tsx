import { JSX, ReactNode, useCallback, useMemo, useState } from 'react';
import store from 'store2';

import { ScanHistoryContext } from './scan-history-context.tsx';
import { ScanAttempt } from '../types/scan-attempt.type.ts';

type SerializedScanAttempt = ScanAttempt & {
  timestamp: string;
};

const SCAN_HISTORY_STORE_KEY = 'SCAN_HISTORY';

function sort(scanHistory: ScanAttempt[]): ScanAttempt[] {
  return scanHistory.toSorted((firstScanAttempt, secondScanAttempt) => {
    return secondScanAttempt.timestamp.getTime() - firstScanAttempt.timestamp.getTime();
  });
}

function serialize(scanHistory: ScanAttempt[]): SerializedScanAttempt[] {
  return scanHistory.map(scanAttempt => {
    return {
      ...scanAttempt,
      timestamp: scanAttempt.timestamp.toISOString(),
    } as SerializedScanAttempt;
  });
}

function deserialize(serializedScanHistory: SerializedScanAttempt[]): ScanAttempt[] {
  return serializedScanHistory.map(serializedScanAttempt => {
    return {
      ...serializedScanAttempt,
      timestamp: new Date(serializedScanAttempt.timestamp),
    };
  });
}

export function ScanHistoryProvider({ children }: { children: ReactNode }): JSX.Element {
  const [scanHistory, setScanHistory] = useState<ScanAttempt[]>(
    sort(deserialize(store.get(SCAN_HISTORY_STORE_KEY) ?? [])),
  );

  const addScanAttempt = useCallback((scanAttempt: ScanAttempt): void => {
    setScanHistory(prevState => {
      const newState = sort([...prevState, scanAttempt]);
      store.set(SCAN_HISTORY_STORE_KEY, serialize(newState));
      return newState;
    });
  }, []);

  const contextValue = useMemo(() => ({ scanHistory, addScanAttempt }), [scanHistory, addScanAttempt]);

  return <ScanHistoryContext.Provider value={contextValue}>{children}</ScanHistoryContext.Provider>;
}
