import '@fontsource/proza-libre/600.css';
import { TicketScanAttemptHistoryContext, ScannerCredentialsContext } from '../context-provider.tsx';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { TicketScanAttempt } from '../types.ts';

export function MenuPage() {
    const ticketScanAttemptHistoryContext = useContext(TicketScanAttemptHistoryContext);
    const scannerCredentialsContext = useContext(ScannerCredentialsContext);

    const navigate = useNavigate();
    useEffect(() => {
        if (scannerCredentialsContext.scannerCredentials === null) navigate('/');
    }, [scannerCredentialsContext.scannerCredentials]);

    function logout(): void {
        ticketScanAttemptHistoryContext.clearTicketScanAttemptHistory();
        scannerCredentialsContext.setScannerCredentials(null);
        navigate('/');
    }

    return (
        <div className="bg-zinc-950 h-dvh flex flex-col w-screen overflow-x-hidden">
            <header className="py-5 mx-10 border-b-2 border-zinc-900">
                <h1 className="text-center text-white text-2xl font-bold select-none">Scangeschiedenis</h1>
            </header>

            <main className="mx-10 h-full overflow-y-scroll text-center text-zinc-400 font-semibold">
                {ticketScanAttemptHistoryContext.ticketScanAttemptHistory.length > 0 ? (
                    ticketScanAttemptHistoryContext.ticketScanAttemptHistory.map(
                        (ticketScanAttempt: TicketScanAttempt, index: number) => (
                            <div
                                key={ticketScanAttempt.secretCode}
                                className={clsx(
                                    'py-5 mx-8 border-zinc-900',
                                    index >= ticketScanAttemptHistoryContext.ticketScanAttemptHistory.length - 1
                                        ? 'border-0'
                                        : 'border-b-2'
                                )}
                            >
                                <div className="mb-1 text-zinc-200">
                                    {ticketScanAttempt.timestamp.toTimeString().split(' ')[0]}
                                </div>
                                <div>
                                    {(() => {
                                        switch (ticketScanAttempt.result) {
                                            case 'success':
                                                return 'Geldig ticket';
                                            case 'alreadyScanned':
                                                return 'Ticket al gescand';
                                            case 'notFound':
                                                return 'Ongeldig ticket';
                                        }
                                    })()}
                                </div>
                                <div>{ticketScanAttempt.ticketTypeName}</div>
                                <div>{ticketScanAttempt.secretCode}</div>
                                <div>{ticketScanAttempt.ownerName}</div>
                                <div>{ticketScanAttempt.ownerEmail}</div>
                            </div>
                        )
                    )
                ) : (
                    <div className="text-zinc-200">Nog geen tickets gescand</div>
                )}
            </main>
            <footer className="w-full p-5 items-center flex select-none">
                <Link
                    className="mr-3 rounded-full aspect-square text-white h-12 bg-zinc-800 aria-selected:bg-zinc-700 border-2 border-transparent"
                    to="/scanner"
                >
                    <div className="flex items-center justify-center h-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="#ffffff"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                            />
                        </svg>
                    </div>
                </Link>
                <button
                    onClick={logout}
                    className="rounded-full font-semibold text-white w-full h-12 bg-red-900 aria-selected:bg-red-950 border-2 border-transparent no-blue-box"
                >
                    Ander event
                </button>
            </footer>
        </div>
    );
}
