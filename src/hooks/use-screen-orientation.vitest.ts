import { renderHook, act } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';

import { useScreenOrientation } from './use-screen-orientation.tsx';

const mockScreenOrientation = {
  type: 'portrait-primary',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('screen', { orientation: mockScreenOrientation });
});

test.each(['portrait-primary', 'portrait-secondary'])(
  'should return initial screen orientation PORTRAIT',
  initialScreenOrientationType => {
    mockScreenOrientation.type = initialScreenOrientationType;
    const { result } = renderHook(() => useScreenOrientation());
    expect(result.current).toBe('PORTRAIT');
  },
);

test.each(['landscape-primary', 'landscape-secondary'])(
  'should return initial screen orientation LANDSCAPE',
  initialScreenOrientationType => {
    mockScreenOrientation.type = initialScreenOrientationType;
    const { result } = renderHook(() => useScreenOrientation());
    expect(result.current).toBe('LANDSCAPE');
  },
);

test('should update to PORTRAIT when change event dispatched', () => {
  mockScreenOrientation.type = 'landscape-primary';
  const { result } = renderHook(() => useScreenOrientation());

  act(() => {
    mockScreenOrientation.type = 'portrait-primary';
    mockScreenOrientation.addEventListener.mock.calls[0][1]();
  });

  expect(result.current).toBe('PORTRAIT');
});

test('should update to LANDSCAPE when change event dispatched', () => {
  mockScreenOrientation.type = 'portrait-primary';
  const { result } = renderHook(() => useScreenOrientation());

  act(() => {
    mockScreenOrientation.type = 'landscape-primary';
    mockScreenOrientation.addEventListener.mock.calls[0][1]();
  });

  expect(result.current).toBe('LANDSCAPE');
});
