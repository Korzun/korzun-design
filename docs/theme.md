# Theme

`import { ThemeProvider, useTheme, createUseStyles, type Theme } from '@korzun/design/theme'`

Every visual value comes from the theme. App styles use `createUseStyles` (the
same function react-jss exports, re-exported here) with a typed `theme`
argument. Don't add another CSS-in-JS library, and don't write literal colours,
spacing, font sizes, or radii.

## Setup

```tsx
<ThemeProvider identity={userId /* or null when signed out */}>
  <ToastProvider>{app}</ToastProvider>
</ThemeProvider>
```

- `identity?: string | null` (default `null`) scopes the saved light/dark/auto
  choice to `localStorage['theme-setting:<identity>']`. With `null`, nothing is
  stored and the mode is `auto`.
- `ThemeProvider` renders `GlobalStyles`: the page background, the body font,
  a 16px input floor on iOS, scroll lock while a `<dialog>` is open, and the
  `theme-rotation` and `theme-slide-*` keyframes. Don't render
  `GlobalStyles` yourself.
- `useThemeSetting()` returns `[setting, setSetting]` (`'light' | 'dark' |
  'auto'`). The `ThemeSetting` component is a ready-made picker for it.
- `useTheme()` returns the current `Theme` object, for values needed outside a
  stylesheet.
- `lightTheme` / `darkTheme` are the two concrete themes (for tests).

## Writing styles

```ts
// style.ts, next to the component
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { applyTransparency } from '@korzun/design';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.md,
    color: theme.color.text.primary,
  },
  hint: { fontSize: theme.fontSize.sm, color: theme.color.text.muted },
  highlight: { backgroundColor: applyTransparency(theme.color.brand.default, 0.12) },
  [theme.breakpoint.mobile]: { root: { gap: theme.space.sm } },
}));
```

- `applyTransparency(color, alpha)` turns a hex or rgb token into an `rgba()`
  string. Use it for tints instead of writing an rgba literal.
- Media queries: use the `theme.breakpoint.mobile` / `.normal` strings as keys.

## Tokens

| Group | Keys | Notes |
|---|---|---|
| `color.text` | `primary`, `secondary`, `muted`, `faint`, `description`, `onPrimary`, `onDanger` | `muted` for labels and meta, `faint` for placeholders |
| `color.bg` | `page`, `card`, `cardHeader`, `track`, `input`, `footer`, `glass`, `glassFallback`, `glassActive`, `selected`, `hover`, `success`, `placeholder` | `cardHeader` is also the shaded-row and inset-box fill; `hover` is a translucent scrim |
| `color.border` | `default`, `strong`, `light`, `focus`, `hover`, `danger`, `glass`, `glassActive`, `faint`, `loading`, `success`, `section` | Cards and dividers use `strong`; inputs use `default` |
| `color.brand` | `default`, `hover`, `active`, `light`, `outline`, `loading*`, `linkHover` | The primary action colour |
| `color.danger` | `default`, `hover`, `active`, `light`, `outline`, `loading*` | Destructive actions and errors |
| `color.success` | (a string) | Solid green |
| `color.warning` | (a string) | Solid amber |
| `color.info` | (a string) | Solid blue, the mode's `brand.default` |
| `color.chip.<tone>` | `{ text, bg, border }` for 13 tones. Status tones: `success`, `warning`, `danger`, `info`, `neutral`. Label tones: `status`, `author`, `series`, `subject`, `book`, `entryType`, `user`, `rating` | Used by `Tag` |
| `color.overlay` | `backdrop` | Modal backdrop |
| `color.gray` / `blue` / `red` | primitive scales | Don't use these in app code; use the semantic tokens above |
| `space` | `xxxs` 0.1rem, `xxs` 0.125, `xs` 0.25, `sm` 0.375, `md` 0.5, `lg` 0.625, `xl` 0.75, `xxl` 1, `xxxl` 1.25, `xxxxl` 1.5, `xxxxxl` 2rem | `md` is the default gap between stacked fields |
| `radius` | `sm` 4px, `md` 8px, `lg` 16px, `circle`, `pill` | Chosen by nesting depth; see [corners](corners.md) |
| `fontSize` | `xxs` 0.6rem, `xs` 0.7, `sm` 0.75, `md` 0.875, `lg` 1, `xl` 1.25, `xxl` 1.75rem | Control text is `'0.80rem'`, the one sanctioned literal (already applied by `recipe.input` and Button) |
| `fontWeight` | `medium` 500, `semibold` 600, `bold` 700, `extrabold` 800 | |
| `lineHeight` | `tight` 1, `body` 1.3 | |
| `fontFamily` | `body`, `mono` | |
| `shadow` | `card`, `cardStack`, `hoverLift`, `dangerStack`, `brandStack`, `glass`, `glassActive` | Floating layers use `hoverLift` |
| `transition` | `fast`, `medium`, `slide`, `slow`, `spring` | Values like `'0.2s ease-in'` |
| `zIndex` | `behind`, `base`, `stack.{lo,md,hi}`, `header`, `sticky`, `toast` | |
| `breakpoint` | `mobile` (≤640px), `normal` | Media query strings |
| `layout` | `navHeightMobile`, `modalWidth`, `controlHeight`, `floatingControlTopBase` | Measured chrome sizes to lay out around |
| `size` | `metadataValue` | |

## Recipes

Recipes are style fragments that you spread into a rule: `{ ...theme.recipe.input }`.

| Recipe | Gives you |
|---|---|
| `recipe.input` | Text-input chrome: font, `md` radius, border, hover and focus colours, iOS 16px floor; `&$danger` turns the border red if your sheet declares a `danger: {}` class |
| `recipe.label` | Field label: semibold, `md`, muted; `&$danger` |
| `recipe.focusRing` | Transparent 2px outline; set `outlineColor: theme.color.brand.outline` on `'&:focus'` |
| `recipe.spinner` | 1em rotating box; apply to `SpinnerIcon` |
| `recipe.glass` / `glassHighlight` | Frosted translucent surface (floating chrome) and its active state |
| `recipe.row` | The shaded field row a control sits in inside a card: `bg.cardHeader`, `md` corners, padding `md lg md sm`. Use it for custom rows next to form fields |
| `recipe.card.shell` / `header` / `footer` | The Card surface (`lg`), its header bar, and its footer bar |
| `recipe.modal.dialog` / `header` / `footer` | A `<dialog>` surface (`lg`, shared width, backdrop), its title, and its button bar |

Recipes that use `$name` references need an empty class with that name in the
same sheet (`danger: {}`).
