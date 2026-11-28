---
title: NavMobile
description: The app's bottom navigation on phones: two frosted pills, one expanded into tabs and one a circle.
category: Navigation
---
# NavMobile

<!-- generated:import -->

`import { NavMobile, type NavMobileProps, type NavPill } from '@korzun/design/component'`

<!-- /generated:import -->

The app's bottom navigation on phones: a `position: fixed` bar floating above
the bottom edge, holding two frosted-glass pills. The **expanded** side is a
capsule of tabs with a glass lens sliding to the active one; the other side is
a circle that links to a single destination. Scrolling down fast minimizes the
expanded side to a circle too (iOS-tab-bar style); scrolling up, reaching the
top, tapping the circle, or a route change brings it back. Hidden at
`min-width: 641px`, so render it alongside `NavDesktop`. Uses react-router
`Link` and `useLocation`, so it **must render inside a router**.

Use something else for: desktop navigation (`NavDesktop`), page actions
(`Page` `headerActions` / `footerActions`).

## Usage

### Sides and items

Each side is a `NavPill`: `items` are its tabs while it is the `expanded` side,
and `collapsed` is the one destination its circle links to. A tab is a
`NavItem`, documented with [NavDesktop](nav-desktop.md#navitem); tab icons are
drawn at 14px. Derive `expanded` and every `active` from the route in one place (`main` and `settingsItems` are `NavItem[]` lists as in [Expanded side](#expanded-side)):

```tsx
const { pathname } = useLocation();
const inSettings = pathname === '/settings' || pathname === '/users';

<NavMobile
  main={{ items: main, collapsed: { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false } }}
  settings={{ items: settingsItems, collapsed: { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: pathname === '/settings' } }}
  expanded={inSettings ? 'settings' : 'main'}
/>
```

### Styling

No `className`.

### Behaviour to know

- **The page must make room for it:** pass `bottomNav` to every `<Page>` that
  shows this bar, or the last rows sit under it. Toasts already clear it on
  mobile.
- Tabs are equal-width columns sized to the widest label. Five short labels fit
  at 320px; six do not (Bookplate measured "Library"/"Settings" clipping), so
  move extra destinations into the other side.
- The minimized circle is a `<button aria-label="Show navigation">`, not a
  link: tapping it only re-expands the bar. It shows the active tab's icon (or
  `collapsed.Icon` when no tab is active) and the active tab's badge, else a
  dot if any hidden sibling has a badge.
- Minimizing only reacts to user-driven scroll (after a touch or wheel on this
  route), so scroll restoration on navigation never minimizes it. Tuning
  constants live in [`useMinimizeOnScroll`](../hooks/use-minimize-on-scroll.md) (`MINIMIZE_SPEED`, `EXPAND_AFTER`).
- Hidden shapes are `inert` and `aria-hidden`; only what is on screen is in
  the tab order.
- A side with `items: []` is a circle for good (Bookplate does this for a
  non-admin's settings side).

## Do / don't

- Do render it once, in the layout route, next to `NavDesktop`.
- Do set `bottomNav` on each `Page` under that layout.
- Do drive `expanded` from the URL so Back behaves.
- Don't keep more than about five tabs on one side.
- Don't also call `useMinimizeOnScroll` for the same bar; NavMobile owns it.

<!-- generated:examples -->

## Examples

### Basic

The bar floats above the bottom edge: the `main` side is a capsule of tabs with
a lens on the active one, and `settings` is a circle linking to its `collapsed`
destination.

```tsx
import { Card, NavMobile, Page, Text, type NavItem } from '@korzun/design/component';
import { BookIcon, HomeIcon, ListCheckIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';

const items: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: true },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
  { to: '/request', label: 'Request', Icon: ListCheckIcon, active: false },
];
const home: NavItem = { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false };
const settings: NavItem = { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false };

export default function Basic() {
  return (
    <>
      <Page bottomNav>
        <Card title="Library">
          <Text>Your books are listed here.</Text>
        </Card>
      </Page>
      <NavMobile
        main={{ items, collapsed: home }}
        settings={{ items: [], collapsed: settings }}
        expanded="main"
      />
    </>
  );
}
```

### Expanded side

`expanded` picks the side that is a capsule; the other side becomes a circle
linking to its `collapsed` destination. In an app you derive it from the route,
here the buttons stand in for it.

```tsx
import { Card, Inline, NavMobile, Page, Stack, Text, type NavItem } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import {
  AdjustmentsHorizontalIcon,
  BookIcon,
  HomeIcon,
  ListCheckIcon,
  SettingsIcon,
  UploadIcon,
  UsersIcon,
} from '@korzun/design/icon';
import { useState } from 'react';

const main: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: true },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
  { to: '/request', label: 'Request', Icon: ListCheckIcon, active: false },
];
const admin: NavItem[] = [
  { to: '/general', label: 'General', Icon: AdjustmentsHorizontalIcon, active: true },
  { to: '/users', label: 'Users', Icon: UsersIcon, active: false },
];

export default function ExpandedSide() {
  const [expanded, setExpanded] = useState<'main' | 'settings'>('main');
  return (
    <>
      <Page bottomNav>
        <Card title="Navigation">
          <Stack>
            <Inline>
              <Button onClick={() => setExpanded('main')}>Main</Button>
              <Button onClick={() => setExpanded('settings')}>Settings</Button>
            </Inline>
            <Text tone="muted">Expanded: {expanded}</Text>
          </Stack>
        </Card>
      </Page>
      <NavMobile
        main={{
          items: main,
          collapsed: { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false },
        }}
        settings={{
          items: admin,
          collapsed: { to: '/general', label: 'Settings', Icon: SettingsIcon, active: false },
        }}
        expanded={expanded}
      />
    </>
  );
}
```

### Badges

A tab's `badge` shows on its icon, and the `collapsed` item's `badge` shows
only while its side is a circle. An empty `items` makes a side a circle for
good.

```tsx
import { Card, Inline, NavMobile, Page, Stack, Text, type NavItem } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { BookIcon, HomeIcon, ListCheckIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Badges() {
  const [pending, setPending] = useState(3);
  const items: NavItem[] = [
    { to: '/library', label: 'Library', Icon: BookIcon, active: true },
    { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false, badge: pending },
    { to: '/request', label: 'Request', Icon: ListCheckIcon, active: false, badge: 'dot' },
  ];
  return (
    <>
      <Page bottomNav>
        <Card title="Navigation">
          <Stack>
            <Inline>
              <Button onClick={() => setPending((n) => n + 1)}>Add a fix</Button>
              <Button onClick={() => setPending(0)}>Clear fixes</Button>
            </Inline>
            <Text tone="muted">Pending fixes: {pending}</Text>
          </Stack>
        </Card>
      </Page>
      <NavMobile
        main={{
          items,
          collapsed: { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false },
        }}
        settings={{
          items: [],
          collapsed: {
            to: '/settings',
            label: 'Settings',
            Icon: SettingsIcon,
            active: false,
            badge: 'dot',
          },
        }}
        expanded="main"
      />
    </>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `expanded` (required) | `'main' \| 'settings'` |  | Which side is the capsule; the other is a circle. Derive it from the route. |
| `main` (required) | [NavPill](#navpill) |  | The left-hand side: the app's main destinations. |
| `settings` (required) | [NavPill](#navpill) |  | The right-hand side: settings, or an account or admin group. |

### NavPill

One side of the bar. Both its shapes, the capsule of `items` and the circle for `collapsed`, are always rendered, so the pill morphs between them instead of cross-fading.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` (required) | [NavItem](../component/nav-desktop.md#navitem) |  | The single destination the side collapses to. Its `label` is the circle's `aria-label` and its `Icon` is drawn at 18px; its `badge` shows only while collapsed and its `active` lights the circle. |
| `items` (required) | [NavItem](../component/nav-desktop.md#navitem)`[]` |  | Destinations shown while this side is expanded. `[]` makes the side a circle for good. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.normal` | `@media (min-width: 641px)` | `@media (min-width: 641px)` |
| `theme.color.bg.page` | `#F6F6F9` | `#242527` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.radius.pill` | `999px` | `999px` |
| `theme.recipe.glass` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.glassHighlight` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xl` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |
| `theme.space.xxxl` | `1.25rem` | `1.25rem` |
| `theme.transition.fast` | `0.1s ease-in` | `0.1s ease-in` |
| `theme.transition.spring` | `0.35s cubic-bezier(0.4, 0, 0.2, 1)` | `0.35s cubic-bezier(0.4, 0, 0.2, 1)` |
| `theme.zIndex.sticky` | `1000` | `1000` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
