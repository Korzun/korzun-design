import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Scrolls to the element the URL fragment names (`#/components/menu#menuitem`
 * lands on its table, `#/guides/tokens#recipe` on its heading).
 */
export const useScrollToHash = (): void => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash]);
};

/**
 * Starts a new page at the top: the router keeps the window's scroll, so a
 * link clicked far down one page would open the next one mid-way. A URL with
 * a fragment is left to `useScrollToHash`.
 */
export const useScrollToTopOnPageChange = (): void => {
  const { pathname, hash } = useLocation();
  const last = useRef(pathname);
  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
};
