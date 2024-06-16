import { Link } from 'react-router-dom';
import { ArrowsIcon, FilledInFlashIcon, FlashIcon, MenuIcon, WritingIcon } from '../../common/icons.tsx';
import clsx from 'clsx';

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
        <button
            className={clsx(
                'w-12 aspect-square flex justify-center items-center',
                ticketScanResultState ? 'text-white' : 'text-zinc-400'
            )}
            onClick={toggleFlash}
        >
            {isFlashOnState ? <FilledInFlashIcon /> : <FlashIcon />}
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
            onClick={toggleCamera}
            disabled={switchingCameras}
            className={clsx(
                'w-12 aspect-square flex justify-center items-center',
                ticketScanResultState ? 'text-white' : 'text-zinc-400'
            )}
        >
            <ArrowsIcon />
        </button>
    );
}

export function ManualScannerButton({ ticketScanResultState }: { ticketScanResultState: string | null | undefined }) {
    return (
        <Link
            to="/manual-scanner"
            className={clsx(
                'w-12 aspect-square flex justify-center items-center',
                ticketScanResultState ? 'text-white' : 'text-zinc-400'
            )}
        >
            <WritingIcon />
        </Link>
    );
}

export function MenuButton({ ticketScanResultState }: { ticketScanResultState: string | null | undefined }) {
    return (
        <Link
            to="/menu"
            className={clsx(
                'w-12 aspect-square flex justify-center items-center',
                ticketScanResultState ? 'text-white' : 'text-zinc-400'
            )}
        >
            <MenuIcon />
        </Link>
    );
}
