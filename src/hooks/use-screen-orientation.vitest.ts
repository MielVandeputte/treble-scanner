import { renderHook, act } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';

import { useScreenOrientation } from './use-screen-orientation.tsx';

const MOCK_SCREEN_ORIENTATION = {
  type: 'portrait-primary',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('screen', { orientation: MOCK_SCREEN_ORIENTATION });
});

test.each(['portrait-primary', 'portrait-secondary'])(
  'should return initial screen orientation PORTRAIT',
  initialScreenOrientationType => {
    MOCK_SCREEN_ORIENTATION.type = initialScreenOrientationType;
    const { result } = renderHook(() => useScreenOrientation());
    expect(result.current).toBe('PORTRAIT');
  },
);

test.each(['landscape-primary', 'landscape-secondary'])(
  'should return initial screen orientation LANDSCAPE',
  initialScreenOrientationType => {
    MOCK_SCREEN_ORIENTATION.type = initialScreenOrientationType;
    const { result } = renderHook(() => useScreenOrientation());
    expect(result.current).toBe('LANDSCAPE');
  },
);

test('should update to PORTRAIT when change event dispatched', () => {
  MOCK_SCREEN_ORIENTATION.type = 'landscape-primary';
  const { result } = renderHook(() => useScreenOrientation());

  act(() => {
    MOCK_SCREEN_ORIENTATION.type = 'portrait-primary';
    MOCK_SCREEN_ORIENTATION.addEventListener.mock.calls[0][1]();
  });

  expect(result.current).toBe('PORTRAIT');
});

test('should update to LANDSCAPE when change event dispatched', () => {
  MOCK_SCREEN_ORIENTATION.type = 'portrait-primary';
  const { result } = renderHook(() => useScreenOrientation());

  act(() => {
    MOCK_SCREEN_ORIENTATION.type = 'landscape-primary';
    MOCK_SCREEN_ORIENTATION.addEventListener.mock.calls[0][1]();
  });

  expect(result.current).toBe('LANDSCAPE');
});
