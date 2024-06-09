import { Link } from 'react-router-dom';

export function FlashButton({
    toggleFlash,
    isFlashOnState,
    ticketScanResultState,
}: {
    toggleFlash: () => void;
    isFlashOnState: boolean;
    ticketScanResultState: string | null | undefined;
}) {
    return (
        <button className="w-12 aspect-square flex justify-center items-center" onClick={toggleFlash}>
            {isFlashOnState ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={ticketScanResultState ? '#ffffff' : '#999999'}
                    className="w-6 h-6"
                >
                    <path
                        fillRule="evenodd"
                        d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                        clipRule="evenodd"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={ticketScanResultState ? '#ffffff' : '#999999'}
                    className="w-6 h-6"
                >
                    <path d="M20.798 11.012l-3.188 3.416L9.462 6.28l4.24-4.542a.75.75 0 011.272.71L12.982 9.75h7.268a.75.75 0 01.548 1.262zM3.202 12.988L6.39 9.572l8.148 8.148-4.24 4.542a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262zM3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18z" />
                </svg>
            )}
        </button>
    );
}

export function CameraSwitchButton({
    toggleCamera,
    switchingCameras,
    ticketScanResultState,
}: {
    toggleCamera: () => void;
    switchingCameras: boolean;
    ticketScanResultState: string | null | undefined;
}) {
    return (
        <button
            className="w-12 aspect-square flex justify-center items-center"
            onClick={toggleCamera}
            disabled={switchingCameras}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={ticketScanResultState ? '#ffffff' : '#999999'}
                className="w-6 h-6"
            >
                <path
                    fillRule="evenodd"
                    d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    );
}

export function ManualScannerButton({ ticketScanResultState }: { ticketScanResultState: string | null | undefined }) {
    return (
        <Link to="/manual-scanner" className="w-12 aspect-square flex justify-center items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={ticketScanResultState ? '#ffffff' : '#999999'}
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
            </svg>
        </Link>
    );
}

export function MenuButton({ ticketScanResultState }: { ticketScanResultState: string | null | undefined }) {
    return (
        <Link to="/menu" className="w-12 aspect-square flex justify-center items-center ">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={ticketScanResultState ? '#ffffff' : '#999999'}
                className="w-6 h-6"
            >
                <path
                    fillRule="evenodd"
                    d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                    clipRule="evenodd"
                />
            </svg>
        </Link>
    );
}
