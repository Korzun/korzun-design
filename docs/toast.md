---
title: Toast
description: Short, transient confirmations and errors that slide in from a corner and leave on their own.
category: Feedback
---
# Toast

<!-- generated:import -->

`import { ToastProvider, useToast, type ToastProviderProps } from '@korzun/design/toast'`

<!-- /generated:import -->

Short, transient confirmations and errors ("Password changed", "Failed to reset
password") that appear in a corner, stay four seconds, and slide away. Mount
`ToastProvider` once; call the function `useToast()` returns from anywhere
below it.

Use something else for: an error that must stay until the user acts (inline
text near the field, or `EmptyState danger` for a failed load), a question
needing an answer (`ConfirmModal`).

## Usage

### `ToastProvider`

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

```tsx
<ThemeProvider identity={username}>
  <ToastProvider>
    <AppRouter />
  </ToastProvider>
</ThemeProvider>
```

### `useToast()`

```ts
useToast(): (message: string, type: 'success' | 'error' | 'info') => void
```

Returns the **function itself** (not an object): `const showToast = useToast()`.

| Argument | Notes |
|---|---|
| `message` | Plain string. No elements, no actions, no links. |
| `type` | `'success'`: green check. `'error'`: red X, announced `aria-live="assertive"`. `'info'`: brand-blue info icon. Success and info are `polite`. Required; there is no default. |

### Behaviour to know

- **Without a `ToastProvider` above it, `showToast` silently does nothing**
  (the default context is a no-op). No error is thrown.
- Duration is fixed at 4000ms; there is no per-toast duration, no close
  button, and no tap-to-dismiss.
- Toasts have `radius.md` (a floating layer) per [corners](corners.md).

### Styling

No `className`. Position, colours and corners come from theme tokens.

## Do / don't

- Do mount exactly one `ToastProvider`, inside `ThemeProvider`.
- Do keep messages to one short sentence; nothing truncates a long one.
- Don't destructure: `const { showToast } = useToast()` is wrong.
- Don't use a toast for the only copy of an error the user must fix.

<!-- generated:examples -->

## Examples

### Basic

`useToast` returns a function that takes a one-line message and a `type`. `success` shows a green check, `error` a red X and is announced assertively, and `info` a blue info icon.

```tsx
import { Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useToast } from '@korzun/design/toast';

export default function Basic() {
  const showToast = useToast();
  return (
    <Inline>
      <Button onClick={() => showToast('Password changed', 'success')}>Success</Button>
      <Button onClick={() => showToast('Failed to reset password', 'error')}>Error</Button>
      <Button onClick={() => showToast('Reading progress syncs when online', 'info')}>Info</Button>
    </Inline>
  );
}
```

### Reporting an outcome

A form submitted from the Card footer reports its result with the function `useToast` returns. A failed save also puts the message in an `ErrorMessage` beside the field, so the toast is never the only copy of an error the user must fix.

```tsx
import { Card, ErrorMessage, Stack } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useToast } from '@korzun/design/toast';
import { useState } from 'react';

export default function FormOutcome() {
  const showToast = useToast();
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const save = () => {
    if (!valid || password.length < 8) {
      const message = 'Password must be at least 8 characters';
      setError(message);
      showToast(message, 'error');
      return;
    }
    setError(undefined);
    showToast('Password changed', 'success');
    setPassword('');
  };
  return (
    <Card
      title="Change password"
      footer={
        <Button type="primary" submit form="change-password">
          Save
        </Button>
      }
    >
      <form
        id="change-password"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <Stack gap="md">
          <TextInput
            name="password"
            label="New password"
            password
            value={password}
            onChange={(next) => setPassword(next ?? '')}
            onValidChange={(_name, ok) => setValid(ok)}
            validate={(next) => next.length >= 8}
          />
          <ErrorMessage>{error}</ErrorMessage>
        </Stack>
      </form>
    </Card>
  );
}
```

### Limiting the stack

`maxToasts` caps how many toasts show at once: when a new one would exceed it, the oldest starts to leave. It goes on the app's one root `ToastProvider`; here the cap is two, so the third click pushes the first toast out.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ToastProvider, useToast } from '@korzun/design/toast';
import { useState } from 'react';

const Sender = () => {
  const showToast = useToast();
  const [sent, setSent] = useState(0);
  return (
    <Stack gap="md">
      <Inline>
        <Button
          onClick={() => {
            showToast(`Message ${sent + 1} sent`, 'success');
            setSent(sent + 1);
          }}
        >
          Send message
        </Button>
      </Inline>
      <Text tone="muted">Sent: {sent}</Text>
    </Stack>
  );
};

export default function MaxToasts() {
  return (
    <ToastProvider maxToasts={2}>
      <Sender />
    </ToastProvider>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | The app. |
| `maxToasts` | `number` | `3` | How many toasts show at once. When a new toast would exceed it, the oldest starts its exit animation. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.color.bg.card` | `#FCFCFC` | `#1A1B1E` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.success` | `#16a34a` | `#22C55E` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.fontWeight.medium` | `500` | `500` |
| `theme.layout.navHeightMobile` | `96px` | `96px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.shadow.hoverLift` | `0 2px 8px rgba(0,0,0,0.15)` | `0 2px 8px rgba(0,0,0,0.6)` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.xxl` | `1rem` | `1rem` |
| `theme.space.xxxxl` | `1.5rem` | `1.5rem` |
| `theme.transition.slide` | `0.2s ease-out` | `0.2s ease-out` |
| `theme.zIndex.sticky` | `1000` | `1000` |
| `theme.zIndex.toast` | `9999` | `9999` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.0.1** (2026-11-15): Toast: `ToastProvider`, `useToast`.

<!-- /generated:changelog -->
