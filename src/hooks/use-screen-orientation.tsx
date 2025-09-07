import { useSyncExternalStore } from 'react';

import { ScreenOrientation } from '../types/screen-orientation.ts';

const orientationTypeToScreenOrientationMap: Record<OrientationType, ScreenOrientation> = {
  'portrait-primary': 'PORTRAIT',
  'portrait-secondary': 'PORTRAIT',
  'landscape-primary': 'LANDSCAPE',
  'landscape-secondary': 'LANDSCAPE',
};

function subscribe(callback: () => void) {
  globalThis.screen.orientation.addEventListener('change', callback);

  return () => {
    globalThis.screen.orientation.removeEventListener('change', callback);
  };
}

export function useScreenOrientation(): ScreenOrientation {
  return useSyncExternalStore<ScreenOrientation>(
    subscribe,
    () => orientationTypeToScreenOrientationMap[globalThis.screen.orientation.type],
  );
}
