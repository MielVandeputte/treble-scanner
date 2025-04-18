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
      className={clsx(
        'flex aspect-square w-12 items-center justify-center',
        showingScanAttempt ? 'text-white' : 'text-zinc-400',
      )}
      onClick={toggleFlash}
    >
      {isFlashOnState ? <FilledInLightningIcon /> : <LightningIcon />}
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
      onClick={toggleCamera}
      className={clsx(
        'flex aspect-square w-12 items-center justify-center',
        showingScanAttempt ? 'text-white' : 'text-zinc-400',
      )}
    >
      <SwitchIcon />
    </button>
  );
}

export function ManualScannerButton({ showingScanAttempt }: { showingScanAttempt: boolean }): JSX.Element {
  return (
    <Link
      to={MANUAL_SCANNER_PATH}
      viewTransition
      className={clsx(
        'flex aspect-square w-12 items-center justify-center',
        showingScanAttempt ? 'text-white' : 'text-zinc-400',
      )}
    >
      <PencilIcon />
    </Link>
  );
}

export function MenuButton({ showingScanAttempt }: { showingScanAttempt: boolean }): JSX.Element {
  return (
    <Link
      to={SCAN_HISTORY_PATH}
      viewTransition
      className={clsx(
        'flex aspect-square w-12 items-center justify-center',
        showingScanAttempt ? 'text-white' : 'text-zinc-400',
      )}
    >
      <MenuIcon />
    </Link>
  );
}
