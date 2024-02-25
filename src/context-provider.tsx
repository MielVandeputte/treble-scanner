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

export const InternetConnectedContext = createContext(true);
/* eslint-enable @typescript-eslint/no-unused-vars */

function sortTicketScanAttemptHistoryByTimestamp(ticketScanAttemptHistory: TicketScanAttempt[]): TicketScanAttempt[] {
    return ticketScanAttemptHistory.sort((firstScanAttempt, secondScanAttempt) => {
        return secondScanAttempt.timestamp.getTime() - firstScanAttempt.timestamp.getTime();
    });
}

function deserializeTicketScanAttemptHistory(
    serializedTicketScanAttemptHistory: {
        result: string;
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

export function ContextProvider(props: Readonly<{ children: ReactNode }>) {
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
        };
    }, []);

    useEffect(() => {
        store.set('scannerCredentials', scannerCredentialsState);
    }, [scannerCredentialsState]);

    function refreshInternetConnectedState() {
        setInternetConnectedState(navigator.onLine);
    }

    function refreshOrientationState(): void {
        setPortraitOrientationState(
            window.screen.orientation.type === 'portrait-primary' ||
                window.screen.orientation.type === 'portrait-secondary'
        );
    }

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
                            {props.children}
                        </TicketScanAttemptHistoryContext.Provider>
                    </ScannerCredentialsContext.Provider>
                </InternetConnectedContext.Provider>
            ) : (
                <div className="w-screen h-dvh flex justify-center items-center flex-col transition duration-200 select-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#999999"
                        className="w-6 h-6 mb-6 mx-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                    </svg>
                    <h1 className="font-semibold text-center text-zinc-400">Draai je apparaat</h1>
                </div>
            )}
        </>
    );
}
