import '@fontsource/proza-libre/600.css';
import {
    TicketScanAttemptHistoryContext,
    InternetConnectedContext,
    ScannerCredentialsContext,
} from '../context-provider.tsx';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TicketScanAttempt, TicketScanAttemptResult } from '../types.ts';
import { getBaseBackendUrl } from '../../common/backend-base-url.ts';
import { Header } from '../../common/header.tsx';
import { Footer } from '../../common/footer.tsx';
import { Input } from '../../common/input.tsx';
import { CrossIcon } from '../../common/icons.tsx';
import { Button } from '../../common/button.tsx';

export function ManualScannerPage() {
    const navigate = useNavigate();

    const ticketScanAttemptHistoryContext = useContext(TicketScanAttemptHistoryContext);
    const internetConnectedContext = useContext(InternetConnectedContext);
    const scannerCredentialsContext = useContext(ScannerCredentialsContext);

    const [secretCodeState, setSecretCodeState] = useState<string>();
    const [loadingState, setLoadingState] = useState<boolean>(false);
    // @ts-ignore
    const [errorMessageState, setErrorMessageState] = useState<string | null>();

    const [ticketScanResultState, setTicketScanResultState] = useState<TicketScanAttemptResult | null>();
    const [ownerNameState, setOwnerNameState] = useState<string | null>();
    const [ownerEmailState, setOwnerEmailState] = useState<string | null>();
    const [ticketTypeNameState, setTicketTypeNameState] = useState<string | null>();

    if (!scannerCredentialsContext.scannerCredentials) {
        navigate('/');
    }

    async function handleSubmit(): Promise<void> {
        if (!internetConnectedContext) {
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
                getBaseBackendUrl() +
                    `/events/${scannerCredentialsContext.scannerCredentials.eventId}/modules/basic-ticket-store/scan-ticket`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        secretCode: secretCodeState,
                        scanAuthorizationCode: scannerCredentialsContext.scannerCredentials.scanAuthorizationCode,
                    }),
                }
            );

            const json = await scanTicketQuery.json();

            if (scanTicketQuery.ok) {
                setOwnerNameState(json.data.ownerName);
                setOwnerEmailState(json.data.ownerEmail);
                setTicketTypeNameState(json.data.ticketTypeName);
                setTicketScanResultState(json.data.result);

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
        <form
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit().then();
            }}
            className="flex flex-col justify-between w-screen h-dvh"
        >
            <Header>Manueel scannen</Header>

            <main className="flex flex-col items-center gap-10 px-10">
                <div className="flex flex-col items-center gap-5 w-full">
                    <Input
                        placeholder="Geheime code"
                        onChange={(event) => setSecretCodeState(event.target.value)}
                        required
                    />

                    <Button type="submit" disabled={!secretCodeState} loading={loadingState}>
                        Scan
                    </Button>
                </div>

                <div className="flex flex-col gap-4 text-zinc-200 font-semibold text-center min-h-28">
                    {(() => {
                        switch (ticketScanResultState) {
                            case 'success':
                                return (
                                    <>
                                        <div>Geldig ticket</div>
                                        <div>
                                            {ticketTypeNameState}
                                            <br />
                                            {ownerNameState}
                                            <br />
                                            {ownerEmailState}
                                        </div>
                                    </>
                                );
                            case 'alreadyScanned':
                                return (
                                    <>
                                        <div>Ticket al gescand</div>
                                        <div>
                                            {ticketTypeNameState}
                                            <br />
                                            {ownerNameState}
                                            <br />
                                            {ownerEmailState}
                                        </div>
                                    </>
                                );
                            case 'notFound':
                                return 'Ongeldig ticket';
                        }
                    })()}
                </div>
            </main>

            <Footer>
                <Link
                    className="rounded-full aspect-square text-white flex items-center justify-center h-12 bg-zinc-800 border-transparent"
                    to="/scanner"
                >
                    <CrossIcon />
                </Link>
            </Footer>
        </form>
    );
}
