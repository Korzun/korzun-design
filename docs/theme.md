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

- `ThemeProvider` renders `GlobalStyles`: the page background, the body font,
  a 16px input floor on iOS, scroll lock while a `<dialog>` is open, and the
  `theme-rotation` and `theme-slide-*` keyframes. Don't render
  `GlobalStyles` yourself.
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

`useThemeSetting` returns the choice and its setter; `useTheme().colorScheme` is the mode it resolved to. Pass `ThemeProvider` an `identity` and the choice is saved for that user and restored when they return; with `null` nothing is saved. Switch the identity below and the choice follows it.

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
| `identity` | `string \| null` | `null` | Whose light, dark or auto choice this is, for example the signed-in user's id. The choice is saved per identity in `localStorage` and restored when it comes back; with `null`, nothing is saved and the mode is `'auto'`. |

### Theme

The token object that `useTheme` returns and `createUseStyles` passes to a style function. Every key is described in [tokens](tokens.md).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `breakpoint` (required) | `{ mobile: string; normal: string; }` |  |  |
| `color` (required) | ``{ gray: typeof gray; blue: typeof blue; red: typeof red; text: { primary: string; secondary: string; muted: string; faint: string; onPrimary: string; onDanger: string; description: string; }; bg: { page: string; card: string; cardHeader: string; /** * The rail behind a segmented control's sliding lens. Its own token, not * `cardHeader`, because it must read against BOTH `page` and `card` — and * in dark mode those sit on either side of `cardHeader`, which left the * rail invisible on the page. */ track: string; input: string; footer: string; glass: string; glassFallback: string; glassActive: string; selected: string; hover: string; success: string; placeholder: string; }; border: { default: string; strong: string; light: string; focus: string; hover: string; danger: string; glass: string; glassActive: string; faint: string; loading: string; success: string; section: string; }; success: string; /** Solid warning colour for icons and accents. */ warning: string; /** Solid info colour for icons and accents. */ info: string; brand: { default: string; hover: string; active: string; light: string; outline: string; loading: string; loadingHover: string; loadingActive: string; linkHover: string; }; danger: { default: string; hover: string; active: string; light: string; outline: string; loading: string; loadingHover: string; loadingActive: string; }; overlay: { backdrop: string; }; chip: { status: { text: string; bg: string; border: string; }; author: { text: string; bg: string; border: string; }; series: { text: string; bg: string; border: string; }; subject: { text: string; bg: string; border: string; }; book: { text: string; bg: string; border: string; }; entryType: { text: string; bg: string; border: string; }; user: { text: string; bg: string; border: string; }; rating: { text: string; bg: string; border: string; }; neutral: { text: string; bg: string; border: string; }; success: { text: string; bg: string; border: string; }; warning: { text: string; bg: string; border: string; }; danger: { text: string; bg: string; border: string; }; info: { text: string; bg: string; border: string; }; }; }`` |  |  |
| `colorScheme` (required) | `'light' \| 'dark'` |  |  |
| `fontFamily` (required) | `{ body: string; mono: string; }` |  |  |
| `fontSize` (required) | `{ xxs: string; xs: string; sm: string; md: string; lg: string; xl: string; xxl: string; }` |  |  |
| `fontWeight` (required) | `{ regular: number; medium: number; semibold: number; bold: number; extrabold: number; }` |  |  |
| `layout` (required) | `{ navHeightMobile: string; modalWidth: string; controlHeight: string; floatingControlTopBase: string; }` |  |  |
| `lineHeight` (required) | `{ tight: number; body: number; }` |  |  |
| `radius` (required) | `{ sm: string; md: string; lg: string; circle: string; pill: string; }` |  |  |
| `recipe` (required) | ``{ input: Recipe; focusRing: Recipe; label: Recipe; spinner: Recipe; glass: Recipe; glassHighlight: Recipe; /** The shaded field row (`bg.cardHeader`, `md` corners) a control sits in inside a card. */ row: Recipe; modal: { dialog: Recipe; header: Recipe; footer: Recipe; }; card: { shell: Recipe; header: Recipe; footer: Recipe; }; }`` |  |  |
| `shadow` (required) | `{ card: string; cardStack: string; hoverLift: string; dangerStack: string; brandStack: string; glass: string; glassActive: string; }` |  |  |
| `size` (required) | `{ metadataValue: string; }` |  |  |
| `space` (required) | `{ xxxs:` [SpaceValue](#types)`; xxs:` [SpaceValue](#types)`; xs:` [SpaceValue](#types)`; sm:` [SpaceValue](#types)`; md:` [SpaceValue](#types)`; lg:` [SpaceValue](#types)`; xl:` [SpaceValue](#types)`; xxl:` [SpaceValue](#types)`; xxxl:` [SpaceValue](#types)`; xxxxl:` [SpaceValue](#types)`; xxxxxl:` [SpaceValue](#types)`; }` |  |  |
| `transition` (required) | `{ fast: string; medium: string; slide: string; slow: string; spring: string; }` |  |  |
| `zIndex` (required) | `{ behind: number; base: number; stack: { lo: number; md: number; hi: number; }; header: number; sticky: number; toast: number; }` |  |  |

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

- **0.2.0** (2026-11-21): New `fontWeight.regular` (400) token.
- **0.1.0** (2026-11-21): `Tag` status tones: `success`, `warning` (yellow, stronger fill), `danger`, `info` (brand blue). New `color.warning` and `color.info` solid colours. Status tones report state; label tones name things. No visual change to existing tags.
- **0.0.6** (2026-11-21): New `theme.recipe.row`: the shaded field row (`bg.cardHeader`, `radius.md`, padding `md lg md sm`), for custom rows beside form fields. `Switch`'s horizontal layout now uses it and looks the same.
- **0.0.3** (2026-11-21): New `color.chip.neutral` token: a quiet grey built from each mode's muted text colour (light 0.08 / 0.22 alphas, dark 0.16 / 0.30, matching the other chips in each mode).
- **0.0.1** (2026-11-15): Theme tokens and light/dark themes; `ThemeProvider` takes an `identity` prop (replaces Bookplate's token coupling).

<!-- /generated:changelog -->
