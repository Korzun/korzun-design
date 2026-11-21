# NavMobile

`import { NavMobile, type NavMobileProps, type NavPill, type NavItem } from '@korzun/design/component'`

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

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `main` | `NavPill` | required | Left side: the app's main destinations. |
| `settings` | `NavPill` | required | Right side: settings (or an account/admin group). |
| `expanded` | `'main' \| 'settings'` | required | Which side is the capsule; the other is a circle. Derive it from the route. |

`NavPill` is `{ items: NavItem[]; collapsed: NavItem }`:

- `items`: the tabs shown while that side is expanded. `[]` makes the side
  permanently a circle (Bookplate does this for a non-admin's settings side).
- `collapsed`: the one destination the circle links to. Its `label` becomes the
  circle's `aria-label`, its `Icon` is drawn at 18px, its `badge` shows only
  while the side is actually collapsed, and its `active` lights the circle.

`NavItem` fields (`to`, `label`, `Icon`, `active`, `badge`) are documented in
[NavDesktop](nav-desktop.md); tab icons are drawn at 14px. No `className`.

## Surprising behaviour

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
  constants live in [hooks](../hooks.md) (`MINIMIZE_SPEED`, `EXPAND_AFTER`).
- Hidden shapes are `inert` and `aria-hidden`; only what is on screen is in
  the tab order.

## Examples

```tsx
const { pathname } = useLocation();
const main: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: pathname.startsWith('/library') },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: pathname === '/upload', badge: count || undefined },
  { to: '/request', label: 'Request', Icon: ListCheckIcon, active: pathname === '/request' },
];
const settingsItems: NavItem[] = [
  { to: '/settings', label: 'General', Icon: AdjustmentsHorizontalIcon, active: pathname === '/settings' },
  { to: '/users', label: 'Users', Icon: UsersIcon, active: pathname === '/users' },
];
const inSettings = pathname === '/settings' || pathname === '/users';

<NavMobile
  main={{ items: main, collapsed: { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false } }}
  settings={{ items: settingsItems, collapsed: { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: pathname === '/settings' } }}
  expanded={inSettings ? 'settings' : 'main'}
/>
```

## Do / don't

- Do render it once, in the layout route, next to `NavDesktop`.
- Do set `bottomNav` on each `Page` under that layout.
- Do drive `expanded` from the URL so Back behaves.
- Don't keep more than about five tabs on one side.
- Don't also call `useMinimizeOnScroll` for the same bar; NavMobile owns it.
