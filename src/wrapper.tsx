import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Scanner from './scanner';
import Menu from './menu';
import Landing from './landing';
import { createContext, useState } from 'react';

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
    authorizationCode: string;
}

export const ScanSessionContext = createContext({ scanSession: null as ScanSession|null, setScanSession: (_scanSession: ScanSession|null) => {} });
export const HistoryContext = createContext({ history: [] as Ticket[], addToHistory: (_latestTicket: Ticket) => {}, clearHistory: () => {} });

const router = createBrowserRouter([
    { path: '/', element: <Landing /> },
    { path: 'scanner', element: <Scanner /> },
    { path: 'menu', element: <Menu /> }
]);

export default function Wrapper() {
    const [scanSession, setScanSession] = useState<ScanSession|null>(null);
    const [history, setHistory] = useState<Ticket[]>([]);

    const addToHistory = (latestTicket: Ticket) => {
        setHistory(prevHistory => [...prevHistory, latestTicket]);
    }

    const clearHistory = () => {
        setHistory([]);
    }
    
    return (
        <ScanSessionContext.Provider value={{ scanSession: scanSession, setScanSession: setScanSession }}>
            <HistoryContext.Provider value={{ history: history, addToHistory: addToHistory, clearHistory: clearHistory }}>
                <RouterProvider router={router}/>
            </HistoryContext.Provider>
        </ScanSessionContext.Provider>
    );
}