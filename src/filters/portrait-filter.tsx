import { JSX, ReactNode } from 'react';

import { SwitchIcon } from '../components/icons.tsx';
import { useScreenOrientation } from '../hooks/use-screen-orientation.tsx';

export function PortraitFilter({ children }: { children: ReactNode }): JSX.Element | ReactNode {
  const screenOrientation = useScreenOrientation();

  return screenOrientation === 'LANDSCAPE' ? (
    <div className="flex h-dvh w-screen flex-col items-center justify-center gap-2 text-zinc-400 select-none">
      <SwitchIcon />
      <p className="text-center font-semibold">Draai je apparaat</p>
    </div>
  ) : (
    children
  );
}
