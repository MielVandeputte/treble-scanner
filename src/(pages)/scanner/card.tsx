import '@fontsource/proza-libre/600.css';
import clsx from 'clsx';
import QrScanner from 'qr-scanner';
import { useContext } from 'react';

import { CameraSwitchButton, FlashButton, ManualScannerButton, MenuButton } from './buttons.tsx';
import { WifiIcon } from '../../common/icons.tsx';
import { InternetConnectedContext } from '../../context-provider.tsx';

export function ScannerCard({
  restartScanning,

  toggleCamera,
  camerasListState,
  switchingCameras,

  toggleFlash,
  isFlashOnState,
  hasFlashState,

  ticketScanResultState,
  ticketTypeNameState,
  ownerNameState,
  ownerEmailState,

  errorMessageState,
}: {
  restartScanning: () => void;

  toggleCamera: () => void;
  camerasListState: QrScanner.Camera[] | undefined;
  switchingCameras: boolean;

  toggleFlash: () => void;
  isFlashOnState: boolean;
  hasFlashState: boolean;

  ticketScanResultState: string | null | undefined;
  ticketTypeNameState: string | null | undefined;
  ownerNameState: string | null | undefined;
  ownerEmailState: string | null | undefined;

  errorMessageState: string | null | undefined;
}) {
  const internetConnectedContext = useContext(InternetConnectedContext);

  return (
    <header
      className={clsx(
        'bg-opacity-95 absolute bottom-0 z-50 h-1/3 w-full overflow-hidden rounded-t-md p-5 transition duration-200',
        ticketScanResultState === 'SUCCESS' && 'bg-emerald-800',
        ticketScanResultState === 'ALREADY_SCANNED' && 'bg-amber-800',
        ticketScanResultState === 'NOT_FOUND' && 'bg-rose-800',
        !ticketScanResultState && 'bg-zinc-950',
      )}
    >
      {internetConnectedContext ? (
        <>
          <section className="flex h-1/5 w-full justify-around">
            {hasFlashState && (
              <FlashButton
                toggleFlash={toggleFlash}
                isFlashOnState={isFlashOnState}
                ticketScanResultState={ticketScanResultState}
              />
            )}

            {camerasListState?.length ? (
              <CameraSwitchButton
                toggleCamera={toggleCamera}
                switchingCameras={switchingCameras}
                ticketScanResultState={ticketScanResultState}
              />
            ) : null}

            <ManualScannerButton ticketScanResultState={ticketScanResultState} />
            <MenuButton ticketScanResultState={ticketScanResultState} />
          </section>

          <button onClick={restartScanning} className="relative h-3/5 w-full whitespace-nowrap">
            <FeedbackText shown={ticketScanResultState === 'SUCCESS'} text="Geldig ticket" />
            <FeedbackText shown={ticketScanResultState === 'ALREADY_SCANNED'} text="Al gescand" />
            <FeedbackText shown={ticketScanResultState === 'NOT_FOUND'} text="Ongeldig ticket" />
            <FeedbackText shown={!ticketScanResultState} text="treble" />
          </button>

          <button
            onClick={restartScanning}
            className="h-1/5 w-full text-center font-sans font-semibold text-zinc-200 transition duration-200 ease-in-out"
          >
            {errorMessageState ? (
              errorMessageState
            ) : (
              <>
                {ticketTypeNameState}
                {ownerNameState && ownerEmailState && (
                  <>
                    <br />
                    {ownerNameState} | {ownerEmailState}
                  </>
                )}
              </>
            )}
          </button>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-400 transition duration-200">
          <WifiIcon />
          <h1 className="text-center font-semibold">Geen internetverbinding</h1>
        </div>
      )}
    </header>
  );
}

function FeedbackText({ text, shown }: { text: string; shown: boolean }) {
  return (
    <div
      className={clsx(
        'absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-[55%] flex-col gap-2 text-center',
        shown ? 'fade-in' : 'fade-out',
      )}
    >
      <h1 className={clsx(text === 'treble' ? 'logo-font text-5xl text-zinc-400' : 'text-4xl font-bold text-white')}>
        {text}
      </h1>
      {text !== 'treble' && <span className="text-sm font-semibold text-zinc-200">(tap om opnieuw te scannen)</span>}
    </div>
  );
}
