import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useIsStandalone } from './index.js';

const QUERY = '(display-mode: standalone)';

/** A controllable `(display-mode: standalone)` media query. */
const fakeDisplayMode = (initial: boolean) => {
  const listeners = new Set<() => void>();
  const mql = {
    matches: initial,
    media: QUERY,
    addEventListener: vi.fn((_: string, l: () => void) => listeners.add(l)),
    removeEventListener: vi.fn((_: string, l: () => void) => listeners.delete(l)),
  };
  const original = window.matchMedia;
  window.matchMedia = vi.fn((q: string) =>
    q === QUERY ? mql : original(q)
  ) as unknown as typeof window.matchMedia;
  return {
    mql,
    listeners,
    set(matches: boolean) {
      mql.matches = matches;
      listeners.forEach((l) => l());
    },
    restore() {
      window.matchMedia = original;
    },
  };
};

let restore: (() => void) | undefined;
afterEach(() => {
  restore?.();
  restore = undefined;
  delete (navigator as Navigator & { standalone?: boolean }).standalone;
});

describe('useIsStandalone', () => {
  it('is false in a browser tab', () => {
    restore = fakeDisplayMode(false).restore;
    expect(renderHook(() => useIsStandalone()).result.current).toBe(false);
  });

  it('is true when the display-mode standalone query matches', () => {
    restore = fakeDisplayMode(true).restore;
    expect(renderHook(() => useIsStandalone()).result.current).toBe(true);
  });

  it("is true when iOS Safari's navigator.standalone is true", () => {
    restore = fakeDisplayMode(false).restore;
    Object.defineProperty(navigator, 'standalone', { value: true, configurable: true });
    expect(renderHook(() => useIsStandalone()).result.current).toBe(true);
  });

  it('updates when the display mode changes, and unsubscribes on unmount', () => {
    const mode = fakeDisplayMode(false);
    restore = mode.restore;
    const { result, unmount } = renderHook(() => useIsStandalone());
    expect(result.current).toBe(false);
    act(() => mode.set(true));
    expect(result.current).toBe(true);
    unmount();
    expect(mode.listeners.size).toBe(0);
  });

  it('is false during server rendering, without touching window', () => {
    const spy = vi.spyOn(window, 'matchMedia');
    const Probe = () => <>{String(useIsStandalone())}</>;
    expect(renderToString(<Probe />)).toBe('false');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
