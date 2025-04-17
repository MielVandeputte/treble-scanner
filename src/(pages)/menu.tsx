import clsx from 'clsx';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../common/button.tsx';
import { Footer } from '../common/footer.tsx';
import { Header } from '../common/header.tsx';
import { BackIcon } from '../common/icons.tsx';
import { TicketScanAttemptHistoryContext, ScannerCredentialsContext } from '../context-provider.tsx';
import { TicketScanAttempt } from '../types.ts';

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
    <div className="flex h-dvh w-screen flex-col justify-between">
      <Header>Scangeschiedenis</Header>

      <main className="overflow-x-hidden overflow-y-scroll px-10 text-center font-semibold text-zinc-400">
        {ticketScanAttemptHistoryContext.ticketScanAttemptHistory.length > 0 ? (
          ticketScanAttemptHistoryContext.ticketScanAttemptHistory.map(
            (ticketScanAttempt: TicketScanAttempt, index: number) => (
              <div key={ticketScanAttempt.id}>
                <div className={clsx('border-zinc-900', index && 'border-b-2 pt-5')} />

                <div className="pt-5 pb-2 text-zinc-200">
                  {ticketScanAttempt.timestamp.toTimeString().split(' ')[0]}
                </div>

                <div>
                  {(() => {
                    switch (ticketScanAttempt.result) {
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
            ),
          )
        ) : (
          <span className="select-none">'Nog geen tickets gescand'</span>
        )}
      </main>

      <Footer>
        <Link
          className="flex aspect-square h-12 items-center justify-center rounded-full bg-zinc-800 text-white"
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
