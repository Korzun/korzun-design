---
title: useIsStandalone
description: True when running as the installed app (added to the home screen); gates install-only chrome.
category: Hooks
---
# useIsStandalone

<!-- generated:import -->

`import { useIsStandalone } from '@korzun/design/hooks'`

<!-- /generated:import -->

True when running as the installed app (added to the home screen). Part of the
mobile-chrome behaviour shared by the layout components, with
[`useMinimizeOnScroll`](use-minimize-on-scroll.md) and
[`usePullToRefresh`](use-pull-to-refresh.md).

## Usage

### `useIsStandalone()`

```ts
useIsStandalone(): boolean
```

True when running as an installed PWA (added to the home screen):
`(display-mode: standalone)` matches, or iOS Safari's
`navigator.standalone === true`. A hook: call it at the top of a component,
not inside a condition, loop or event handler, and pass the result down. It
subscribes to the display-mode query, so the component re-renders if the mode
changes. During server rendering it returns `false` without touching `window`;
on the client it corrects itself after hydration.

```tsx
const standalone = useIsStandalone();
return standalone ? <TopFade /> : null;
```

Use it to gate chrome that only makes sense when installed: `TopFade` and a
pull-to-refresh indicator ([`usePullToRefresh`](use-pull-to-refresh.md#a-pull-to-refresh-indicator)).

## Do / don't

- Do gate pull-to-refresh UI on `useIsStandalone()`; browser tabs have their own.
- Don't call it inside `&&` or an `if`: read it once at the top, then branch on the value.

<!-- generated:examples -->

## Examples

### useIsStandalone

True only in the installed app (added to the home screen). Here, in a browser tab, it is
false. Gate install-only chrome such as `TopFade` and a pull-to-refresh indicator on it.

```tsx
import { Card, Text } from '@korzun/design/component';
import { useIsStandalone } from '@korzun/design/hooks';

export default function IsStandalone() {
  const standalone = useIsStandalone();
  return (
    <Card title="Installed app">
      <Text>
        <code>useIsStandalone()</code> is {String(standalone)}
      </Text>
    </Card>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

This module takes no props; see Usage for its API.

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

This module has no styles of its own.

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): **Breaking:** `isStandalone()` is now the hook `useIsStandalone()`, built on `useSyncExternalStore`. Call it at the top of a component and branch on its value (`const standalone = useIsStandalone();` then `{standalone && <TopFade />}`), not inside a condition or callback. It re-renders when the display mode changes and returns `false` during server rendering instead of throwing on `window`.
- **0.0.1** (2026-11-15): Hooks: `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone`.

<!-- /generated:changelog -->
