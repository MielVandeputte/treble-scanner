import { createContext, ReactNode, useEffect, useState } from 'react';
import store from 'store2';
import { ScannerCredentials, TicketScanAttempt, TicketScanAttemptResult } from './types.ts';
import { ArrowsIcon } from './common/icons.tsx';

export const ScannerCredentialsContext = createContext<{
    scannerCredentials: ScannerCredentials | null;
    setScannerCredentials: (scannerCredentials: ScannerCredentials | null) => void;
}>({
    scannerCredentials: null,
    setScannerCredentials: (): void => {},
});

export const TicketScanAttemptHistoryContext = createContext<{
    ticketScanAttemptHistory: TicketScanAttempt[];
    addTicketScanAttemptToHistory: (ticketScanAttempt: TicketScanAttempt) => void;
    clearTicketScanAttemptHistory: () => void;
}>({
    ticketScanAttemptHistory: [],
    addTicketScanAttemptToHistory: (): void => {},
    clearTicketScanAttemptHistory: (): void => {},
});

export const InternetConnectedContext = createContext(true);

export function ContextProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [scannerCredentialsState, setScannerCredentialsState] = useState<ScannerCredentials | null>(
        store.get('scannerCredentials')
    );
    const [ticketScanAttemptHistoryState, setTicketScanAttemptHistoryState] = useState<TicketScanAttempt[]>([]);
    const [internetConnectedState, setInternetConnectedState] = useState<boolean>(navigator.onLine);
    const [portraitOrientationState, setPortraitOrientationState] = useState<boolean>(
        window.screen.orientation.type === 'portrait-primary' || window.screen.orientation.type === 'portrait-secondary'
    );

    useEffect(() => {
        window.addEventListener('online', refreshInternetConnectedState);
        window.addEventListener('offline', refreshInternetConnectedState);
        window.addEventListener('resize', refreshOrientationState);

        const serializedTicketScanAttemptHistory = store.get('ticketScanAttemptHistory');

        if (serializedTicketScanAttemptHistory) {
            const ticketScanAttemptHistory = deserializeTicketScanAttemptHistory(serializedTicketScanAttemptHistory);
            setTicketScanAttemptHistoryState(ticketScanAttemptHistory);
        }

        return () => {
            window.removeEventListener('online', refreshInternetConnectedState);
            window.removeEventListener('offline', refreshInternetConnectedState);
            window.removeEventListener('resize', refreshOrientationState);
        };
    }, []);

    useEffect(() => {
        store.set('scannerCredentials', scannerCredentialsState);
    }, [scannerCredentialsState]);

    function refreshInternetConnectedState(): void {
        setInternetConnectedState(navigator.onLine);
    }

    function refreshOrientationState(): void {
        const orientation = window.screen.orientation.type;
        setPortraitOrientationState(orientation === 'portrait-primary' || orientation === 'portrait-secondary');
    }

    // ScannerCredentialsContext
    function deserializeTicketScanAttemptHistory(
        serializedTicketScanAttemptHistory: {
            id: string;
            result: TicketScanAttemptResult;
            secretCode: string;
            timestamp: string;
            ownerName: string;
            ownerEmail: string;
            ticketTypeName: string;
        }[]
    ): TicketScanAttempt[] {
        return serializedTicketScanAttemptHistory.map((serializedTicket) => {
            return {
                ...serializedTicket,
                timestamp: new Date(serializedTicket.timestamp),
            };
        });
    }

    // TicketScanAttemptHistoryContext
    function addTicketScanAttemptToHistory(ticketScanAttempt: TicketScanAttempt): void {
        setTicketScanAttemptHistoryState((prevHistory) => {
            const ticketScanAttemptHistory = sortTicketScanAttemptHistoryByTimestamp([
                ...prevHistory,
                ticketScanAttempt,
            ]);
            store.set('ticketScanAttemptHistory', ticketScanAttemptHistory);
            return ticketScanAttemptHistory;
        });
    }

    function sortTicketScanAttemptHistoryByTimestamp(
        ticketScanAttemptHistory: TicketScanAttempt[]
    ): TicketScanAttempt[] {
        return ticketScanAttemptHistory.sort((firstScanAttempt, secondScanAttempt) => {
            return secondScanAttempt.timestamp.getTime() - firstScanAttempt.timestamp.getTime();
        });
    }

    function clearTicketHistory(): void {
        setTicketScanAttemptHistoryState([]);
        store.set('ticketScanAttemptHistory', []);
    }

    return (
        <>
            {portraitOrientationState ? (
                <InternetConnectedContext.Provider value={internetConnectedState}>
                    <ScannerCredentialsContext.Provider
                        value={{
                            scannerCredentials: scannerCredentialsState,
                            setScannerCredentials: setScannerCredentialsState,
                        }}
                    >
                        <TicketScanAttemptHistoryContext.Provider
                            value={{
                                ticketScanAttemptHistory: ticketScanAttemptHistoryState,
                                addTicketScanAttemptToHistory: addTicketScanAttemptToHistory,
                                clearTicketScanAttemptHistory: clearTicketHistory,
                            }}
                        >
                            {children}
                        </TicketScanAttemptHistoryContext.Provider>
                    </ScannerCredentialsContext.Provider>
                </InternetConnectedContext.Provider>
            ) : (
                <div className="w-screen h-dvh flex flex-col justify-center items-center select-none text-zinc-400 gap-2">
                    <ArrowsIcon />
                    <h1 className="font-semibold text-center">Draai je apparaat</h1>
                </div>
            )}
        </>
    );
}
