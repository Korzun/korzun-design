---
title: ConfirmModal
description: A ready-made yes/no modal with a title, a body, and Cancel and Confirm buttons.
category: Overlays
---
# ConfirmModal

<!-- generated:import -->

`import { ConfirmModal, type ConfirmModalProps } from '@korzun/design/control'`

<!-- /generated:import -->

A ready-made yes/no modal built on [`Dialog`](dialog.md): a title, a body
(`children`), and a footer with a text Cancel and a primary Confirm button. It
is always mounted and fully controlled by `isOpen`.

Use something else for: a modal with its own form or more than two actions
(use [`Dialog`](dialog.md) for anything that is not yes/no), or a non-blocking
notice (toast).

## Usage

### Behaviour to know

- Footer buttons already get `md` corners from `Dialog`'s depth; the dialog uses
  `recipe.modal.dialog` (`radius.lg`, it sits on the page). See
  [corners](../corners.md).
- `onCancel` is the single dismissal path, so whatever you do there runs for
  Escape and backdrop clicks too.

### Styling

No `className`.

## Do / don't

- Do pass `loading` while the request runs, so the user can't dismiss mid-flight.
- Do close the modal in both `onCancel` and (after success) `onConfirm`.
- Don't render it conditionally (`{open && <ConfirmModal …/>}`); toggle `isOpen`.
- Don't pass `icon={<AlertOctagonIcon />}`; pass the component.

<!-- generated:examples -->

## Examples

### Basic

A yes/no question with a `title`, a body and custom `confirmText` and `cancelText`.
`onConfirm` and `onCancel` take no arguments, and `onConfirm` does not close the
modal: it sets `isOpen` to `false` itself. `onCancel` also runs for Escape and a
click on the backdrop.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, ConfirmModal } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState('none yet');
  const answerWith = (value: string) => {
    setAnswer(value);
    setIsOpen(false);
  };
  return (
    <Stack>
      <Inline>
        <Button onClick={() => setIsOpen(true)}>Sync library</Button>
        <Text tone="muted">Answer: {answer}</Text>
      </Inline>
      <ConfirmModal
        isOpen={isOpen}
        title="Sync library?"
        confirmText="Sync now"
        cancelText="Not now"
        onCancel={() => answerWith('not now')}
        onConfirm={() => answerWith('sync now')}
      >
        This checks every connected device for new books.
      </ConfirmModal>
    </Stack>
  );
}
```

### Destructive confirmation

`danger` turns Confirm red and tints the `icon`, which takes a component
(`icon={AlertOctagonIcon}`), not an element. While the deletion runs, `loading`
puts a spinner on Confirm, disables both buttons and ignores Escape and the
backdrop. `onConfirm` closes the modal itself once the work is done.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, ConfirmModal } from '@korzun/design/control';
import { AlertOctagonIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Danger() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const remove = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleted((n) => n + 1);
      setDeleting(false);
      setIsOpen(false);
    }, 1000);
  };
  return (
    <Stack>
      <Inline>
        <Button danger onClick={() => setIsOpen(true)}>
          Delete
        </Button>
        <Text tone="muted">Books deleted: {deleted}</Text>
      </Inline>
      <ConfirmModal
        isOpen={isOpen}
        title="Delete book?"
        confirmText="Delete"
        danger
        icon={AlertOctagonIcon}
        loading={deleting}
        onCancel={() => setIsOpen(false)}
        onConfirm={remove}
      >
        This can’t be undone.
      </ConfirmModal>
    </Stack>
  );
}
```

### Loading

`loading` puts a spinner on Confirm, disables both buttons and makes Escape and the
backdrop do nothing. The switch holds it on so you can try to dismiss the modal;
turn it off and Cancel, Escape and the backdrop work again.

```tsx
import { Inline, Stack } from '@korzun/design/component';
import { Button, ConfirmModal, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Loading() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <Inline>
      <Button onClick={() => setIsOpen(true)}>Publish</Button>
      <ConfirmModal
        isOpen={isOpen}
        title="Publish changes?"
        confirmText="Publish"
        loading={loading}
        onCancel={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)}
      >
        <Stack>
          The request is in flight.
          <Switch name="loading" label="Loading" checked={loading} onChange={setLoading} />
        </Stack>
      </ConfirmModal>
    </Inline>
  );
}
```

### Confirm disabled

`confirmDisabled` disables only Confirm, here until the switch in the body is on.
Cancel and dismissal keep working.

```tsx
import { Inline, Stack } from '@korzun/design/component';
import { Button, ConfirmModal, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function ConfirmDisabled() {
  const [isOpen, setIsOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const close = () => {
    setIsOpen(false);
    setUnderstood(false);
  };
  return (
    <Inline>
      <Button onClick={() => setIsOpen(true)}>Reset library</Button>
      <ConfirmModal
        isOpen={isOpen}
        title="Reset library?"
        confirmText="Reset"
        confirmDisabled={!understood}
        danger
        onCancel={close}
        onConfirm={close}
      >
        <Stack>
          Every book is removed from this device.
          <Switch
            name="understood"
            label="I understand"
            checked={understood}
            onChange={setUnderstood}
          />
        </Stack>
      </ConfirmModal>
    </Inline>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | Body content, in secondary text colour. |
| `cancelText` | `string` | `'Cancel'` | Cancel button label. |
| `confirmDisabled` | `boolean` | `false` | Disables only the Confirm button (e.g. until a checkbox is ticked). |
| `confirmText` | `string` | `'Confirm'` | Confirm button label. |
| `danger` | `boolean` | `false` | Red Confirm button; also tints `icon` red. |
| `icon` | `React.ComponentType<IconProps>` |  | Icon component shown before the title (`icon={AlertOctagonIcon}`), not an element. |
| `isOpen` | `boolean` | `false` | Controls visibility. Keep the modal mounted and toggle this. |
| `loading` | `boolean` | `false` | Spinner on Confirm; disables both buttons and blocks Escape and backdrop dismissal. |
| `onCancel` | `() => void` | `() => {}` | Called by Cancel, Escape, and a backdrop click; receives no event. Close the modal here. |
| `onConfirm` | `() => void` | `() => {}` | Receives no event and does not close the modal: set `isOpen` to `false` yourself. |
| `title` | `string` | `'Confirm action'` | Header text. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.space.md` | `0.5rem` | `0.5rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.3.0** (2026-11-22): `ConfirmModal` is rebuilt on `Dialog`. No API or visual change; it is now named by its title (`aria-labelledby`).

<!-- /generated:changelog -->
