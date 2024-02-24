import '@fontsource/proza-libre/600.css';
import { InternetConnectedContext, ScannerCredentialsContext } from '../context-provider.tsx';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export function LoginPage() {
    const navigate = useNavigate();

    const scannerCredentialsContext = useContext(ScannerCredentialsContext);
    const internetConnectedContext = useContext(InternetConnectedContext);

    const [eventIdState, setEventIdState] = useState<string>();
    const [scanAuthorizationCodeState, setScanAuthorizationCodeState] = useState<string>();

    const [loadingState, setLoadingState] = useState<boolean>(false);
    const [errorMessageState, setErrorMessageState] = useState<string>();

    useEffect(() => {
        if (scannerCredentialsContext.scannerCredentials !== null) {
            navigate('/scanner');
        }
    }, [scannerCredentialsContext.scannerCredentials]);

    async function handleSubmit(event: FormEvent): Promise<void> {
        event.preventDefault();

        if (!internetConnectedContext.valueOf()) {
            setErrorMessageState('Geen internetverbinding');

        } else if (!eventIdState || !scanAuthorizationCodeState) {
            setErrorMessageState('Vul alle velden in');

        } else{
            setLoadingState(true);

            const checkScanAuthorizationdCodeQuery = await fetch(`https://www.glow-events.be/api/events/${eventIdState}/modules/basic-ticket-store/check-scan-authorization-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scanAuthorizationCode: scanAuthorizationCodeState,
                }),
            });

            const result = await checkScanAuthorizationdCodeQuery.json();

            if (result.data === true) {
                scannerCredentialsContext.setScannerCredentials({
                    eventId: eventIdState,
                    scanAuthorizationCode: scanAuthorizationCodeState,
                });
                navigate('/scanner');

            } else {
                setErrorMessageState('Event ID of code verkeerd');
            }

            setLoadingState(false);
        }
    }

    return (
        <div className="bg-zinc-900 w-screen h-dvh flex justify-center items-center p-10 select-none">
            <div className="flex flex-col items-center gap-8">
                <h1 className="text-center text-white logo text-4xl">glow</h1>

                <p className="text-zinc-200 font-semibold text-justify">
                    Voer het event ID en de code in om te beginnen scannen. Beide zijn te vinden in het
                    dashboard op glow-events.be.
                </p>

                <form onSubmit={handleSubmit} className="w-full sm:px-16 flex flex-col gap-5">
                    <div className="flex items-center">
                        <input
                            placeholder="Event ID"
                            type="text"
                            value={eventIdState}
                            onChange={(event) => {
                                setEventIdState(event.target.value);
                            }}
                            id="eventId"
                            name="eventId"
                            autoComplete="off"
                            maxLength={50}
                            required
                            className="py-3 px-5 w-full text-zinc-200 rounded-full font-semibold bg-zinc-800"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            placeholder="Code"
                            type="text"
                            value={scanAuthorizationCodeState}
                            onChange={(event) => {
                                setScanAuthorizationCodeState(event.target.value);
                            }}
                            id="eventscanAuthorizationCode"
                            name="eventscanAuthorizationCode"
                            autoComplete="off"
                            maxLength={50}
                            required
                            className="py-3 px-5 w-full text-zinc-200 rounded-full font-semibold bg-zinc-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!eventIdState || !scanAuthorizationCodeState || !internetConnectedContext}
                        className={clsx(
                            loadingState && 'pointer-events-none animate-pulse',
                            !loadingState && 'disabled:bg-transparent disabled:border-zinc-800 disabled:text-zinc-400',
                            'bg-emerald-800 mt-3 border-2 border-transparent rounded-full whitespace-nowrap transition duration-200 text-white select-none h-12 w-full text-center font-semibold no-blue-box'
                        )}
                    >
                        Start
                    </button>

                    <span className="font-bold h-6 text-zinc-400 text-center">{errorMessageState}</span>
                </form>
            </div>
        </div>
    );
}
