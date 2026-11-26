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
installed app: the switch stands in for the `isStandalone()` check.

```tsx
import { Stack, Text, TopFade } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [installed, setInstalled] = useState(true);
  return (
    <>
      {installed && <TopFade />}
      <Stack>
        <Text>Scroll content under the fade band, line 1.</Text>
        <Text>Scroll content under the fade band, line 2.</Text>
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
