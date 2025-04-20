import { useEffect, useState } from 'react';

import { ScreenOrientation } from '../types/screen-orientation.ts';

const orientationTypeToScreenOrientationMap: Record<OrientationType, ScreenOrientation> = {
  'portrait-primary': 'PORTRAIT',
  'portrait-secondary': 'PORTRAIT',
  'landscape-primary': 'LANDSCAPE',
  'landscape-secondary': 'LANDSCAPE',
};

export function useScreenOrientation(): ScreenOrientation {
  const [screenOrientationState, setScreenOrientationState] = useState<ScreenOrientation>(
    orientationTypeToScreenOrientationMap[globalThis.screen.orientation.type],
  );

  useEffect(() => {
    function refreshScreenOrientationState(): void {
      setScreenOrientationState(orientationTypeToScreenOrientationMap[globalThis.screen.orientation.type]);
    }

    globalThis.addEventListener('resize', refreshScreenOrientationState);

    return () => {
      globalThis.removeEventListener('resize', refreshScreenOrientationState);
    };
  }, []);

  return screenOrientationState;
}
