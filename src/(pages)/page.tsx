import '@fontsource/proza-libre/600.css';
import { InternetConnectedContext, ScannerCredentialsContext } from '../context-provider.tsx';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBaseBackendUrl } from '../common/backend-base-url.ts';
import { Input } from '../common/input.tsx';
import { Button } from '../common/button.tsx';

export function Login() {
    const navigate = useNavigate();

    const scannerCredentialsContext = useContext(ScannerCredentialsContext);
    const internetConnectedContext = useContext(InternetConnectedContext);

    const [eventIdState, setEventIdState] = useState<string>('');
    const [scanAuthorizationCodeState, setScanAuthorizationCodeState] = useState<string>('');

    const [loadingState, setLoadingState] = useState<boolean>(false);
    const [errorMessageState, setErrorMessageState] = useState<string | null>(null);

    useEffect(() => {
        if (scannerCredentialsContext.scannerCredentials) {
            navigate('/scanner');
        }
    }, [navigate, scannerCredentialsContext.scannerCredentials]);

    async function handleSubmit(): Promise<void> {
        setLoadingState(true);
        setErrorMessageState(null);

        if (!internetConnectedContext) {
            setErrorMessageState('Geen internetverbinding');
        } else if (!eventIdState || !scanAuthorizationCodeState) {
            setErrorMessageState('Vul alle velden in');
        } else {
            try {
                const checkScanAuthorizationdCodeQuery = await fetch(
                    getBaseBackendUrl() +
                        `/events/${eventIdState}/modules/basic-ticket-store/check-scan-authorization-code`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            scanAuthorizationCode: scanAuthorizationCodeState,
                        }),
                    }
                );

                const json = await checkScanAuthorizationdCodeQuery.json();

                if (json.data === true) {
                    scannerCredentialsContext.setScannerCredentials({
                        eventId: eventIdState,
                        scanAuthorizationCode: scanAuthorizationCodeState,
                    });
                    navigate('/scanner');
                } else if (json.data === false) {
                    setErrorMessageState('Event ID of code verkeerd');
                } else if (json.error) {
                    setErrorMessageState(json.error);
                }
            } catch (error) {
                setErrorMessageState('Ongekende error opgetreden');
            }
        }

        setLoadingState(false);
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit().then();
            }}
            className="flex flex-col justify-center items-center w-screen h-dvh gap-5 p-5 px-10"
        >
            <h1 className="text-center text-white logo-font text-4xl">treble</h1>

            <p className="text-zinc-200 font-semibold text-justify">
                Voer het event ID en de code in om te beginnen scannen. Beide zijn te vinden in het dashboard op
                treble-events.be.
            </p>

            <div className="flex flex-col gap-4 w-full">
                <Input
                    placeholder="Event ID"
                    value={eventIdState}
                    onChange={(event) => setEventIdState(event.target.value)}
                    required
                />

                <Input
                    placeholder="Code"
                    value={scanAuthorizationCodeState}
                    onChange={(event) => setScanAuthorizationCodeState(event.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col gap-2 items-center">
                <Button type="submit" loading={loadingState} disabled={!eventIdState || !scanAuthorizationCodeState}>
                    Start
                </Button>
                {errorMessageState && <p className="font-bold text-rose-800 text-center">{errorMessageState}</p>}
            </div>
        </form>
    );
}
