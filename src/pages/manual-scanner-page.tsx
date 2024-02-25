import '@fontsource/proza-libre/600.css';
import {
    TicketScanAttemptHistoryContext,
    InternetConnectedContext,
    ScannerCredentialsContext,
} from '../context-provider.tsx';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { TicketScanAttempt, TicketScanAttemptResult } from '../types.ts';

export function ManualScannerPage() {
    const ticketScanAttemptHistoryContext = useContext(TicketScanAttemptHistoryContext);
    const internetConnectedContext = useContext(InternetConnectedContext);
    const scannerCredentialsContext = useContext(ScannerCredentialsContext);

    const [secretCodeState, setSecretCodeState] = useState<string>();
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const [errorMessageState, setErrorMessageState] = useState<string | null>();

    const [ticketScanResultState, setTicketScanResultState] = useState<TicketScanAttemptResult | null>();
    const [ownerNameState, setOwnerNameState] = useState<string | null>();
    const [ownerEmailState, setOwnerEmailState] = useState<string | null>();
    const [ticketTypeNameState, setTicketTypeNameState] = useState<string | null>();

    const navigate = useNavigate();
    useEffect(() => {
        if (scannerCredentialsContext.scannerCredentials === null) navigate('/');
    }, [scannerCredentialsContext.scannerCredentials]);

    async function handleSubmit(event: FormEvent): Promise<void> {
        event.preventDefault();

        if (!internetConnectedContext.valueOf()) {
            setErrorMessageState('Geen internetverbinding');
        } else if (!secretCodeState) {
            setErrorMessageState('Vul alle velden in');
        } else if (!scannerCredentialsContext.scannerCredentials) {
            setErrorMessageState('Niet ingelogd');
        } else if (loadingState) {
            setErrorMessageState('Nog aan het laden');
        } else {
            setLoadingState(true);
            setErrorMessageState(null);

            setTicketScanResultState(null);
            setOwnerNameState(null);
            setOwnerEmailState(null);
            setTicketTypeNameState(null);

            const scanTicketQuery = await fetch(
                `https://www.glow-events.be/api/events/${scannerCredentialsContext.scannerCredentials.eventId}/modules/basic-ticket-store/scan-ticket`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        secretCode: secretCodeState,
                        scanAuthorizationCode: scannerCredentialsContext.scannerCredentials.scanAuthorizationCode,
                    }),
                }
            );

            const json = await scanTicketQuery.json();

            if (scanTicketQuery.ok) {
                setTicketScanResultState(json.data.result);
                setOwnerNameState(json.data.ownerName);
                setOwnerEmailState(json.data.ownerEmail);
                setTicketTypeNameState(json.data.ticketTypeName);

                const newTicketScanAttempt: TicketScanAttempt = {
                    result: json.data.result,
                    timestamp: new Date(),
                    secretCode: secretCodeState,
                    ownerName: json.data.ownerName,
                    ownerEmail: json.data.ownerEmail,
                    ticketTypeName: json.data.ticketTypeName,
                };

                ticketScanAttemptHistoryContext.addTicketScanAttemptToHistory(newTicketScanAttempt);
            } else if (json.error) {
                setErrorMessageState(json.error);
            }

            setLoadingState(false);
        }
    }

    return (
        <div className="bg-zinc-950 w-screen flex flex-col h-dvh overflow-x-hidden">
            <header className="py-5 border-b-2 border-zinc-900 mx-10">
                <h1 className="text-center text-white text-2xl font-bold select-none">Manueel scannen</h1>
            </header>

            <main className="mx-10 mt-[112px] h-full">
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <form onSubmit={handleSubmit} className="flex flex-col w-full sm:px-16 max-w-2xl items-center">
                        <input
                            placeholder="Geheime code"
                            type="text"
                            onChange={(event) => {
                                setSecretCodeState(event.target.value);
                            }}
                            id="secretCode"
                            name="secretCode"
                            autoComplete="off"
                            maxLength={50}
                            required
                            className="py-3 px-5 w-full text-zinc-200 select-none rounded-full font-semibold bg-zinc-800"
                        />

                        <button
                            type="submit"
                            disabled={!secretCodeState}
                            className={clsx(
                                loadingState && 'pointer-events-none animate-pulse',
                                !loadingState &&
                                    'disabled:bg-transparent disabled:border-zinc-800 disabled:text-zinc-400',
                                'bg-emerald-800 mt-8 border-2 border-transparent rounded-full whitespace-nowrap transition duration-200 text-white select-none h-12 px-12 text-center font-semibold no-blue-box'
                            )}
                        >
                            Scan
                        </button>
                    </form>

                    <div
                        className={clsx(
                            'mt-10 overflow-hidden w-full text-zinc-200 font-semibold text-center min-h-[112px]'
                        )}
                    >
                        {(() => {
                            switch (ticketScanResultState) {
                                case 'success':
                                    return (
                                        <>
                                            <div>Geldig ticket</div>
                                            <div className="mt-4">
                                                <div>{ticketTypeNameState}</div>
                                                <div>{ownerNameState}</div>
                                                <div>{ownerEmailState}</div>
                                            </div>
                                        </>
                                    );
                                case 'alreadyScanned':
                                    return (
                                        <>
                                            <div>Ticket al gescand</div>
                                            <div className="mt-4">
                                                <div>{ticketTypeNameState}</div>
                                                <div>{ownerNameState}</div>
                                                <div>{ownerEmailState}</div>
                                            </div>
                                        </>
                                    );
                                case 'notFound':
                                    return <span>Ongeldig ticket</span>;
                            }
                        })()}
                        <span>{errorMessageState}</span>
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
