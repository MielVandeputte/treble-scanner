import { useSyncExternalStore } from 'react';

import { ScreenOrientation } from '../types/screen-orientation.type.ts';

const ORIENTATION_TYPE_TO_SCREEN_ORIENTATION_MAP: Record<OrientationType, ScreenOrientation> = {
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
    () => ORIENTATION_TYPE_TO_SCREEN_ORIENTATION_MAP[globalThis.screen.orientation.type],
  );
}
