import '@fontsource/proza-libre/600.css';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getBaseBackendUrl } from '../common/backend-base-url.ts';
import { Button } from '../common/button.tsx';
import { Input } from '../common/input.tsx';
import { InternetConnectedContext, ScannerCredentialsContext } from '../context-provider.tsx';

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
        const checkScanAuthorizationCodeQuery = await fetch(
          getBaseBackendUrl() + `/events/${eventIdState}/modules/basic-ticket-store/check-scan-authorization-code`,
          {
            method: 'POST',
            body: JSON.stringify({
              scanAuthorizationCode: scanAuthorizationCodeState,
            }),
          },
        );

        const json = await checkScanAuthorizationCodeQuery.json();

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
      } catch {
        setErrorMessageState('Ongekende error opgetreden');
      }
    }

    setLoadingState(false);
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        handleSubmit().then();
      }}
      className="flex h-dvh w-screen flex-col items-center justify-center gap-5 p-5 px-10 select-none"
    >
      <h1 className="logo-font text-center text-4xl text-white">treble</h1>

      <p className="text-justify font-semibold text-zinc-200">
        Voer het event ID en de code in om te beginnen scannen. Beide zijn te vinden in het dashboard op
        treble-events.be.
      </p>

      <div className="flex w-full flex-col gap-4">
        <Input
          placeholder="Event ID"
          value={eventIdState}
          onChange={event => setEventIdState(event.target.value)}
          required
        />

        <Input
          placeholder="Code"
          value={scanAuthorizationCodeState}
          onChange={event => setScanAuthorizationCodeState(event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button type="submit" loading={loadingState} disabled={!eventIdState || !scanAuthorizationCodeState}>
          Start
        </Button>
        {errorMessageState && <span className="text-center font-semibold text-rose-800">{errorMessageState}</span>}
      </div>
    </form>
  );
}
