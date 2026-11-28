import { useSyncExternalStore } from 'react';

const QUERY = '(display-mode: standalone)';

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

// `navigator.standalone` is the reliable iOS Safari signal (the display-mode
// query is unreliable there); the query covers Android and desktop installs.
const getSnapshot = () =>
  window.matchMedia(QUERY).matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

// The server can't know: render the browser-tab answer, and the client corrects
// it after hydration.
const getServerSnapshot = () => false;

/**
 * True when the app runs installed (added to the home screen) rather than in a
 * browser tab. A hook: call it at the top of a component, not in a condition or
 * callback. It re-renders if the display mode changes, and is `false` during
 * server rendering.
 */
export function useIsStandalone(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
