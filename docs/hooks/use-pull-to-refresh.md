---
title: usePullToRefresh
description: Pull-down-to-refresh for the installed app; it reports a phase and an offset, and you draw the indicator.
category: Hooks
---
# usePullToRefresh

<!-- generated:import -->

```ts
import {
  PULL_THRESHOLD,
  usePullToRefresh,
  type PullPhase,
  type PullState,
} from '@korzun/design/hooks';
```

<!-- /generated:import -->

Pull-down-to-refresh for the installed app; it reports a phase and an offset,
and you draw the indicator. Part of the mobile-chrome behaviour shared by the
layout components, with [`isStandalone`](is-standalone.md) and
[`useMinimizeOnScroll`](use-minimize-on-scroll.md). It reads the **window**
scroller; it does nothing for content scrolling in an inner `overflow: auto`
element.

## Usage

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

- Do gate pull-to-refresh UI on [`isStandalone()`](is-standalone.md); browser tabs have their own.
- Do return a promise from `onRefresh` that settles even on failure.
- Don't expect it to track a nested scroll container.

<!-- generated:examples -->

## Examples

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
