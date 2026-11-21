# NavDesktop

`import { NavDesktop, type NavDesktopProps, type NavItem } from '@korzun/design/component'`

The app's top navigation on wide screens: a centred row of icon + label links
on the page background, the active one underlined. Hidden below the mobile
breakpoint (`max-width: 640px`), so render it alongside `NavMobile` and let CSS
pick. Each item is a react-router `<Link>`, so it **must render inside a
router**.

Use something else for: mobile navigation (`NavMobile`), in-page tabs or a
mode switch (`SegmentedControl`), page-level actions (`Page` `headerActions`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `NavItem[]` | required | Rendered in order; keyed by `to`, so `to` must be unique. |

`NavItem` (shared with `NavMobile`):

| Field | Type | Notes |
|---|---|---|
| `to` | `string` | Route path passed to `<Link to>`. |
| `label` | `string` | Visible text. |
| `Icon` | `(props: IconProps) => ReactElement` | An icon **component** (`HomeIcon`), drawn at 14×14. |
| `active` | `boolean` | **You compute this** (e.g. from `useLocation().pathname`); the nav does not match routes. Sets `aria-current="page"` and the underline. |
| `badge` | `number \| 'dot'` | Optional. A positive number draws a red count on the icon's corner; `'dot'` a red dot ("active, nothing to decide yet"). `0` draws nothing. |

No `className`.

## Surprising behaviour

- It is **not** fixed or sticky (despite its source comment); it is a normal
  `<header>` in flow at the top of the document, so render it before your
  routes' content.
- Badges are visual only: the count has no accessible label, and a dot has no
  text at all. Put the meaning in `label` if it matters to screen readers.

## Examples

```tsx
const { pathname } = useLocation();
const items: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: pathname.startsWith('/library') },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: pathname === '/upload', badge: pendingFixes || undefined },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: pathname === '/settings' },
];

// In the layout route, above <Outlet />.
<NavDesktop items={items} />
<NavMobile main={{ items, collapsed: items[0] }} settings={…} expanded="main" />
<Outlet />
```

## Do / don't

- Do render both `NavDesktop` and `NavMobile`; each hides itself at the other's
  breakpoint.
- Do derive `active` from the current route in one place and share the items.
- Don't pass an element as `Icon` (`Icon: <HomeIcon />`); pass the component.
- Don't render it outside a react-router `Router`.
