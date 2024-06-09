import clsx from 'clsx';
import { ReactNode, useContext } from 'react';
import { InternetConnectedContext } from '../../context-provider.tsx';
import QrScanner from 'qr-scanner';
import { CameraSwitchButton, FlashButton, ManualScannerButton, MenuButton } from './buttons.tsx';

export function ScannerPageCard({
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
                'absolute overflow-hidden z-50 transition duration-200 w-full h-1/3 bg-opacity-95 bottom-0 p-5',
                ticketScanResultState === 'success' && 'bg-green-800',
                ticketScanResultState === 'alreadyScanned' && 'bg-yellow-800',
                ticketScanResultState === 'notFound' && 'bg-red-800',
                !ticketScanResultState && 'bg-zinc-950'
            )}
        >
            {internetConnectedContext.valueOf() ? (
                <>
                    <section className="flex w-full justify-around h-1/5">
                        {hasFlashState && (
                            <FlashButton
                                toggleFlash={toggleFlash}
                                isFlashOnState={isFlashOnState}
                                ticketScanResultState={ticketScanResultState}
                            />
                        )}

                        {camerasListState && camerasListState.length && (
                            <CameraSwitchButton
                                toggleCamera={toggleCamera}
                                switchingCameras={switchingCameras}
                                ticketScanResultState={ticketScanResultState}
                            />
                        )}

                        <ManualScannerButton ticketScanResultState={ticketScanResultState} />
                        <MenuButton ticketScanResultState={ticketScanResultState} />
                    </section>

                    <button onClick={restartScanning} className="w-full relative h-3/5 whitespace-nowrap">
                        <FeedbackText shown={ticketScanResultState === 'success'}>Geldig ticket</FeedbackText>
                        <FeedbackText shown={ticketScanResultState === 'notFound'}>Ongeldig ticket</FeedbackText>
                        <FeedbackText shown={ticketScanResultState === 'alreadyScanned'}>Al gescand</FeedbackText>
                        <FeedbackText shown={!ticketScanResultState}>treble</FeedbackText>
                    </button>

                    <button
                        onClick={restartScanning}
                        className="h-1/5 overflow-ellipsis whitespace-nowrap w-full transition duration-200 ease-in-out text-zinc-200 font-sans text-center font-semibold"
                    >
                        <div>{errorMessageState}</div>
                        <div>{ticketTypeNameState}</div>
                        {ownerNameState && ownerEmailState && (
                            <div>
                                {ownerNameState} | {ownerEmailState}
                            </div>
                        )}
                    </button>
                </>
            ) : (
                <div className="w-full h-full flex flex-col justify-center items-center transition duration-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#999999"
                        className="w-6 h-6 mb-6 mx-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                        />
                    </svg>

                    <h1 className="font-semibold text-center text-zinc-400">Geen internetverbinding</h1>
                </div>
            )}
        </header>
    );
}

function FeedbackText({ children, shown }: { children: ReactNode; shown: boolean }) {
    return (
        <h1
            className={clsx(
                'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[55%] text-center text-white font-sans font-bold text-4xl',
                shown ? 'fade-in' : 'fade-out'
            )}
        >
            {children}
        </h1>
    );
}
