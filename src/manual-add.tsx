import '@fontsource/proza-libre/600.css';
import { HistoryContext, InternetConnectedContext, ScanSessionContext, Ticket } from './wrapper';
import { FormEvent, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function ManualAdd() {
    const historyContext = useContext(HistoryContext);
    const internetConnectedContext = useContext(InternetConnectedContext);
    const scanSessionContext = useContext(ScanSessionContext);

    const [qr, setQr] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [code, setCode] = useState<string>('');
    const [ownerName, setOwnerName] = useState<string>('');
    const [ownerEmail, setOwnerEmail] = useState<string>('');
    const [ticketTypeId, setTicketTypeId] = useState<number>(0);
    const [ticketTypeName, setTicketTypeName] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (qr && !loading && scanSessionContext.scanSession && navigator.onLine) {
            setLoading(true);

            const res = await fetch('https://www.glow-events.be/api/scan-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: scanSessionContext.scanSession.eventId,
                    secretCode: qr,
                    scanAuthorizationCode: scanSessionContext.scanSession.scanAuthorizationCode,
                }),
            });

            if (res.ok) {
                const content = await res.json();

                if (content.data.code != 'noTicket') {
                    setOwnerName(content.data.ownerName);
                    setOwnerEmail(content.data.ownerEmail);
                    setTicketTypeId(content.data.ticketTypeId);
                    setTicketTypeName(content.data.ticketTypeName);

                    const newTicket: Ticket = {
                        timestamp: new Date(),
                        qr: qr,
                        code: content.data.code,
                        ownerName: content.data.ownerName,
                        ownerEmail: content.data.ownerEmail,
                        ticketTypeId: content.data.ticketTypeId,
                        ticketTypeName: content.data.ticketTypeName,
                    } as Ticket;
                    historyContext.addToHistory(newTicket);
                }

                setCode(content.data.code);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-zinc-900 h-screen flex flex-col w-full overflow-x-hidden">
            <main className="px-5 pt-10 flex-grow">
                <h1 className="text-center pb-5 text-white text-3xl font-bold select-none">Manueel invoeren</h1>

                <div className="flex flex-col items-center justify-center w-full h-full">
                    <form onSubmit={handleSubmit} className="w-full sm:px-16 max-w-2xl">
                        <input
                            type="text"
                            onChange={(event) => {
                                setQr(event.target.value);
                            }}
                            id="code"
                            name="code"
                            autoComplete="off"
                            maxLength={50}
                            required
                            className="py-3 px-5 w-full text-zinc-200 select-none rounded-full bg-zinc-800"
                        />

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={qr === '' || !internetConnectedContext}
                                className={clsx(
                                    loading && 'pointer-events-none animate-pulse',
                                    !loading &&
                                        'disabled:bg-transparent disabled:border-zinc-800 disabled:text-zinc-400',
                                    'bg-emerald-800 mt-10 border-2 border-transparent rounded-full whitespace-nowrap transition duration-200 text-white select-none h-12 px-12 text-center font-semibold no-blue-box'
                                )}
                            >
                                Verifieer
                            </button>
                        </div>
                    </form>

                    <div
                        className={clsx(
                            'mt-10 min-h-[88px] overflow-hidden whitespace-nowrap w-full transition duration-200'
                        )}
                    >
                        {internetConnectedContext && code ? (
                            <>
                                <div className="text-white mb-2 text-2xl overflow-hidden whitespace-nowrap font-sans text-center font-semibold">
                                    {code === 'noTicket'
                                        ? 'Geen ticket'
                                        : code === 'alreadyScanned'
                                        ? 'Al gescand'
                                        : code === 'success'
                                        ? 'Success'
                                        : ''}
                                </div>
                                <div
                                    className={clsx(
                                        'text-zinc-200 overflow-hidden whitespace-nowrap font-sans text-center font-semibold',
                                        code === 'noTicket' && 'hidden'
                                    )}
                                >
                                    Type {ticketTypeId} | {ticketTypeName}
                                </div>
                                <div
                                    className={clsx(
                                        'text-zinc-200 overflow-hidden whitespace-nowrap font-sans text-center font-semibold',
                                        code === 'noTicket' && 'hidden'
                                    )}
                                >
                                    {ownerName} | {ownerEmail}
                                </div>
                            </>
                        ) : internetConnectedContext === false ? (
                            <div className="text-zinc-200 font-semibold text-center w-full">
                                Verbind met het internet om te beginnen verifieren
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </main>
            <footer className="w-full p-5 items-center justify-center flex select-none">
                <Link
                    className="rounded-full aspect-square text-white h-12 bg-zinc-800 aria-selected:bg-zinc-700 border-2 border-transparent"
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </Link>
            </footer>
        </div>
    );
}
