# ThemeSetting

`import { ThemeSetting } from '@korzun/design/component'`

A ready-made settings feature: a `Card` titled "Appearance" holding a
three-option `SegmentedControl` (Light / Dark / Auto) bound to the theme. A
choice applies immediately and is persisted by `ThemeProvider`.

Use something else for: reading the current choice or the resolved mode in
your own code (`useThemeSetting` from `@korzun/design/theme`), a custom
appearance UI (build it on `useThemeSetting`).

## Props

None. No `className`, no title override.

## How it works

- Reads and writes through `useThemeSetting()`, i.e. the context provided by
  `ThemeProvider` from `@korzun/design/theme`.
- `ThemeProvider` stores the choice in `localStorage` under
  `theme-setting:<identity>`, where `identity` is the provider's prop (for
  example the signed-in username). Switching identity restores that user's
  choice; without an `identity` (or with `identity={null}`) it **stores
  nothing** and the setting resets to `'auto'` on reload.
- `'auto'` follows the OS `prefers-color-scheme` live.

## Surprising behaviour

- **Without a `ThemeProvider` above it, it renders but does nothing**: the
  default context's setter is a no-op.
- **Name clash at the package root:** `@korzun/design` (root entry) exports
  this component as `ThemeSetting` and the `'light' | 'dark' | 'auto'` type as
  `ThemeSettingValue`. From `@korzun/design/theme` the type is named
  `ThemeSetting`. Import the component from `/component` to avoid confusion.

## Examples

```tsx
// App root: give the provider an identity so the choice persists per user.
<ThemeProvider identity={viewer?.username ?? null}>
  <ToastProvider>
    <AppRouter />
  </ToastProvider>
</ThemeProvider>

// The settings screen: it is one Card in the stack.
<Page bottomNav>
  <ThemeSetting />
  <Card title="Change password">…</Card>
</Page>
```

## Do / don't

- Do place it directly in a `Page`, like any other Card.
- Do pass `identity` to `ThemeProvider` if the choice should survive a reload.
- Don't wrap it in another `Card`; it already is one.
