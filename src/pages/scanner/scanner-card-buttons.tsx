import clsx from 'clsx';
import { JSX } from 'react';
import { Link } from 'react-router-dom';

import { ArrowPathIcon, FilledInBoltIcon, BoltIcon, EllipsisIcon, PencilIcon } from '../../components/icons.tsx';
import { MANUAL_SCANNER_PATH, SCAN_HISTORY_PATH } from '../../main.tsx';

export function FlashToggle({
  toggled,
  appearance,
  onToggle,
}: {
  toggled: boolean;
  appearance: 'regular' | 'bright';
  onToggle: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition active:scale-90',
        appearance === 'bright' ? 'text-zinc-200 active:text-white' : 'active:text-zinc-200',
      )}
      aria-label={toggled ? 'Zet flits uit' : 'Zet flits aan'}
    >
      {toggled ? <FilledInBoltIcon aria-hidden /> : <BoltIcon aria-hidden />}
    </button>
  );
}

export function CameraSwitchButton({
  appearance,
  onClick,
}: {
  appearance: 'regular' | 'bright';
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition active:scale-90',
        appearance === 'bright' ? 'text-zinc-200 active:text-white' : 'active:text-zinc-200',
      )}
      aria-label="Wissel camera"
    >
      <ArrowPathIcon aria-hidden />
    </button>
  );
}

export function ManualScannerLink({ appearance }: { appearance: 'regular' | 'bright' }): JSX.Element {
  return (
    <Link
      to={MANUAL_SCANNER_PATH}
      viewTransition
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition active:scale-90',
        appearance === 'bright' ? 'text-zinc-200 active:text-white' : 'active:text-zinc-200',
      )}
      aria-label="Manueel scannen"
    >
      <PencilIcon aria-hidden />
    </Link>
  );
}

export function ScanHistoryLink({ appearance }: { appearance: 'regular' | 'bright' }): JSX.Element {
  return (
    <Link
      to={SCAN_HISTORY_PATH}
      viewTransition
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition active:scale-90',
        appearance === 'bright' ? 'text-zinc-200 active:text-white' : 'active:text-zinc-200',
      )}
      aria-label="Scangeschiedenis"
    >
      <EllipsisIcon aria-hidden />
    </Link>
  );
}
