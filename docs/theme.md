---
title: Theme
description: ThemeProvider, the light and dark themes, and createUseStyles for writing token-based styles.
category: Theme
---
# Theme

<!-- generated:import -->

```ts
import {
  GlobalStyles,
  ThemeProvider,
  createUseStyles,
  darkTheme,
  lightTheme,
  useTheme,
  useThemeGlobalStyles,
  useThemeSetting,
  type SpaceValue,
  type Theme,
  type ThemeMode,
  type ThemeProviderProps,
  type ThemeSetting,
} from '@korzun/design/theme';
```

<!-- /generated:import -->

Every visual value comes from the theme. App styles use `createUseStyles` (the
same function react-jss exports, re-exported here) with a typed `theme`
argument. Don't add another CSS-in-JS library, and don't write literal colours,
spacing, font sizes, or radii.

Use something else for: a ready-made light/dark/auto picker (`ThemeSetting`),
the full list of token keys ([tokens](tokens.md)).

## Usage

### Setup

```tsx
<ThemeProvider identity={userId /* or null when signed out */}>
  <ToastProvider>{app}</ToastProvider>
</ThemeProvider>
```

- `ThemeProvider` renders `GlobalStyles`: a reset (every element
  `box-sizing: border-box` with no default margin or padding; components are
  sized against it), the page background, the body font,
  a 16px input floor on iOS, scroll lock while a `<dialog>` is open, and the
  `theme-rotation` and `theme-slide-*` keyframes. Don't render
  `GlobalStyles` yourself, or `useThemeGlobalStyles()`, the hook it calls.
- `lightTheme` / `darkTheme` are the two concrete themes (for tests).

### `useThemeSetting()`

```ts
useThemeSetting(): [ThemeSetting, (setting: ThemeSetting) => void]
```

Returns `[setting, setSetting]`, where `ThemeSetting` is `'light' | 'dark' |
'auto'`. `'auto'` follows the OS `prefers-color-scheme` live. The
`ThemeSetting` component is a ready-made picker for it. Without a
`ThemeProvider` above it, the setter does nothing.

### `useTheme()`

```ts
useTheme(): Theme
```

Returns the current `Theme` object, for values needed outside a stylesheet.
`theme.colorScheme` is the mode it resolved to, `'light'` or `'dark'`.

### Writing styles

```ts
// style.ts, next to the component
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { applyTransparency } from '@korzun/design';

export const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    padding: theme.space.md,
    backgroundColor: theme.color.bg.card,
  },
  highlight: { backgroundColor: applyTransparency(theme.color.brand.default, 0.12) },
  [theme.breakpoint.mobile]: { root: { padding: theme.space.sm } },
}));
```

- Style files are for padding, borders, backgrounds, and one-offs (borders come from the border tokens). Lay out with
  `Stack`/`Inline` and set text with `Text`/`Heading`.
- `applyTransparency(color, alpha)` turns a hex or rgb token into an `rgba()`
  string. Use it for tints instead of writing an rgba literal.
- Media queries: use the `theme.breakpoint.mobile` / `.normal` strings as keys.

### Tokens

The token groups (`color`, `space`, `radius`, `fontSize`, `shadow`, `zIndex`,
`breakpoint` and the rest) are listed key by key in [tokens](tokens.md). Use the
semantic tokens, never the primitive `gray`, `blue` and `red` scales. Radii are
chosen by nesting depth; see [corners](corners.md).

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
| `fontWeight` | `regular` 400, `medium` 500, `semibold` 600, `bold` 700, `extrabold` 800 | |
| `lineHeight` | `tight` 1, `body` 1.3 | |
| `fontFamily` | `body`, `mono` | |
| `shadow` | `card`, `cardStack`, `hoverLift`, `dangerStack`, `brandStack`, `glass`, `glassActive` | Floating layers use `hoverLift` |
| `transition` | `fast`, `medium`, `slide`, `slow`, `spring` | Values like `'0.2s ease-in'` |
| `zIndex` | `behind`, `base`, `stack.{lo,md,hi}`, `header`, `sticky`, `toast` | |
| `breakpoint` | `mobile` (≤640px), `normal` | Media query strings |
| `layout` | `navHeightMobile`, `modalWidth`, `controlHeight`, `floatingControlTopBase` | Measured chrome sizes to lay out around |
| `size` | `metadataValue` | |

### Recipes

Recipes are style fragments that you spread into a rule: `{ ...theme.recipe.input }`.

