import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Scanner from './scanner';
import Menu from './menu';
import Landing from './landing';
import { createContext, useEffect, useState } from 'react';
import store from 'store2';
import ManualAdd from './manual-add';

export type Ticket = {
    timestamp: Date;

    qr: string;
    code: string;

    ownerName: string;
    ownerEmail: string;

    ticketTypeId: number;
    ticketTypeName: string;
};

export type ScanSession = {
    eventId: string;
    scanAuthorizationCode: string;
};

export const ScanSessionContext = createContext({
    scanSession: null as ScanSession | null,
    setScanSession: (_scanSession: ScanSession | null) => {},
});
export const HistoryContext = createContext({
    history: [] as Ticket[],
    addToHistory: (_latestTicket: Ticket) => {},
    clearHistory: () => {},
});
export const InternetConnectedContext = createContext(true);

const router = createBrowserRouter([
    { path: '/', element: <Landing /> },
    { path: '/scanner', element: <Scanner /> },
    { path: '/menu', element: <Menu /> },
    { path: '/manual-add', element: <ManualAdd /> },
]);

export default function Wrapper() {
    const [scanSession, setScanSession] = useState<ScanSession | null>(store.get('scanSession'));
    const [history, setHistory] = useState<Ticket[]>([]);
    const [internetConnected, setInternetConnected] = useState<boolean>(navigator.onLine);

    useEffect(() => {
        window.addEventListener('online', updateInternetConnected);
        window.addEventListener('offline', updateInternetConnected);

        if (store.get('history')) {
            const tempHistory = store.get('history');
            const processedHistory: Ticket[] = [];

            for (const ticket of tempHistory) {
                processedHistory.push({
                    qr: ticket.qr,
                    code: ticket.code,
                    timestamp: new Date(ticket.timestamp),
                    ownerName: ticket.ownerName,
                    ownerEmail: ticket.ownerEmail,
                    ticketTypeId: ticket.ticketTypeId,
                    ticketTypeName: ticket.ticketTypeName,
                });
            }

            setHistory(processedHistory);
        }

        return () => {
            window.removeEventListener('online', updateInternetConnected);
            window.removeEventListener('offline', updateInternetConnected);
        };
    }, []);

    useEffect(() => {
        store.set('scanSession', scanSession);
    }, [scanSession]);

    useEffect(() => {
        if (history.length != 0) {
            store.set('history', history);
        }
    }, [history]);

    const updateInternetConnected = () => {
        setInternetConnected(navigator.onLine);
    };

    const addToHistory = (latestTicket: Ticket) => {
        setHistory((prevHistory) => {
            return [...prevHistory, latestTicket].sort((a, b) => {
                return b.timestamp.getTime() - a.timestamp.getTime();
            });
        });
    };

    const clearHistory = () => {
        setHistory([]);
        store.set('history', []);
    };

    return (
        <InternetConnectedContext.Provider value={internetConnected}>
            <ScanSessionContext.Provider value={{ scanSession: scanSession, setScanSession: setScanSession }}>
                <HistoryContext.Provider
                    value={{ history: history, addToHistory: addToHistory, clearHistory: clearHistory }}
                >
                    <RouterProvider router={router} />
                </HistoryContext.Provider>
            </ScanSessionContext.Provider>
        </InternetConnectedContext.Provider>
    );
}
