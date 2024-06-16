import { TicketScanAttemptHistoryContext, ScannerCredentialsContext } from '../context-provider.tsx';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { TicketScanAttempt } from '../types.ts';
import { Header } from '../common/header.tsx';
import { Footer } from '../common/footer.tsx';
import { BackIcon } from '../common/icons.tsx';
import { Button } from '../common/button.tsx';

export function Menu() {
    const navigate = useNavigate();

    const ticketScanAttemptHistoryContext = useContext(TicketScanAttemptHistoryContext);
    const scannerCredentialsContext = useContext(ScannerCredentialsContext);

    useEffect(() => {
        if (!scannerCredentialsContext.scannerCredentials) {
            navigate('/');
        }
    }, [navigate, scannerCredentialsContext.scannerCredentials]);

    function logout(): void {
        ticketScanAttemptHistoryContext.clearTicketScanAttemptHistory();
        scannerCredentialsContext.setScannerCredentials(null);
        navigate('/');
    }

    return (
        <div className="flex flex-col justify-between w-screen h-dvh">
            <Header>Scangeschiedenis</Header>

            <main className="px-10 overflow-y-scroll overflow-x-hidden text-center text-zinc-400 font-semibold">
                {ticketScanAttemptHistoryContext.ticketScanAttemptHistory.length ? (
                    ticketScanAttemptHistoryContext.ticketScanAttemptHistory.map(
                        (ticketScanAttempt: TicketScanAttempt, index: number) => (
                            <div key={ticketScanAttempt.id}>
                                <div className={clsx('border-zinc-900', index && 'pt-5 border-b-2')} />

                                <div className="text-zinc-200 pt-5 pb-2">
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
                                    {ticketScanAttempt.ticketTypeName ? (
                                        <>
                                            <br />
                                            {ticketScanAttempt.ticketTypeName}
                                        </>
                                    ) : null}
                                    {ticketScanAttempt.secretCode ? (
                                        <>
                                            <br />
                                            {ticketScanAttempt.secretCode}
                                        </>
                                    ) : null}
                                    {ticketScanAttempt.ownerName ? (
                                        <>
                                            <br />
                                            {ticketScanAttempt.ownerName}
                                        </>
                                    ) : null}
                                    {ticketScanAttempt.ownerEmail ? (
                                        <>
                                            <br />
                                            {ticketScanAttempt.ownerEmail}
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <span className="select-none">'Nog geen tickets gescand'</span>
                )}
            </main>

            <Footer>
                <Link
                    className="rounded-full aspect-square text-white flex items-center justify-center h-12 bg-zinc-800"
                    to="/scanner"
                >
                    <BackIcon />
                </Link>
                <Button onClick={logout} color="danger" className="flex-grow">
                    Ander event
                </Button>
            </Footer>
        </div>
    );
}
