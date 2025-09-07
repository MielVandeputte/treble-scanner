import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { useOnlineStatus } from './use-online-status.tsx';

function setNavigatorOnline(value: boolean): void {
  Object.defineProperty(navigator, 'onLine', {
    value,
    writable: true,
  });
}

function dispatchEvent(eventName: 'online' | 'offline'): void {
  globalThis.dispatchEvent(new Event(eventName));
}

describe('useOnlineStatus', () => {
  test.each([true, false])('should return initial online status %s', initialOnlineStatus => {
    setNavigatorOnline(initialOnlineStatus);
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(initialOnlineStatus);
  });

  test('should update to offline when offline event dispatched', () => {
    setNavigatorOnline(true);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      setNavigatorOnline(false);
      dispatchEvent('offline');
    });

    expect(result.current).toBe(false);
  });

  test('should update to online when online event dispatched', () => {
    setNavigatorOnline(false);
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      setNavigatorOnline(true);
      dispatchEvent('online');
    });

    expect(result.current).toBe(true);
  });
});
