import '@fontsource/proza-libre/600.css';
import { InternetConnectedContext, ScanSessionContext } from './wrapper';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function Landing() {
    const scanSessionContext = useContext(ScanSessionContext);
    const navigate = useNavigate();

    const [eventId, setEventId] = useState<string>('minimaxi2024');
    const [eventscanAuthorizationCode, setEventscanAuthorizationCode] = useState<string>('voorbeeldcode1');

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const internetConnectedContext = useContext(InternetConnectedContext);

    useEffect(() => {
        if (scanSessionContext.scanSession != null) {
            navigate('/scanner');
        }
    }, []);

    useEffect(() => {
        if (navigator.onLine) {
            if (errorMessage === 'Verbind met het internet om in te loggen') {
                setErrorMessage('');
            }
        } else {
            setErrorMessage('Verbind met het internet om in te loggen');
        }
    }, [internetConnectedContext]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (navigator.onLine) {
            setLoading(true);

            const target = event.target as typeof event.target & {
                eventId: { value: string };
                eventscanAuthorizationCode: { value: string };
            };

            fetch('https://www.glow-events.be/api/check-scan-authorization-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: target.eventId.value,
                    scanAuthorizationCode: target.eventscanAuthorizationCode.value,
                }),
            }).then(async (data) => {
                const result = await data.json();

                if (result.data === true) {
                    scanSessionContext.setScanSession({
                        eventId: target.eventId.value,
                        scanAuthorizationCode: target.eventscanAuthorizationCode.value,
                    });
                    navigate('/scanner');
                } else if (result.data === false) {
                    setErrorMessage('event-id of code verkeerd');
                }

                setLoading(false);
            });
        }
    };

    return (
        <div className="bg-zinc-900 w-screen h-screen flex justify-center items-center p-5 select-none">
            <main className="flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-center text-white logo text-5xl">glow</h1>

                    <p className="text-zinc-200 my-10 font-semibold text-center max-w-[600px]">
                        Voer de event-id en de code in om te beginnen scannen. Beide zijn te vinden in het
                        dasboard op glow-events.be.
                    </p>

                    <form onSubmit={handleSubmit} className="w-full sm:px-16">
                        <div className="flex items-center">
                            <label htmlFor="eventId" className="text-zinc-200 font-semibold w-24">
                                event-id
                            </label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    setEventId(event.target.value);
                                }}
                                id="eventId"
                                name="eventId"
                                autoComplete="off"
                                maxLength={50}
                                required
                                className="py-3 px-5 w-full text-zinc-200 rounded-full bg-zinc-800"
                            />
                        </div>

                        <div className="flex items-center mt-5">
                            <label htmlFor="eventscanAuthorizationCode" className="text-zinc-200 font-semibold w-24">
                                code
                            </label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    setEventscanAuthorizationCode(event.target.value);
                                }}
                                id="eventscanAuthorizationCode"
                                name="eventscanAuthorizationCode"
                                autoComplete="off"
                                maxLength={50}
                                required
                                className="py-3 px-5 w-full text-zinc-200 rounded-full bg-zinc-800"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={eventId === '' || eventscanAuthorizationCode === '' || !internetConnectedContext}
                            className={clsx(
                                loading && 'pointer-events-none animate-pulse',
                                !loading && 'disabled:bg-transparent disabled:border-zinc-800 disabled:text-zinc-400',
                                'bg-emerald-800 mt-10 border-2 border-transparent rounded-full whitespace-nowrap transition duration-200 text-white select-none h-12 w-full text-center font-semibold no-blue-box'
                            )}
                        >
                            Start
                        </button>
                    </form>

                    <span className="mt-5 h-6 font-semibold text-zinc-200">{errorMessage}</span>
                </div>
            </main>
        </div>
    );
}
