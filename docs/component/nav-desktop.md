---
title: NavDesktop
description: The app's top navigation on wide screens: a centred row of icon and label links with the active one underlined.
category: Navigation
---
# NavDesktop

<!-- generated:import -->

`import { NavDesktop, type NavDesktopProps, type NavItem } from '@korzun/design/component'`

<!-- /generated:import -->

The app's top navigation on wide screens: a centred row of icon + label links
on the page background, the active one underlined. Hidden below the mobile
breakpoint (`max-width: 640px`), so render it alongside `NavMobile` and let CSS
pick. Each item is a react-router `<Link>`, so it **must render inside a
router**.

Use something else for: mobile navigation (`NavMobile`), in-page tabs or a
mode switch (`SegmentedControl`), page-level actions (`Page` `headerActions`).

## Usage

### Items

Each item is a `NavItem`, shared with `NavMobile`; its fields are in the
generated tables below. `active` is yours to compute from the route, in one
place, and both navs take the same items:

```tsx
const { pathname } = useLocation();
const items: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: pathname.startsWith('/library') },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: pathname === '/upload', badge: pendingFixes },
];

// In the layout route, above <Outlet />.
<NavDesktop items={items} />
<NavMobile main={{ items, collapsed: items[0] }} settings={…} expanded="main" />
<Outlet />
```

### Styling

No `className`.

### Behaviour to know

- It is **not** fixed or sticky; it is a normal `<header>` in flow at the top
  of the document, so render it before your routes' content.
- Badges are visual only: the count has no accessible label, and a dot has no
  text at all. Put the meaning in `label` if it matters to screen readers.

## Do / don't

- Do render both `NavDesktop` and `NavMobile`; each hides itself at the other's
  breakpoint.
- Do derive `active` from the current route in one place and share the items.
- Don't pass an element as `Icon` (`Icon: <HomeIcon />`); pass the component.
- Don't render it outside a react-router `Router`.

<!-- generated:examples -->

## Examples

### Basic

Icon and label links in a centred row, the active one underlined. `active` is
yours to compute from the route; here Library is the current page.

```tsx
import { NavDesktop, type NavItem } from '@korzun/design/component';
import { BookIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';

const items: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: true },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false },
];

export default function Basic() {
  return <NavDesktop items={items} />;
}
```

### Badges

A positive `badge` number draws a red count on the icon's corner and `0` draws
nothing, so a count can be passed as it is. `'dot'` draws a red dot.

```tsx
import { Inline, NavDesktop, Stack, type NavItem } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { BookIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Badges() {
  const [pending, setPending] = useState(3);
  const items: NavItem[] = [
    { to: '/library', label: 'Library', Icon: BookIcon, active: true },
    { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false, badge: pending },
    { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false, badge: 'dot' },
  ];
  return (
    <Stack>
      <NavDesktop items={items} />
      <Inline>
        <Button onClick={() => setPending((n) => n + 1)}>Add a fix</Button>
        <Button onClick={() => setPending(0)}>Clear fixes</Button>
      </Inline>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | [NavItem](#navitem)`[]` |  | Destinations, rendered in order and keyed by `to`, so each `to` must be unique. |

### NavItem

A single navigation destination, shared by the desktop and mobile layouts.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `active` (required) | `boolean` |  | You compute this, for example from `useLocation().pathname`: the nav does not match routes. Sets `aria-current="page"` and marks the item as current. |
| `badge` | `number \| 'dot'` |  | A positive number draws a red count on the icon's corner and `0` draws nothing. `'dot'` draws a red dot for "active, nothing to decide yet". |
| `Icon` (required) | `(props: IconProps) => ReactElement` |  | An icon component (`HomeIcon`), not an element. Drawn at 14×14 in a tab and 18×18 in a `NavMobile` circle. |
| `label` (required) | `string` |  | Visible text. |
| `to` (required) | `string` |  | Route path passed to react-router `<Link to>`. Must be unique within a list, as it is the key. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.color.bg.page` | `#F6F6F9` | `#242527` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.radius.pill` | `999px` | `999px` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxl` | `1rem` | `1rem` |
| `theme.space.xxxxl` | `1.5rem` | `1.5rem` |
| `theme.zIndex.header` | `10` | `10` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