| Recipe | Gives you |
|---|---|
| `recipe.input` | Text-input chrome: font, `md` radius, border, hover and focus colours, iOS 16px floor; `&$danger` turns the border red if your sheet declares a `danger: {}` class |
| `recipe.label` | Field label: semibold, `md`, muted; `&$danger` |
| `recipe.focusRing` | Transparent 2px outline; set `outlineColor: theme.color.brand.outline` on `'&:focus'` |
| `recipe.spinner` | 1em rotating box. `Spinner` is the normal way to show a spinner; use the recipe only for a custom rotating element |
| `recipe.glass` / `glassHighlight` | Frosted translucent surface (floating chrome) and its active state |
| `recipe.row` | The shaded field row a control sits in inside a card: `bg.cardHeader`, `md` corners, padding `md lg md sm`. Use it for custom rows next to form fields |
| `recipe.card.shell` / `header` / `footer` | The Card surface (`lg`), its header bar, and its footer bar |
| `recipe.modal.dialog` / `header` / `footer` | A `<dialog>` surface (`lg`, shared width, backdrop), its title, and its button bar |

Recipes that use `$name` references need an empty class with that name in the
same sheet (`danger: {}`).

## Do / don't

- Do style with `theme.*` tokens and `createUseStyles`.
- Do use `applyTransparency` for a tint instead of an rgba literal.
- Don't render `GlobalStyles` yourself; `ThemeProvider` does.
- Don't use the primitive `gray`, `blue` and `red` scales in app code.

<!-- generated:examples -->

## Examples

### Writing styles

`createUseStyles` takes a function of the typed `theme`, so spacing, colours and corners all come from tokens. `applyTransparency` tints a token, and the `theme.breakpoint.mobile` string keys a media query. The Button counts the picks the tinted row shows.

```tsx
import { applyTransparency } from '@korzun/design';
import { Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    padding: theme.space.xxl,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.lg,
  },
  highlight: {
    padding: theme.space.md,
    backgroundColor: applyTransparency(theme.color.brand.default, 0.12),
    borderRadius: theme.radius.md,
  },
  [theme.breakpoint.mobile]: { panel: { padding: theme.space.md } },
}));

export default function Styles() {
  const styles = useStyle();
  const [picks, setPicks] = useState(0);
  return (
    <div className={styles.panel}>
      <Stack gap="md" align="start">
        <div className={styles.highlight}>
          <Text>Picked {picks} times</Text>
        </div>
        <Button onClick={() => setPicks((n) => n + 1)}>Pick</Button>
      </Stack>
    </div>
  );
}
```

### Light, dark or auto

`useThemeSetting` returns the choice and its setter; `useTheme().colorScheme` is the mode it resolved to. Pass the app's root `ThemeProvider` an `identity` and the choice is saved for that user and restored when they return; with `null` nothing is saved. Switch the identity below and the choice follows it.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ThemeProvider, useTheme, useThemeSetting, type ThemeSetting } from '@korzun/design/theme';
import { useState } from 'react';

const settings: ThemeSetting[] = ['light', 'dark', 'auto'];

const Picker = ({ identity }: { identity: string | null }) => {
  const [setting, setSetting] = useThemeSetting();
  const theme = useTheme();
  return (
    <Stack gap="md" align="start">
      <Text tone="muted">
        {identity === null ? 'Signed out' : `Signed in as ${identity}`}: setting {setting}, mode{' '}
        {theme.colorScheme}
      </Text>
      <Inline>
        {settings.map((next) => (
          <Button
            key={next}
            type={setting === next ? 'primary' : 'default'}
            onClick={() => setSetting(next)}
          >
            {next}
          </Button>
        ))}
      </Inline>
    </Stack>
  );
};

