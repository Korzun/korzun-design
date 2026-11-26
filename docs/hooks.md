---
title: Hooks
description: Mobile-chrome hooks: standalone detection, minimize on scroll, pull to refresh.
category: Guide
---
# Hooks

`import { isStandalone, useMinimizeOnScroll, usePullToRefresh } from '@korzun/design/hooks'`

Mobile-chrome behaviour shared by the layout components: detecting the
installed app, minimizing bottom chrome on scroll, and pull-to-refresh. All
three read the **window** scroller; they do nothing for content scrolling in an
inner `overflow: auto` element.

## `isStandalone()`

```ts
isStandalone(): boolean
```

True when running as an installed PWA (added to the home screen):
`(display-mode: standalone)` matches, or iOS Safari's
`navigator.standalone === true`. Not a hook; a plain function, safe to call
during render because the status can't change within a session. It touches
`window`, so don't call it during server rendering.

Use it to gate chrome that only makes sense when installed: `TopFade` and a
pull-to-refresh indicator.

## `useMinimizeOnScroll({ resetKey })`

```ts
useMinimizeOnScroll({ resetKey }: { resetKey: string }): MinimizeOnScroll
type MinimizeOnScroll = { minimized: boolean; expand: () => void }
```

iOS-tab-bar behaviour for bottom chrome. `NavMobile` already uses it; call it
yourself only for other chrome.

- Minimizes when one scroll frame moves **down** at `>= MINIMIZE_SPEED`
  (`0.8` px/ms). Speed, not distance: slow reading never minimizes.
- Expands after scrolling **up** `EXPAND_AFTER` (`12`) px back from the furthest-down point
  reached since minimizing, on reaching the top, or when you call `expand()`.
- Only user-driven scrolls count: it ignores scrolling until a `touchstart` or
  `wheel` is seen after `resetKey` last changed (so scroll restoration doesn't
  minimize it). Changing `resetKey` also expands. Pass the route's
  `useLocation().key`.
- iOS rubber-band overscroll (top and bottom) is clamped out.

## `usePullToRefresh(onRefresh, { enabled })`

```ts
usePullToRefresh(onRefresh: () => Promise<unknown>, options?: { enabled?: boolean }): PullState
type PullPhase = 'idle' | 'pulling' | 'armed' | 'refreshing'
type PullState = { phase: PullPhase; offset: number }
```

Pull-down-to-refresh for the standalone app, which has no browser gesture. It
**draws nothing**; you render an indicator from the returned state.

- Measures the page's own rubber-band overscroll past the top while a finger is
  down (`-window.scrollY`), so it works only where the browser rubber-bands
  (iOS). It never cancels a touch.
- `offset`: px of pull, capped at `PULL_THRESHOLD * 1.5` (105). `pulling` below
  `PULL_THRESHOLD` (`70`), `armed` at or above it.
- Releasing while armed calls `onRefresh` and holds `refreshing` with `offset`
  pinned at `PULL_THRESHOLD` until the promise settles (resolve **or** reject),
  then returns to `idle`. Release short of the threshold returns to `idle`.
- Ignored: touches starting inside an open `<dialog>`, overscroll with no finger
  down, new pulls while refreshing, and everything when `enabled: false`
  (default `true`).
- `onRefresh` is read through a ref; an inline closure is fine.
- **`onRefresh` must return a promise.** A function returning `undefined`
  throws on `.then` and leaves the phase stuck at `refreshing`. Use an `async`
  function.

## Examples

```tsx
// An indicator for the installed app, mounted once in the layout.
export const PullToRefreshIndicator = () => {
  const client = useApolloClient();
  const refresh = useCallback(
    () => client.refetchQueries({ include: 'active' }).then(() => undefined, () => undefined),
    [client]
  );
  const { phase, offset } = usePullToRefresh(refresh);
  const style = {
    transform: `translateY(${offset}px)`,
    opacity: Math.min(1, offset / PULL_THRESHOLD),
  };
  return (
    <div style={style}>
      {phase === 'refreshing'
        ? <Spinner label="Refreshing" />
        : <ChevronIcon aria-hidden className={phase === 'armed' ? styles.up : styles.down} />}
    </div>
  );
};

{isStandalone() && <PullToRefreshIndicator />}
```

## Do / don't

- Do gate pull-to-refresh UI on `isStandalone()`; browser tabs have their own.
- Do return a promise from `onRefresh` that settles even on failure.
- Don't call `useMinimizeOnScroll` for the bar `NavMobile` already manages.
- Don't expect any of these to track a nested scroll container.
