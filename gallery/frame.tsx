import { createUseStyles, lightTheme, ThemeProvider, type Theme } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ThemeProvider as JssThemeProvider } from 'react-jss';
import { Link, useLocation, useParams, useSearchParams } from 'react-router';

import { useThemeSetting } from '../src/theme/use-theme-setting.js';
import { exampleFor, moduleBySlug, recipeBySlug } from './data.js';
import { contentHeight, nextHeadroom, overlayTop, type Headroom } from './frame-height.js';
import { isThemeMessage, isThemeValue, postToWindow, type ThemeValue } from './messages.js';

const ThemeSync = ({ theme }: { theme: ThemeValue }) => {
  const setSetting = useThemeSetting()[1];
  useEffect(() => {
    setSetting(theme);
  }, [theme, setSetting]);
  return null;
};

const useStyle = createUseStyles((theme: Theme) => ({
  '@global': { body: { margin: 0 } },
  centered: {
    display: 'grid',
    placeItems: 'center',
    // A wide example (a form) shrinks to the frame instead of overflowing it.
    gridTemplateColumns: 'minmax(0, 1fr)',
    '& > *': { maxWidth: '100%' },
    minHeight: '100vh',
    padding: theme.space.xxxxl,
    boxSizing: 'border-box',
  },
  // Room for focus rings and shadows, which the iframe edge would clip.
  flow: { padding: theme.space.xxl },
}));

// Thumbnails ask for `fit=center`: a small example sits in the middle of the
// viewport instead of its top-left corner. Docs demos keep the normal flow.
const Centered = ({ children }: { children: ReactNode }) => (
  <div className={useStyle().centered} data-fit="center">
    {children}
  </div>
);

// A docs demo in the normal flow. It tells the page its height whenever it
// changes, so the page sizes the iframe to fit with no inner scrollbar. The
// body is at least the viewport tall, so the wrapper is what gets measured,
// plus any open menu, popover or dialog (see contentHeight), which would
// otherwise be clipped at the frame's edge. A list that flipped above its
// trigger for lack of room gets room below, so it flips back down (see
// contentHeight). A `side="top"` menu that sticks out above gets top padding
// while it is open (see nextHeadroom), and the popover is told to re-measure.
const Flow = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;
    let headroom: Headroom = { value: 0, staleTop: null };
    const post = () => {
      const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
      headroom = nextHeadroom(headroom, overlayTop(el), pad);
      const paddingTop = headroom.value ? `${pad + headroom.value}px` : '';
      if (el.style.paddingTop !== paddingTop) {
        el.style.paddingTop = paddingTop;
        // Popovers re-measure on resize; this one moved its anchor.
        window.dispatchEvent(new Event('resize'));
      }
      const height = contentHeight(el);
      if (height === last) return;
      last = height;
      postToWindow(window.parent, { type: 'gallery:height', height });
    };
    post();
    // Measured a frame later, not inside the event: when the frame resizes, a
    // top-side popover (anchored by CSS `bottom`) moves with the viewport
    // until it re-measures on the same resize, and measuring before that would
    // read a position it is about to leave and feed it back into the height.
    let pending = 0;
    const later = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        post();
      });
    };
    // Overlays open, move and close through DOM changes (a portal added, a
    // dialog's `open`, a popover's position style) and on frame resize.
    const mutations = new MutationObserver(later);
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['open', 'style'],
    });
    window.addEventListener('resize', later);
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(later);
    resize?.observe(el);
    return () => {
      mutations.disconnect();
      window.removeEventListener('resize', later);
      resize?.disconnect();
      cancelAnimationFrame(pending);
    };
  }, []);
  return (
    <div ref={ref} className={useStyle().flow}>
      {children}
    </div>
  );
};

// How long after the frame mounts an example may still be opening an overlay.
const LOAD_FOCUS_WINDOW_MS = 1500;

/**
 * An example that starts with an overlay open (a dialog's `showModal()`, a menu
 * focusing its first item, a Select's search box) moves focus into the frame,
 * and with it the docs page's keyboard: Space and the arrow keys would act on
 * the demo instead of scrolling the page. Focus that arrives while the frame
 * loads, before anyone presses or types in it, is handed back to the page. A
 * Tab into the frame arrives later, so keyboard users still reach the demo.
 */
