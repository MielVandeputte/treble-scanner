import { JSX, ReactNode } from 'react';

import { ArrowPathIcon } from '../components/icons.tsx';
import { useScreenOrientation } from '../hooks/use-screen-orientation.tsx';

export function PortraitFilter({ children }: { children: ReactNode }): JSX.Element | ReactNode {
  const screenOrientation = useScreenOrientation();

  return screenOrientation === 'LANDSCAPE' ? (
    <div
      className="flex h-svh flex-col items-center justify-center gap-2 select-none"
      role="alert"
      aria-live="assertive"
    >
      <ArrowPathIcon aria-hidden />
      <p className="text-center font-semibold">Draai je apparaat</p>
    </div>
  ) : (
    children
  );
}
