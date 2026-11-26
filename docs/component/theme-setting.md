---
title: ThemeSetting
description: A ready-made "Appearance" card with a Light, Dark and Auto switch bound to the theme.
category: Theme
---
# ThemeSetting

<!-- generated:import -->

`import { ThemeSetting, type ThemeSettingProps } from '@korzun/design/component'`

<!-- /generated:import -->

A ready-made settings feature: a `Card` titled "Appearance" holding a
three-option `SegmentedControl` (Light / Dark / Auto) bound to the theme. A
choice applies immediately and is persisted by `ThemeProvider`.

Use something else for: reading the current choice or the resolved mode in
your own code (`useThemeSetting` from `@korzun/design/theme`), a custom
appearance UI (build it on `useThemeSetting`).

## Usage

### Props and styling

It takes no props: no `className`, no title override.

### How it works

- Reads and writes through `useThemeSetting()`, i.e. the context provided by
  `ThemeProvider` from `@korzun/design/theme`.
- `ThemeProvider` stores the choice in `localStorage` under
  `theme-setting:<identity>`, where `identity` is the provider's prop (for
  example the signed-in username). Switching identity restores that user's
  choice; without an `identity` (or with `identity={null}`) it **stores
  nothing** and the setting resets to `'auto'` on reload.
- `'auto'` follows the OS `prefers-color-scheme` live.

### Behaviour to know

- **Without a `ThemeProvider` above it, it renders but does nothing**: the
  default context's setter is a no-op.
- **Name clash at the package root:** `@korzun/design` (root entry) exports
  this component as `ThemeSetting` and the `'light' | 'dark' | 'auto'` type as
  `ThemeSettingValue`. From `@korzun/design/theme` the type is named
  `ThemeSetting`. Import the component from `/component` to avoid confusion.

### In an app

Give the provider an identity so the choice persists per user, and place the
setting in a `Page` like any other Card:

```tsx
<ThemeProvider identity={viewer?.username ?? null}>
  <ToastProvider>
    <AppRouter />
  </ToastProvider>
</ThemeProvider>

<Page bottomNav>
  <ThemeSetting />
  <Card title="Change password">…</Card>
</Page>
```

## Do / don't

- Do place it directly in a `Page`, like any other Card.
- Do pass `identity` to `ThemeProvider` if the choice should survive a reload.
- Don't wrap it in another `Card`; it already is one.

<!-- generated:examples -->

## Examples

### Basic

The "Appearance" card applies a choice at once, so the app's colours change with
it. It sits in a `Page` like any other Card. `Auto` follows the system setting, and the readout shows the mode in use.

```tsx
import { Card, Page, Text, ThemeSetting } from '@korzun/design/component';
import { useTheme, useThemeSetting } from '@korzun/design/theme';

export default function Basic() {
  const [setting] = useThemeSetting();
  const { colorScheme } = useTheme();
  return (
    <Page>
      <ThemeSetting />
      <Card title="Preview">
        <Text>
          Choice: {setting}. Mode in use: {colorScheme}.
        </Text>
      </Card>
    </Page>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

### Types

```ts
/** ThemeSetting takes no props. */
type ThemeSettingProps = Record<string, never>;
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

This module has no styles of its own.

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