const useKeepPageFocus = () => {
  useEffect(() => {
    // The host iframe belongs to the page's realm, so `instanceof` here fails.
    const host = window.frameElement as HTMLElement | null;
    if (!host) return;
    let loading = true;
    const settle = () => {
      loading = false;
    };
    const giveBack = () => {
      if (!loading) return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) active.blur();
      host.blur();
    };
    const timer = setTimeout(settle, LOAD_FOCUS_WINDOW_MS);
    document.addEventListener('pointerdown', settle, true);
    document.addEventListener('keydown', settle, true);
    document.addEventListener('focusin', giveBack);
    // An overlay may have opened before this effect ran.
    if (document.activeElement !== document.body) giveBack();
    return () => {
      clearTimeout(timer);
      document.removeEventListener('pointerdown', settle, true);
      document.removeEventListener('keydown', settle, true);
      document.removeEventListener('focusin', giveBack);
    };
  }, []);
};

/**
 * Whether the docs page around this frame is past the phone breakpoint. A frame
 * in a half-width column is narrower than the breakpoint, but it shows the
 * desktop look of a desktop page; on a phone the page is narrow too and the
 * frame keeps its own media queries. False outside an iframe.
 */
const useWideHost = (query: string): boolean => {
  const host = useMemo(
    () => (window.parent === window ? null : window.parent.matchMedia(query)),
    [query]
  );
  const [wide, setWide] = useState(host?.matches ?? false);
  useEffect(() => {
    if (!host) return;
    const update = () => setWide(host.matches);
    host.addEventListener('change', update);
    return () => host.removeEventListener('change', update);
  }, [host]);
  return wide;
};

const NEVER = '@media (max-width: 0px)';

/** `value` with every key named `from` renamed `to`, at any depth. */
const renameKey = (value: unknown, from: string, to: string): unknown => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k === from ? to : k, renameKey(v, from, to)])
  );
};

/**
 * Breakpoints for a desktop page whatever the frame width: never mobile, always
 * normal. Recipes (`recipe.input`) carry the mobile query as a key, built in with
 * the theme, so those keys are rewritten too.
 */
export const desktopBreakpoints = (outer: Theme): Theme => ({
  ...(renameKey(outer, outer.breakpoint.mobile, NEVER) as Theme),
  breakpoint: { mobile: NEVER, normal: '@media (min-width: 0px)' },
});

/** Inside the frame's ThemeProvider: the desktop breakpoints when the host page is wide. */
const HostBreakpoints = ({ use, children }: { use: boolean; children: ReactNode }) =>
  use ? <JssThemeProvider theme={desktopBreakpoints}>{children}</JssThemeProvider> : children;

// Renders one docs example on its own: the site embeds it in an iframe so the
// example gets its own theme provider and cannot leak styles into the page.
export const Frame = () => {
  useKeepPageFocus();
  // `/frame/recipe/:recipe/:example` or `/frame/:module/:example`: a recipe is looked
  // up among recipes only, so a recipe and a module may share a slug.
  const { module: moduleSlug, recipe: recipeSlug, example: exampleSlug = '' } = useParams();
  const [params] = useSearchParams();
  const rawTheme = params.get('theme');
  const centered = params.get('fit') === 'center';
  const [theme, setTheme] = useState<ThemeValue | null>(isThemeValue(rawTheme) ? rawTheme : null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data: unknown = event.data;
      if (isThemeMessage(data)) setTheme(data.theme);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // `(min-width: 641px)`: the normal breakpoint, without its `@media`.
  const wideHost = useWideHost(lightTheme.breakpoint.normal.replace(/^@media\s*/, ''));

  const owner =
    recipeSlug === undefined ? moduleBySlug(moduleSlug ?? '') : recipeBySlug(recipeSlug);
  const found = owner && exampleFor(owner, exampleSlug);
  const ownerPath = recipeSlug === undefined ? (moduleSlug ?? '') : `recipe/${recipeSlug}`;
  if (!found) return <p>{`No example "${ownerPath}/${exampleSlug}".`}</p>;

  const { Component, info } = found;
  return (
    <ThemeProvider identity="gallery-frame">
      <HostBreakpoints use={wideHost && info.viewport !== 'mobile'}>
        <ToastProvider>
          {theme && <ThemeSync theme={theme} />}
          {info.viewport === 'screen' ? (
            // A full-height screen fills the frame itself: no centring padding, and no
            // height posts, since its height follows the frame's (the page fixes it).
            <Component />
          ) : centered ? (
            <Centered>
              <Component />
            </Centered>
          ) : (
            <Flow>
              <Component />
            </Flow>
          )}
        </ToastProvider>
      </HostBreakpoints>
    </ThemeProvider>
  );
};

// Shown when an example inside the frame links somewhere outside it: the frame
// must never render the shell. `home` is the frame the window was opened on.
export const FrameNavigatedAway = ({ home }: { home: string }) => {
  const { pathname } = useLocation();
  return (
    <div>
      <p>
        The example navigated to <code>{pathname}</code>
      </p>
      <Link to={home}>Back to the example</Link>
    </div>
  );
};
