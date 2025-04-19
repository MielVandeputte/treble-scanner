import clsx from 'clsx';
import { motion } from 'motion/react';
import { JSX } from 'react';
import { Link } from 'react-router-dom';

import { SwitchIcon, FilledInLightningIcon, LightningIcon, MenuIcon, PencilIcon } from '../../components/icons.tsx';
import { MANUAL_SCANNER_PATH, SCAN_HISTORY_PATH } from '../../main.tsx';

const MotionLink = motion(Link);

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
    <motion.button
      layout
      layoutId="flash"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ opacity: 0.9, scale: 0.9 }}
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition',
        showingScanAttempt ? 'text-white' : 'text-zinc-400',
      )}
      onClick={toggleFlash}
    >
      {isFlashOnState ? <FilledInLightningIcon /> : <LightningIcon />}
    </motion.button>
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
    <motion.button
      layout
      layoutId="camera-switch"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ opacity: 0.9, scale: 0.9 }}
      onClick={toggleCamera}
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition',
        showingScanAttempt ? 'text-white' : 'text-zinc-400',
      )}
    >
      <SwitchIcon />
    </motion.button>
  );
}

export function ManualScannerButton({ showingScanAttempt }: { showingScanAttempt: boolean }): JSX.Element {
  return (
    <MotionLink
      layout
      layoutId="manual-scanner"
      whileTap={{ opacity: 0.9, scale: 0.9 }}
      to={MANUAL_SCANNER_PATH}
      viewTransition
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition',
        showingScanAttempt ? 'text-white' : 'text-zinc-400',
      )}
    >
      <PencilIcon />
    </MotionLink>
  );
}

export function MenuButton({ showingScanAttempt }: { showingScanAttempt: boolean }): JSX.Element {
  return (
    <MotionLink
      layout
      layoutId="menu"
      whileTap={{ opacity: 0.9, scale: 0.9 }}
      to={SCAN_HISTORY_PATH}
      viewTransition
      className={clsx(
        'flex aspect-square w-12 items-center justify-center transition',
        showingScanAttempt ? 'text-white' : 'text-zinc-400',
      )}
    >
      <MenuIcon />
    </MotionLink>
  );
}
