import clsx from 'clsx';
import { JSX } from 'react';
import { Link } from 'react-router-dom';

import { SwitchIcon, FilledInLightningIcon, LightningIcon, MenuIcon, PencilIcon } from '../../components/icons.tsx';
import { MANUAL_SCANNER_PATH, SCAN_HISTORY_PATH } from '../../main.tsx';

export function FlashButton({
  toggleFlash,
  isFlashOnState,
  showingScanAttempt,
}: {
  toggleFlash: () => void;
  isFlashOnState: boolean;
  showingScanAttempt: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={toggleFlash}
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition active:scale-90',
        showingScanAttempt ? 'text-zinc-200 active:text-white' : 'active:text-zinc-200',
      )}
      aria-label={isFlashOnState ? 'Zet flits uit' : 'Zet flits aan'}
    >
      {isFlashOnState ? <FilledInLightningIcon aria-hidden /> : <LightningIcon aria-hidden />}
    </button>
  );
}

export function CameraSwitchButton({
  toggleCamera,
  showingScanAttempt,
}: {
  toggleCamera: () => void;
  showingScanAttempt: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={toggleCamera}
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition active:scale-90',
        showingScanAttempt ? 'text-zinc-200 active:text-white' : 'active:text-zinc-200',
      )}
      aria-label="Wissel camera"
    >
      <SwitchIcon aria-hidden />
    </button>
  );
}

export function ManualScannerButton({ showingScanAttempt }: { showingScanAttempt: boolean }): JSX.Element {
  return (
    <Link
      to={MANUAL_SCANNER_PATH}
      viewTransition
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition active:scale-90',
        showingScanAttempt ? 'text-zinc-200 active:text-white' : 'active:text-zinc-200',
      )}
      aria-label="Manueel scannen"
    >
      <PencilIcon aria-hidden />
    </Link>
  );
}

export function ScanHistoryButton({ showingScanAttempt }: { showingScanAttempt: boolean }): JSX.Element {
  return (
    <Link
      to={SCAN_HISTORY_PATH}
      viewTransition
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition active:scale-90',
        showingScanAttempt ? 'text-zinc-200 active:text-white' : 'active:text-zinc-200',
      )}
      aria-label="Scangeschiedenis"
    >
      <MenuIcon aria-hidden />
    </Link>
  );
}
