---
title: Hooks
description: Mobile-chrome hooks: standalone detection, minimize on scroll, pull to refresh.
category: Hooks
---
# Hooks

<!-- generated:import -->

```ts
import {
  EXPAND_AFTER,
  MINIMIZE_SPEED,
  PULL_THRESHOLD,
  isStandalone,
  useMinimizeOnScroll,
  usePullToRefresh,
  type MinimizeOnScroll,
  type PullPhase,
  type PullState,
} from '@korzun/design/hooks';
```

<!-- /generated:import -->

Mobile-chrome behaviour shared by the layout components: detecting the
installed app, minimizing bottom chrome on scroll, and pull-to-refresh. All
three read the **window** scroller; they do nothing for content scrolling in an
inner `overflow: auto` element.

## Usage

### `isStandalone()`

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

### `useMinimizeOnScroll({ resetKey })`

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

### `usePullToRefresh(onRefresh, { enabled })`

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

### A pull-to-refresh indicator

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

<!-- generated:examples -->

## Examples

### isStandalone

True only in the installed app (added to the home screen). Here, in a browser tab, it is
false. Gate install-only chrome such as `TopFade` and a pull-to-refresh indicator on it.

```tsx
import { Card, Text } from '@korzun/design/component';
import { isStandalone } from '@korzun/design/hooks';

export default function IsStandalone() {
  return (
    <Card title="Installed app">
      <Text>
        <code>isStandalone()</code> is {String(isStandalone())}
      </Text>
    </Card>
  );
}
```

### useMinimizeOnScroll

Scroll this frame down quickly and the bottom bar minimizes; scroll back up a little, reach
the top or press Expand and it comes back. A slow scroll leaves it alone. `NavMobile` already
does this; call the hook for other bottom chrome.

```tsx
import { Card, Inline, Page, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useMinimizeOnScroll } from '@korzun/design/hooks';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';

const useStyle = createUseStyles((theme: Theme) => ({
  bar: {
    position: 'fixed',
    left: theme.space.xl,
    right: theme.space.xl,
    bottom: theme.space.xl,
    padding: theme.space.lg,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.color.border.default}`,
    backgroundColor: theme.color.bg.card,
    boxShadow: theme.shadow.hoverLift,
    transition: 'padding 200ms ease',
  },
  minimized: { paddingTop: theme.space.xs, paddingBottom: theme.space.xs },
}));

const chapters = Array.from({ length: 12 }, (_, i) => `Chapter ${i + 1}`);

export default function MinimizeOnScroll() {
  const styles = useStyle();
  const { minimized, expand } = useMinimizeOnScroll({ resetKey: 'reader' });
  return (
    <>
      <Page>
        {chapters.map((title) => (
          <Card key={title} title={title}>
            <Text>Scroll quickly to minimize the bar below.</Text>
          </Card>
        ))}
      </Page>
      <div className={cx(styles.bar, minimized && styles.minimized)}>
        <Inline justify="between">
          <Text tone="muted">{minimized ? 'Minimized' : 'Expanded'}</Text>
          {minimized && (
            <Button type="link" onClick={expand}>
              Expand
            </Button>
          )}
        </Inline>
      </div>
    </>
  );
}
```

### usePullToRefresh

The hook draws nothing: it reports a phase and an offset, and you draw the indicator. It reads
the page's rubber-band overscroll, so only a touch pull on iOS moves it; with a mouse the
phase stays `idle`. Releasing while `armed` runs `onRefresh` until its promise settles.

```tsx
import { Card, Spinner, Stack, Text } from '@korzun/design/component';
import { usePullToRefresh } from '@korzun/design/hooks';
import { useState } from 'react';

export default function PullToRefresh() {
  const [refreshes, setRefreshes] = useState(0);
  const { phase, offset } = usePullToRefresh(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshes((n) => n + 1);
  });
  return (
    <Card title="Library">
      <Stack gap="sm">
        {phase === 'refreshing' ? <Spinner label="Refreshing" /> : null}
        <Text>
          Phase: {phase}, offset: {Math.round(offset)}px
        </Text>
        <Text tone="muted">Refreshed {refreshes} times</Text>
      </Stack>
    </Card>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

### MinimizeOnScroll

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `expand` (required) | `() => void` |  | Expand the bar now (a tap on the minimized bar), as if the page had scrolled up. |
| `minimized` (required) | `boolean` |  | Whether the bar is currently minimized. |

### PullState

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `offset` (required) | `number` |  | Pixels pulled past the top, capped at 1.5 × `PULL_THRESHOLD`; held at `PULL_THRESHOLD` while refreshing. |
| `phase` (required) | `'idle' \| 'pulling' \| 'armed' \| 'refreshing'` |  | Where the pull is: `idle`, `pulling`, `armed` (a release refreshes) or `refreshing`. |

### Types

```ts
/** `pulling` below `PULL_THRESHOLD`, `armed` at or past it, `refreshing` while `onRefresh` runs. */
type PullPhase = 'idle' | 'pulling' | 'armed' | 'refreshing';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

This module has no styles of its own.

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.0.1** (2026-11-15): Hooks: `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone`.

<!-- /generated:changelog -->
