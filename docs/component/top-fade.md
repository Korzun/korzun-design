---
title: TopFade
description: A decorative, mobile-only frosted scrim at the top of the viewport that blurs content scrolling under the status bar.
category: Layout
---
# TopFade

<!-- generated:import -->

`import { TopFade, type TopFadeProps } from '@korzun/design/component'`

<!-- /generated:import -->

A decorative, mobile-only scrim: a `position: fixed` frosted-glass band at the
top of the viewport, as tall as the status-bar safe-area inset plus
`space.md`, that blurs content scrolling under the device status bar and fades
to nothing below it (Safari style). It is `aria-hidden`,
`pointer-events: none`, and hidden at `min-width: 641px`.

Use something else for: a header or toolbar (`Page` header row / actions),
dimming behind a modal (the modal's own backdrop).

## Usage

### When to render it

- **Only in the installed (standalone) app**, gated with `isStandalone()` from
  `@korzun/design/hooks`. In a browser tab the OS status bar is not drawn over
  the page, `env(safe-area-inset-top)` is 0, and the band would be a thin
  blurred strip with no purpose.
- Once, in the layout route, not per page.
- It sits at `theme.zIndex.header`: above page content, below the floating
  controls and nav (`zIndex.sticky`).

```tsx
// Layout route for nav-bearing pages.
export const NavLayout = () => (
  <>
    <NavDesktop items={items} />
    <NavMobile main={…} settings={…} expanded={…} />
    {isStandalone() && (
      <>
        <TopFade />
        <PullToRefreshIndicator /> {/* your own, built on usePullToRefresh */}
      </>
    )}
    <Outlet />
  </>
);
```

### Behaviour

- It takes no props and no `className`.
- Its height comes from `env(safe-area-inset-top)`, which is non-zero only when
  the page opts into the safe area (`<meta name="viewport"
  content="…, viewport-fit=cover">`). Without that it is `space.md` tall.
- The tail is deliberately short so chrome resting near the top edge
  (`theme.layout.floatingControlTopBase`) is never drawn through the blur.
  Don't place your own content in the first `space.md` below the inset.

## Do / don't

- Do gate it on `isStandalone()`.
- Do render it once per app layout.
- Don't use it as a visual header; it carries no content and ignores clicks.

<!-- generated:examples -->

## Examples

### Basic

A frosted band fixed to the top of the viewport that blurs content under the
device status bar and fades to nothing below it. Render it only in the
installed app: the switch stands in for the `isStandalone()` check. A browser
has no status-bar inset, so the band is only `space.md` tall here: the striped
strip pinned to the top stands in for content scrolled up under it, and its top
edge blurs while the switch is on.

```tsx
import { Stack, Tag, Text, TopFade } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyles = createUseStyles((theme: Theme) => ({
  // Page content that has scrolled up under the status bar, pinned there for the demo.
  scrolled: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.base,
    display: 'flex',
    gap: theme.space.xs,
    padding: theme.space.xs,
    backgroundImage: `repeating-linear-gradient(90deg, ${theme.color.brand.default} 0 ${theme.space.xl}, ${theme.color.chip.subject.bg} ${theme.space.xl} ${theme.space.xxxxxl})`,
  },
  // Clear of the pinned strip.
  content: { paddingTop: theme.space.xxxxxl },
}));

export default function Basic() {
  const styles = useStyles();
  const [installed, setInstalled] = useState(true);
  return (
    <>
      <div className={styles.scrolled}>
        <Tag tone="author">George Eliot</Tag>
        <Tag tone="subject">Fiction</Tag>
      </div>
      {installed && <TopFade />}
      <Stack className={styles.content}>
        <Text>Scrolled content under the band blurs, then fades to sharp below it.</Text>
        <Switch
          name="installed"
          label="Installed app"
          checked={installed}
          onChange={setInstalled}
        />
      </Stack>
    </>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

### Types

```ts
/** TopFade takes no props. */
type TopFadeProps = Record<string, never>;
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.normal` | `@media (min-width: 641px)` | `@media (min-width: 641px)` |
| `theme.color.bg.glass` | `rgba(255, 255, 255, 0.6)` | `rgba(28, 28, 30, 0.6)` |
| `theme.color.bg.glassFallback` | `rgba(255, 255, 255, 0.92)` | `rgba(28, 28, 30, 0.92)` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.zIndex.header` | `10` | `10` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
