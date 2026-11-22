# Icons

`import { SearchIcon, type IconProps } from '@korzun/design/icon'`

Inline SVG icon components, mostly from [Tabler](https://tabler.io/icons) on a
24×24 view box. Each one paints in `currentColor`, so it takes the text colour
of wherever it sits, in both themes, including hover and selected states.

Use something else for: a determinate progress mark (`ProgressIndicator`), a
loading state on a button (`Button`'s `loading`, which draws the spinner for
you).

## Props (`IconProps`)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `width` / `height` | `number` | `24` / `24` | Pixels. Set both. A `className` with CSS `width`/`height` overrides them. |
| `className` | `string` | `''` | On the `<svg>`. Use for size, colour (`color: …`) or animation. |
| `aria-hidden` | `boolean \| 'true' \| 'false'` | | **Not set by default.** Pass `aria-hidden` for a decorative icon next to text. |
| `aria-label` / `role` | `string` | | For a meaningful standalone icon: `role="img" aria-label="Warning"` (or `role="status"` for a loading spinner). |
| `stroke` | `string` | `'currentColor'` | Stroke icons only. |
| `strokeWidth` | `number` | `2` | Stroke icons only. |
| `fill` | `string` | `'none'` stroke / `'currentColor'` filled | Ignored by `SpinnerIcon` and the emoji icons. |

`defaultStrokeIconProps` and `defaultFilledIconProps` are exported for building
your own icon with the same defaults.

## Sizing and colour

- Size with `width`/`height` props (`<HomeIcon width={14} height={14} />`), or
  with `height: '1em', width: '1em'` in a class so it scales with the text
  (this is what `Button` does for `prefix`/`suffix`).
- Colour by setting `color` on the icon or any ancestor. Don't pass `stroke` or
  `fill` colours; they bypass the theme.

## Passing icons to other components

Components take the icon **component**, never an element:

```tsx
<Button prefix={SearchIcon}>Search</Button>                 // ComponentType<IconProps>
<ConfirmModal icon={AlertOctagonIcon} danger … />
const item: NavItem = { to: '/', label: 'Home', Icon: HomeIcon, active };
options={[{ value: 'grid', label: 'Grid', Icon: BooksIcon }]} // SegmentedControl
```

## Every icon

| Export | Kind | Depicts |
|---|---|---|
| `AdjustmentsHorizontalIcon` | stroke | Three horizontal sliders (general settings, filters). |
| `AlertOctagonIcon` | filled | Octagon with `!` (danger/warning; confirm modals). |
| `BookIcon` | stroke | A single book (Tabler `book-2`). |
| `BooksIcon` | stroke | Books standing on a shelf. |
| `CheckIcon` | filled | A check mark (success). |
| `ChevronCircleIcon` | stroke | Right chevron in a circle (Card's collapse toggle). |
| `ChevronIcon` | stroke | Right-pointing chevron; rotate it via `className` for other directions. |
| `CircleXIcon` | filled | X in a filled circle (clear, error). |
| `ClockIcon` | stroke | Clock face (time, pending). |
| `DeviceIcon` | stroke | A tablet / e-reader (Tabler `device-tablet`). |
| `HandLoveYouIcon` | emoji | 🤟 silhouette (rating 5, "Love"). |
| `HandOkIcon` | emoji | 👌 silhouette (rating 2, "Okay"). |
| `HandPeaceIcon` | emoji | ✌️ silhouette (rating 3, "Nice"). |
| `HandsClapIcon` | emoji | 👏 silhouette (rating 4, "Great"). |
| `HomeIcon` | stroke | A house. |
| `InfoCircleIcon` | filled | `i` in a filled circle (info). |
| `KeyIcon` | stroke | A key (passwords, credentials). |
| `ListCheckIcon` | stroke | Checklist (requests, tasks). |
| `MoreIcon` | stroke | Three horizontal dots (overflow menu). |
| `RowRemoveIcon` | stroke | A table row with an X under it (remove row). |
| `SearchIcon` | stroke | Magnifying glass. |
| `SettingsIcon` | stroke | Gear. |
| `SpinnerIcon` | stroke | A quarter arc. **Does not spin by itself**; use `Spinner` (component) for a ready-made loader. |
| `ThumbDownIcon` | emoji | 👎 silhouette (rating 1, "Bad"). |
| `UploadIcon` | stroke | Arrow up out of a tray. |
| `UserIcon` | stroke | One person. |
| `UsersIcon` | stroke | Two people. |
| `XIcon` | stroke | An X (close, dismiss, error toast). |

Filled icons ignore `stroke`/`strokeWidth`. Emoji icons draw the platform's
colour-emoji glyph as an alpha mask over `currentColor`, so they recolour like
the others but their exact shape depends on the OS emoji font; they ignore
`fill`, `stroke` and `strokeWidth`.

## Examples

```tsx
// Decorative, inline with text.
<CheckIcon width={15} height={15} aria-hidden className={styles.checkIcon} />
Book is valid

// A spinning loader with an accessible name: use `Spinner` from
// `@korzun/design/component`, not a hand-built SpinnerIcon.
<Spinner label="Loading books" />
```

## Do / don't

- Do pass `aria-hidden` when the icon sits next to a text label.
- Do give a standalone meaningful icon `role` and `aria-label`.
- Don't pass `<Icon />` elements where a component is expected.
- Don't import from icon file paths; only `@korzun/design/icon` is exported.
