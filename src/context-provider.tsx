import { createContext, ReactNode, useEffect, useState } from 'react';
import store from 'store2';
import { ScannerCredentials, TicketScanAttempt } from './types.ts';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const ScannerCredentialsContext = createContext({
    scannerCredentials: null as ScannerCredentials | null,
    setScannerCredentials: (_scannerCredentials: ScannerCredentials | null): void => {},
});

export const TicketScanAttemptHistoryContext = createContext({
    ticketScanAttemptHistory: [] as TicketScanAttempt[],
    addTicketScanAttemptToHistory: (_ticketScanAttempt: TicketScanAttempt): void => {},
    clearTicketScanAttemptHistory: (): void => {},
});
/* eslint-enable @typescript-eslint/no-unused-vars */

export const InternetConnectedContext = createContext(true);

function sortTicketScanAttemptHistoryByTimestamp(ticketScanAttemptHistory: TicketScanAttempt[]): TicketScanAttempt[] {
    return ticketScanAttemptHistory.sort((firstScanAttempt, secondScanAttempt) => {
        return secondScanAttempt.timestamp.getTime() - firstScanAttempt.timestamp.getTime();
    });
}

function deserializeTicketScanAttemptHistory(serializedTicketScanAttemptHistory: { result: string, secretCode: string, timestamp: string, ownerName: string, ownerEmail: string, ticketTypeId: number, ticketTypeName:string }[] ): TicketScanAttempt[] {
    return serializedTicketScanAttemptHistory.map((serializedTicket) => {
        return {
            ...serializedTicket,
            timestamp: new Date(serializedTicket.timestamp),
        };
    });
}

export function ContextProvider(props: Readonly<{ children: ReactNode }>) {
    const [scannerCredentialsState, setScannerCredentialsState] = useState<ScannerCredentials | null>(store.get('scannerCredentials'));
    const [ticketScanAttemptHistoryState, setTicketScanAttemptHistoryState] = useState<TicketScanAttempt[]>([]);
    const [internetConnectedState, setInternetConnectedState] = useState<boolean>(navigator.onLine);

    useEffect(() => {
        window.addEventListener('online', refreshInternetConnectedState);
        window.addEventListener('offline', refreshInternetConnectedState);

        const serializedTicketScanAttemptHistory = store.get('ticketScanAttemptHistory');

        if (serializedTicketScanAttemptHistory) {
            const ticketScanAttemptHistory = deserializeTicketScanAttemptHistory(serializedTicketScanAttemptHistory);
            setTicketScanAttemptHistoryState(ticketScanAttemptHistory);
        }

        return () => {
            window.removeEventListener('online', refreshInternetConnectedState);
            window.removeEventListener('offline', refreshInternetConnectedState);
        };
    }, []);

    useEffect(() => {
        store.set('scannerCredentials', scannerCredentialsState);
    }, [scannerCredentialsState]);

    function refreshInternetConnectedState() {
        setInternetConnectedState(navigator.onLine);
    }

    function addTicketScanAttemptToHistory(ticketScanAttempt: TicketScanAttempt): void {
        setTicketScanAttemptHistoryState((prevHistory) => {
            const ticketScanAttemptHistory = sortTicketScanAttemptHistoryByTimestamp([...prevHistory, ticketScanAttempt])
            store.set('ticketScanAttemptHistory', ticketScanAttemptHistory);
            return ticketScanAttemptHistory;
        });
    }

    function clearTicketHistory(): void {
        setTicketScanAttemptHistoryState([]);
        store.set('ticketScanAttemptHistory', []);
    }

    return (
        <InternetConnectedContext.Provider value={internetConnectedState}>
            <ScannerCredentialsContext.Provider value={{ scannerCredentials: scannerCredentialsState, setScannerCredentials: setScannerCredentialsState }}>
                <TicketScanAttemptHistoryContext.Provider value={{ ticketScanAttemptHistory: ticketScanAttemptHistoryState, addTicketScanAttemptToHistory: addTicketScanAttemptToHistory, clearTicketScanAttemptHistory: clearTicketHistory }}>
                    {props.children}
                </TicketScanAttemptHistoryContext.Provider>
            </ScannerCredentialsContext.Provider>
        </InternetConnectedContext.Provider>
    );
}