export default function Setting() {
  const [identity, setIdentity] = useState<string | null>('ada');
  return (
    <ThemeProvider identity={identity}>
      <Stack gap="lg" align="start">
        <Picker identity={identity} />
        <Inline>
          <Button onClick={() => setIdentity(identity === null ? 'ada' : null)}>
            {identity === null ? 'Sign in' : 'Sign out'}
          </Button>
        </Inline>
      </Stack>
    </ThemeProvider>
  );
}
```

### Values outside a stylesheet

`useTheme` returns the current `Theme` for a value a stylesheet cannot take, such as a label or a chart option. `lightTheme` and `darkTheme` are the two concrete themes, handy in tests. Pick one to read the same tokens from it.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { darkTheme, lightTheme, useTheme } from '@korzun/design/theme';
import { useState } from 'react';

export default function Values() {
  const current = useTheme();
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const picked = mode === 'light' ? lightTheme : darkTheme;
  return (
    <Stack gap="md" align="start">
      <Text>Page background here: {current.color.bg.page}</Text>
      <Inline>
        <Button type={mode === 'light' ? 'primary' : 'default'} onClick={() => setMode('light')}>
          lightTheme
        </Button>
        <Button type={mode === 'dark' ? 'primary' : 'default'} onClick={() => setMode('dark')}>
          darkTheme
        </Button>
      </Inline>
      <Text tone="muted">
        {picked.colorScheme}: page {picked.color.bg.page}, text {picked.color.text.primary}
      </Text>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | The app. |
| `identity` | `string \| null` | `null` | Whose light, dark or auto choice this is, for example the signed-in user's id. The choice is saved per identity in `localStorage` under `theme-setting:<identity>` and restored when it comes back; with `null`, nothing is saved and the mode is `'auto'`. |

### Theme

The token object that `useTheme` returns and `createUseStyles` passes to a style function. Every key is described in [tokens](tokens.md).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `breakpoint` (required) | `{ mobile: string; normal: string; }` |  |  |
| `color` (required) | `{ gray, blue, red, text, bg, border, success, warning, info, brand, danger, overlay, chip }` |  |  |
| `colorScheme` (required) | `'light' \| 'dark'` |  |  |
| `fontFamily` (required) | `{ body: string; mono: string; }` |  |  |
| `fontSize` (required) | `{ xxs: string; xs: string; sm: string; md: string; lg: string; xl: string; xxl: string; }` |  |  |
| `fontWeight` (required) | `{ regular: number; medium: number; semibold: number; bold: number; extrabold: number; }` |  |  |
| `layout` (required) | `{ navHeightMobile: string; modalWidth: string; controlHeight: string; floatingControlTopBase: string; }` |  |  |
| `lineHeight` (required) | `{ tight: number; body: number; }` |  |  |
| `radius` (required) | `{ sm: string; md: string; lg: string; circle: string; pill: string; }` |  |  |
| `recipe` (required) | `{ input, focusRing, label, spinner, glass, glassHighlight, row, modal, card }` |  |  |
| `shadow` (required) | `{ card, cardStack, hoverLift, dangerStack, brandStack, glass, glassActive }` |  |  |
| `size` (required) | `{ metadataValue: string; }` |  |  |
| `space` (required) | `{ xxxs, xxs, xs, sm, md, lg, xl, xxl, xxxl, xxxxl, xxxxxl }` |  |  |
| `transition` (required) | `{ fast: string; medium: string; slide: string; slow: string; spring: string; }` |  |  |
| `zIndex` (required) | `{ behind: number; base: number; stack: { … }; header: number; sticky: number; toast: number; }` |  |  |

### Types

```ts
/** A rem length, so a space value can feed props that only accept rem (Popover `gap`). */
type SpaceValue = `${number}rem`;
type ThemeMode = 'light' | 'dark';
/** The user's appearance choice; `'auto'` follows the operating system. */
type ThemeSetting = 'light' | 'dark' | 'auto';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

This module has no styles of its own.

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.6.0** (2026-11-26): `GlobalStyles` (rendered by `ThemeProvider`) ships the reset the components are drawn against: every element is `box-sizing: border-box` with no default margin or padding, as in Bookplate's and Scribe's `index.html`. Without it a text field was 51px tall instead of `layout.controlHeight` (33px). An app that already carries this reset sees no change; one that relied on browser default margins (`p`, `h1`, `ul`) loses them.
- **0.2.0** (2026-11-21): New `fontWeight.regular` (400) token.
- **0.1.0** (2026-11-21): `Tag` status tones: `success`, `warning` (yellow, stronger fill), `danger`, `info` (brand blue). New `color.warning` and `color.info` solid colours. Status tones report state; label tones name things. No visual change to existing tags.
- **0.0.6** (2026-11-21): New `theme.recipe.row`: the shaded field row (`bg.cardHeader`, `radius.md`, padding `md lg md sm`), for custom rows beside form fields. `Switch`'s horizontal layout now uses it and looks the same.
- **0.0.3** (2026-11-21): New `color.chip.neutral` token: a quiet grey built from each mode's muted text colour (light 0.08 / 0.22 alphas, dark 0.16 / 0.30, matching the other chips in each mode).
- **0.0.1** (2026-11-15): Theme tokens and light/dark themes; `ThemeProvider` takes an `identity` prop (replaces Bookplate's token coupling).

<!-- /generated:changelog -->
