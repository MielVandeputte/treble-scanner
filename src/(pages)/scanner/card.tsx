import '@fontsource/proza-libre/600.css';
import clsx from 'clsx';
import { useContext } from 'react';
import { InternetConnectedContext } from '../../context-provider.tsx';
import QrScanner from 'qr-scanner';
import { CameraSwitchButton, FlashButton, ManualScannerButton, MenuButton } from './buttons.tsx';
import { WifiIcon } from '../../common/icons.tsx';

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
                'absolute overflow-hidden z-50 transition duration-200 w-full h-1/3 bg-opacity-95 bottom-0 p-5 rounded-t-md',
                ticketScanResultState === 'success' && 'bg-emerald-800',
                ticketScanResultState === 'alreadyScanned' && 'bg-amber-800',
                ticketScanResultState === 'notFound' && 'bg-rose-800',
                !ticketScanResultState && 'bg-zinc-950'
            )}
        >
            {internetConnectedContext ? (
                <>
                    <section className="flex w-full justify-around h-1/5">
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

                    <button onClick={restartScanning} className="w-full relative h-3/5 whitespace-nowrap">
                        <FeedbackText shown={ticketScanResultState === 'success'} text="Geldig ticket" />
                        <FeedbackText shown={ticketScanResultState === 'notFound'} text="Ongeldig ticket" />
                        <FeedbackText shown={ticketScanResultState === 'alreadyScanned'} text="Al gescand" />
                        <FeedbackText shown={!ticketScanResultState} text="treble" />
                    </button>

                    <button
                        onClick={restartScanning}
                        className="h-1/5 w-full transition duration-200 ease-in-out text-zinc-200 font-sans text-center font-semibold"
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
                <div className="w-full h-full flex flex-col gap-2 justify-center items-center transition duration-200 text-zinc-400">
                    <WifiIcon />
                    <h1 className="font-semibold text-center">Geen internetverbinding</h1>
                </div>
            )}
        </header>
    );
}

function FeedbackText({ text, shown }: { text: string; shown: boolean }) {
    return (
        <div
            className={clsx(
                'flex flex-col gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[55%] text-center',
                shown ? 'fade-in' : 'fade-out'
            )}
        >
            <h1
                className={clsx(
                    text === 'treble' ? 'logo-font text-zinc-400 text-5xl' : 'font-bold text-white text-4xl'
                )}
            >
                {text}
            </h1>
            {text !== 'treble' && (
                <span className="text-zinc-200 text-sm font-semibold">(tap om opnieuw te scannen)</span>
            )}
        </div>
    );
}
