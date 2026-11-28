---
title: useMinimizeOnScroll
description: Minimizes bottom chrome on a fast scroll down and expands it on the way back up, like the iOS tab bar.
category: Hooks
---
# useMinimizeOnScroll

<!-- generated:import -->

```ts
import {
  EXPAND_AFTER,
  MINIMIZE_SPEED,
  useMinimizeOnScroll,
  type MinimizeOnScroll,
} from '@korzun/design/hooks';
```

<!-- /generated:import -->

Minimizes bottom chrome on a fast scroll down and expands it on the way back
up, like the iOS tab bar. Part of the mobile-chrome behaviour shared by the
layout components, with [`isStandalone`](is-standalone.md) and
[`usePullToRefresh`](use-pull-to-refresh.md). It reads the **window**
scroller; it does nothing for content scrolling in an inner `overflow: auto`
element.

## Usage

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

## Do / don't

- Don't call `useMinimizeOnScroll` for the bar `NavMobile` already manages.
- Don't expect it to track a nested scroll container.

<!-- generated:examples -->

## Examples

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

<!-- /generated:examples -->

<!-- generated:props -->

## Props

### MinimizeOnScroll

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `expand` (required) | `() => void` |  | Expand the bar now (a tap on the minimized bar), as if the page had scrolled up. |
| `minimized` (required) | `boolean` |  | Whether the bar is currently minimized. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

This module has no styles of its own.

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.0.1** (2026-11-15): Hooks: `useMinimizeOnScroll`, `usePullToRefresh`, `isStandalone`.

<!-- /generated:changelog -->
