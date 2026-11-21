# TopFade

`import { TopFade } from '@korzun/design/component'`

A decorative, mobile-only scrim: a `position: fixed` frosted-glass band at the
top of the viewport, as tall as the status-bar safe-area inset plus
`space.md`, that blurs content scrolling under the device status bar and fades
to nothing below it (Safari style). It is `aria-hidden`,
`pointer-events: none`, and hidden at `min-width: 641px`.

Use something else for: a header or toolbar (`Page` header row / actions),
dimming behind a modal (the modal's own backdrop).

## Props

None. No `className`.

## When to render it

- **Only in the installed (standalone) app**, gated with `isStandalone()` from
  `@korzun/design/hooks`. In a browser tab the OS status bar is not drawn over
  the page, `env(safe-area-inset-top)` is 0, and the band would be a thin
  blurred strip with no purpose.
- Once, in the layout route, not per page.
- It sits at `theme.zIndex.header`: above page content, below the floating
  controls and nav (`zIndex.sticky`).

## Surprising behaviour

- Its height comes from `env(safe-area-inset-top)`, which is non-zero only when
  the page opts into the safe area (`<meta name="viewport"
  content="…, viewport-fit=cover">`). Without that it is `space.md` tall.
- The tail is deliberately short so chrome resting near the top edge
  (`theme.layout.floatingControlTopBase`) is never drawn through the blur.
  Don't place your own content in the first `space.md` below the inset.

## Examples

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

## Do / don't

- Do gate it on `isStandalone()`.
- Do render it once per app layout.
- Don't use it as a visual header; it carries no content and ignores clicks.
