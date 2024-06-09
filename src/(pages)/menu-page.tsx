import '@fontsource/proza-libre/600.css';
import { TicketScanAttemptHistoryContext, ScannerCredentialsContext } from '../context-provider.tsx';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { TicketScanAttempt } from '../types.ts';
import { Header } from '../../common/header.tsx';
import { Footer } from '../../common/footer.tsx';
import { BackIcon } from '../../common/icons.tsx';
import { Button } from '../../common/button.tsx';

export function MenuPage() {
    const navigate = useNavigate();

    const ticketScanAttemptHistoryContext = useContext(TicketScanAttemptHistoryContext);
    const scannerCredentialsContext = useContext(ScannerCredentialsContext);

    if (!scannerCredentialsContext.scannerCredentials) {
        //navigate('/');
    }

    function logout(): void {
        ticketScanAttemptHistoryContext.clearTicketScanAttemptHistory();
        scannerCredentialsContext.setScannerCredentials(null);
        navigate('/');
    }

    return (
        <div className="w-screen h-dvh">
            <Header>Scangeschiedenis</Header>

            <main className="mx-10 overflow-y-scroll overflow-x-clip text-center text-zinc-400 font-semibold">
                {ticketScanAttemptHistoryContext.ticketScanAttemptHistory.length > 0 ? (
                    ticketScanAttemptHistoryContext.ticketScanAttemptHistory.map(
                        (ticketScanAttempt: TicketScanAttempt, index: number) => (
                            <div key={ticketScanAttempt.secretCode} className="mt-5">
                                <div className="mb-1 text-zinc-200">
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
                                </div>
                                <div>{ticketScanAttempt.ticketTypeName}</div>
                                <div>{ticketScanAttempt.secretCode}</div>
                                <div>{ticketScanAttempt.ownerName}</div>
                                <div>{ticketScanAttempt.ownerEmail}</div>
                                <div
                                    className={clsx(
                                        'pb-5 border-zinc-900 mx-8',
                                        index >= ticketScanAttemptHistoryContext.ticketScanAttemptHistory.length - 1
                                            ? 'border-0'
                                            : 'border-b-2'
                                    )}
                                />
                            </div>
                        )
                    )
                ) : (
                    <div className="text-zinc-400 flex items-center h-full text-center justify-center">
                        Nog geen tickets gescand
                    </div>
                )}
            </main>

            <Footer>
                <Link
                    className="rounded-full aspect-square text-white flex items-center justify-center h-12 bg-zinc-800 border-transparent"
                    to="/scanner"
                >
                    <BackIcon />
                </Link>
                <Button onClick={logout}>Ander event</Button>
            </Footer>
        </div>
    );
}
