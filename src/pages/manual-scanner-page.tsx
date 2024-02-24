import '@fontsource/proza-libre/600.css';
import { TicketScanAttemptHistoryContext, InternetConnectedContext, ScannerCredentialsContext } from '../context-provider.tsx';
import { FormEvent, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { TicketScanAttempt } from '../types.ts';

export function ManualScannerPage() {
    const ticketHistoryContext = useContext(TicketScanAttemptHistoryContext);
    const internetConnectedContext = useContext(InternetConnectedContext);
    const scannerCredentialsContext = useContext(ScannerCredentialsContext);

    const [secretCodeState, setSecretCodeState] = useState<string>();
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const [ticketScanResultState, setTicketScanResultState] = useState<string | null>();
    const [ownerNameState, setOwnerNameState] = useState<string>();
    const [ownerEmailState, setOwnerEmailState] = useState<string>();
    const [ticketTypeIdState, setTicketTypeIdState] = useState<number>();
    const [ticketTypeNameState, setTicketTypeNameState] = useState<string>();

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (secretCodeState && !loadingState && scannerCredentialsContext.scannerCredentials && internetConnectedContext.valueOf()) {
            setLoadingState(true);

            const scanTicketQuery = await fetch(`https://www.glow-events.be/api/events/${scannerCredentialsContext.scannerCredentials.eventId}/modules/basic-ticket-store/scan-ticket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secretCode: secretCodeState,
                    scanAuthorizationCode: scannerCredentialsContext.scannerCredentials.scanAuthorizationCode,
                }),
            });

            const json = await scanTicketQuery.json();

            if (scanTicketQuery.ok) {
                setOwnerNameState(json.data.ownerName);
                setOwnerEmailState(json.data.ownerEmail);
                setTicketTypeIdState(json.data.ticketTypeId);
                setTicketTypeNameState(json.data.ticketTypeName);

                const newTicketScanAttempt: TicketScanAttempt = {
                    result: 'success',
                    timestamp: new Date(),

                    secretCode: secretCodeState,

                    ownerName: json.data.ownerName,
                    ownerEmail: json.data.ownerEmail,

                    ticketTypeId: json.data.ticketTypeId,
                    ticketTypeName: json.data.ticketTypeName,
                };

                ticketHistoryContext.addTicketScanAttemptToHistory(newTicketScanAttempt);
            } else {
                setTicketScanResultState(json.error);
            }

            setLoadingState(false);
        }
    }

    return (
        <div className="bg-zinc-950 h-screen flex flex-col w-full overflow-x-hidden">
            <main className="pt-10 px-10 flex-grow">
                <h1 className="text-center text-white text-2xl font-bold select-none">Manueel</h1>

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
                                disabled={!secretCodeState || !internetConnectedContext}
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
                            'mt-10 min-h-[88px] overflow-hidden whitespace-nowrap w-full transition duration-200'
                        )}
                    >
                        {internetConnectedContext && ticketScanResultState ? (
                            <>
                                <div className="text-white mb-2 text-2xl overflow-hidden whitespace-nowrap font-sans text-center font-semibold">
                                    {ticketScanResultState === 'noTicket'
                                        ? 'Geen ticket'
                                        : ticketScanResultState === 'alreadyScanned'
                                        ? 'Al gescand'
                                        : ticketScanResultState === 'success'
                                        ? 'Success'
                                        : ''}
                                </div>
                                <div
                                    className={clsx(
                                        'text-zinc-200 overflow-hidden whitespace-nowrap font-sans text-center font-semibold',
                                        ticketScanResultState === 'noTicket' && 'hidden'
                                    )}
                                >
                                    Type {ticketTypeIdState} | {ticketTypeNameState}
                                </div>
                                <div
                                    className={clsx(
                                        'text-zinc-200 overflow-hidden whitespace-nowrap font-sans text-center font-semibold',
                                        ticketScanResultState === 'noTicket' && 'hidden'
                                    )}
                                >
                                    {ownerNameState} | {ownerEmailState}
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
