import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Scanner from './scanner';
import Menu from './menu';
import Landing from './landing';
import { createContext, useContext, useEffect, useState } from 'react';
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
}

export type ScanSession = {
    eventId: string;
    scanAuthorizationCode: string;
}

export const ScanSessionContext = createContext({ scanSession: null as ScanSession|null, setScanSession: (_scanSession: ScanSession|null) => {} });
export const HistoryContext = createContext({ history: [] as Ticket[], addToHistory: (_latestTicket: Ticket) => {}, clearHistory: () => {} });
export const InternetConnectedContext = createContext(true);


const router = createBrowserRouter([
    { path: '/', element: <Landing /> },
    { path: '/scanner', element: <Scanner /> },
    { path: '/menu', element: <Menu /> },
    { path: '/manual-add', element: <ManualAdd /> }
]);

export default function Wrapper() {   
    const [scanSession, setScanSession] = useState<ScanSession|null>(store.get('scanSession'));
    const [history, setHistory] = useState<Ticket[]>(store.get('history')? store.get('history'): []);
    const [internetConnected, setInternetConnected] = useState<boolean>(navigator.onLine);

    useEffect(() => {
        window.addEventListener('online', updateInternetConnected);
        window.addEventListener('offline', updateInternetConnected);

        return () => {
            window.removeEventListener('online', updateInternetConnected);
            window.removeEventListener('offline', updateInternetConnected);
        }
    });

    useEffect(() => {
        store.set('scanSession', scanSession);
    }, [scanSession]);

    useEffect(() => {
        store.set('history', history);
    }, [history]);

    const updateInternetConnected = () => {
        setInternetConnected(navigator.onLine);
    }

    const addToHistory = (latestTicket: Ticket) => {
        setHistory(prevHistory => [...prevHistory, latestTicket]);
    }

    const clearHistory = () => {
        setHistory([]);
    }
    
    return (
        <InternetConnectedContext.Provider value={internetConnected}>
            <ScanSessionContext.Provider value={{ scanSession: scanSession, setScanSession: setScanSession }}>
                <HistoryContext.Provider value={{ history: history, addToHistory: addToHistory, clearHistory: clearHistory }}>
                    <RouterProvider router={router}/>
                </HistoryContext.Provider>
            </ScanSessionContext.Provider>
        </InternetConnectedContext.Provider>
    );
}