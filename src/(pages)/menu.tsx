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
                {ticketScanAttemptHistoryContext.ticketScanAttemptHistory.length
                    ? ticketScanAttemptHistoryContext.ticketScanAttemptHistory.map(
                          (ticketScanAttempt: TicketScanAttempt, index: number) => (
                              <div key={ticketScanAttempt.id}>
                                  <div className={clsx('border-zinc-900 pt-5', index && 'border-b-2')} />

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
                                  </div>
                                  <div>{ticketScanAttempt.ticketTypeName}</div>
                                  <div>{ticketScanAttempt.secretCode}</div>
                                  <div>{ticketScanAttempt.ownerName}</div>
                                  <div>{ticketScanAttempt.ownerEmail}</div>
                              </div>
                          )
                      )
                    : 'Nog geen tickets gescand'}
            </main>

            <Footer>
                <Link
                    className="rounded-full aspect-square text-white flex items-center justify-center h-12 bg-zinc-800 border-transparent"
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
