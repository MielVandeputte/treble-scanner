import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getBaseBackendUrl } from '../common/backend-base-url.ts';
import { Button } from '../common/button.tsx';
import { Footer } from '../common/footer.tsx';
import { Header } from '../common/header.tsx';
import { CrossIcon } from '../common/icons.tsx';
import { Input } from '../common/input.tsx';
import {
  TicketScanAttemptHistoryContext,
  InternetConnectedContext,
  ScannerCredentialsContext,
} from '../context-provider.tsx';
import { TicketScanAttempt, TicketScanAttemptResult } from '../types.ts';

export function ManualScanner() {
  const navigate = useNavigate();

  const ticketScanAttemptHistoryContext = useContext(TicketScanAttemptHistoryContext);
  const internetConnectedContext = useContext(InternetConnectedContext);
  const scannerCredentialsContext = useContext(ScannerCredentialsContext);

  const [secretCodeState, setSecretCodeState] = useState<string>('');

  const [ticketScanResultState, setTicketScanResultState] = useState<TicketScanAttemptResult | null>();
  const [ownerNameState, setOwnerNameState] = useState<string | null>();
  const [ownerEmailState, setOwnerEmailState] = useState<string | null>();
  const [ticketTypeNameState, setTicketTypeNameState] = useState<string | null>();

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [errorMessageState, setErrorMessageState] = useState<string | null>(null);

  useEffect(() => {
    if (!scannerCredentialsContext.scannerCredentials) {
      navigate('/');
    }
  }, [navigate, scannerCredentialsContext.scannerCredentials]);

  async function handleSubmit(): Promise<void> {
    setTicketScanResultState(undefined);
    setOwnerNameState(undefined);
    setOwnerEmailState(undefined);
    setTicketTypeNameState(undefined);

    setLoadingState(true);
    setErrorMessageState(null);

    if (!internetConnectedContext) {
      setErrorMessageState('Geen internetverbinding');
    } else if (!secretCodeState) {
      setErrorMessageState('Vul alle velden in');
    } else if (!scannerCredentialsContext.scannerCredentials) {
      setErrorMessageState('Niet ingelogd');
    } else if (loadingState) {
      setErrorMessageState('Nog aan het laden');
    } else {
      try {
        const scanTicketQuery = await fetch(
          getBaseBackendUrl() +
            `/events/${scannerCredentialsContext.scannerCredentials.eventId}/modules/basic-ticket-store/scan-ticket`,
          {
            method: 'POST',
            body: JSON.stringify({
              secretCode: secretCodeState,
              scanAuthorizationCode: scannerCredentialsContext.scannerCredentials.scanAuthorizationCode,
            }),
          },
        );

        const json = await scanTicketQuery.json();

        if (scanTicketQuery.ok) {
          setOwnerNameState(json.data.ownerName);
          setOwnerEmailState(json.data.ownerEmail);
          setTicketTypeNameState(json.data.ticketTypeName);
          setTicketScanResultState(json.data.result);

          const newTicketScanAttempt: TicketScanAttempt = {
            id: crypto.randomUUID(),
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
      className="flex h-dvh w-screen flex-col justify-between"
    >
      <Header>Manueel scannen</Header>

      <main className="flex flex-col items-center gap-10 px-10">
        <div className="flex w-full flex-col items-center gap-5">
          <Input placeholder="Geheime code" onChange={event => setSecretCodeState(event.target.value)} required />

          <Button type="submit" disabled={!secretCodeState} loading={loadingState}>
            Scan
          </Button>
        </div>

        <div className="min-h-24 text-center font-semibold text-zinc-400">
          {(() => {
            if (errorMessageState) {
              return <span className="text-rose-800">{errorMessageState}</span>;
            } else if (ticketScanResultState) {
              return (
                <div>
                  {(() => {
                    switch (ticketScanResultState) {
                      case 'SUCCESS': {
                        return 'Geldig ticket';
                      }
                      case 'ALREADY_SCANNED': {
                        return 'Ticket al gescand';
                      }
                      case 'NOT_FOUND': {
                        return 'Ongeldig ticket';
                      }
                    }
                  })()}
                  {ticketTypeNameState ? (
                    <>
                      <br />
                      {ticketTypeNameState}
                    </>
                  ) : null}
                  {ownerNameState ? (
                    <>
                      <br />
                      {ownerNameState}
                    </>
                  ) : null}
                  {ownerEmailState ? (
                    <>
                      <br />
                      {ownerEmailState}
                    </>
                  ) : null}
                </div>
              );
            }
          })()}
        </div>
      </main>

      <Footer>
        <Link
          className="flex aspect-square h-12 items-center justify-center rounded-full border-transparent bg-zinc-800 text-white"
          to="/scanner"
        >
          <CrossIcon />
        </Link>
      </Footer>
    </form>
  );
}
