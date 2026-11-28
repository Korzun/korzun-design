---
title: isStandalone
description: True when running as the installed app (added to the home screen); gates install-only chrome.
category: Hooks
---
# isStandalone

<!-- generated:import -->

`import { isStandalone } from '@korzun/design/hooks'`

<!-- /generated:import -->

True when running as the installed app (added to the home screen). Part of the
mobile-chrome behaviour shared by the layout components, with
[`useMinimizeOnScroll`](use-minimize-on-scroll.md) and
[`usePullToRefresh`](use-pull-to-refresh.md).

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
pull-to-refresh indicator ([`usePullToRefresh`](use-pull-to-refresh.md#a-pull-to-refresh-indicator)).

## Do / don't

- Do gate pull-to-refresh UI on `isStandalone()`; browser tabs have their own.

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

- **0.0.1** (2026-11-15): Hooks: `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone`.

<!-- /generated:changelog -->
