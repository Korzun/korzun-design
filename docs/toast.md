# Toast

`import { ToastProvider, useToast } from '@korzun/design/toast'`

Short, transient confirmations and errors ("Password changed", "Failed to reset
password") that appear in a corner, stay four seconds, and slide away. Mount
`ToastProvider` once; call the function `useToast()` returns from anywhere
below it.

Use something else for: an error that must stay until the user acts (inline
text near the field, or `EmptyState danger` for a failed load), a question
needing an answer (`ConfirmModal`).

## `ToastProvider`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | required | The app. |
| `maxToasts` | `number` | `3` | When a new toast would exceed this, the oldest starts its exit animation. |

Placement:

- **Inside `ThemeProvider`** (toasts are styled from the theme) and above every
  component that calls `useToast`. Bookplate nests it innermost among its app
  providers, around the router.
- It renders its container itself; you don't place anything in the layout.
  Desktop: bottom-right, `space.xxxxl` from the edges. Mobile: full width just
  above the floating `NavMobile` (and below it in z-order, so toasts slide up
  from behind the bar).
- The container is a `popover="manual"` element shown while any toast is up,
  so toasts appear **above an open modal `<dialog>`** too.

## `useToast()`

```ts
useToast(): (message: string, type: 'success' | 'error' | 'info') => void
```

Returns the **function itself** (not an object): `const showToast = useToast()`.

| Argument | Notes |
|---|---|
| `message` | Plain string. No elements, no actions, no links. |
| `type` | `'success'`: green check. `'error'`: red X, announced `aria-live="assertive"`. `'info'`: brand-blue info icon. Success and info are `polite`. Required; there is no default. |

## Surprising behaviour

- **Without a `ToastProvider` above it, `showToast` silently does nothing**
  (the default context is a no-op). No error is thrown.
- Duration is fixed at 4000ms; there is no per-toast duration, no close
  button, and no tap-to-dismiss.
- Toasts have `radius.md` (a floating layer) per [corners](corners.md).

## Examples

```tsx
// App root.
<ThemeProvider identity={username}>
  <ToastProvider>
    <AppRouter />
  </ToastProvider>
</ThemeProvider>

// A component reporting a mutation's outcome.
const showToast = useToast();
const save = async () => {
  try {
    const result = await changePassword(input);
    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }
    showToast('Password changed', 'success');
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Password change failed', 'error');
  }
};
```

## Do / don't

- Do mount exactly one `ToastProvider`, inside `ThemeProvider`.
- Do keep messages to one short sentence; nothing truncates a long one.
- Don't destructure: `const { showToast } = useToast()` is wrong.
- Don't use a toast for the only copy of an error the user must fix.
