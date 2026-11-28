---
title: useModal
description: A hook that drives a native dialog element from an open flag and routes Escape and backdrop clicks to a dismiss callback.
category: Hooks
---
# useModal

<!-- generated:import -->

`import { useModal } from '@korzun/design/control'`

<!-- /generated:import -->

A hook that drives a native `<dialog>` from an `isOpen` boolean: it calls
`showModal()` / `close()` for you and routes Escape and backdrop clicks to
`onDismiss`. It is the base under [`Modal`](modal.md) (and so `ConfirmModal`).
Reach for `Modal` first; this hook remains for modals `Modal` cannot express,
built from this hook plus the `theme.recipe.modal.*` styles.

Use something else for: a plain yes/no confirmation (`ConfirmModal`), or a
dropdown or non-modal floating layer (`Popover`).

## Usage

### Signature

```ts
function useModal(
  isOpen: boolean,
  onDismiss: () => void,
  canDismiss?: boolean, // default true
): RefObject<HTMLDialogElement | null>;
```

| Argument | Type | Default | Notes |
|---|---|---|---|
| `isOpen` | `boolean` | (required) | The single source of truth. `true` calls `showModal()`, `false` calls `close()`. |
| `onDismiss` | `() => void` | (required) | Called on Escape and on a backdrop click. **It does not close anything itself**: set your `isOpen` state to `false` in it. Receives no event. |
| `canDismiss` | `boolean` | `true` | When `false`, Escape and backdrop clicks are swallowed. Pass `!loading` (or `countdown === 0`) so an in-flight request can't be escaped. |

Returns a ref to attach to the `<dialog>`.

### Behaviour to know

- Escape fires the dialog's `cancel` event; the hook always calls
  `preventDefault()` so the browser never closes the dialog behind React's back.
- While open, the dialog joins the layer stack shared with `Popover`s. A
  popover left open beneath it neither takes its Escape (the dialog's own
  `cancel` runs) nor closes on a press inside the dialog. A popover opened
  inside the dialog takes Escape before the dialog does.
- A backdrop click counts only when **both** mousedown and mouseup land on the
  `<dialog>` element itself (its content lives in a child). Dragging a text
  selection out of an input onto the backdrop does not dismiss.
- The `<dialog>` must stay mounted. Rendering it conditionally (`{isOpen && <dialog…>}`)
  breaks `showModal()`; its children also stay mounted while closed, so reset
  any form state yourself when reopening.
- A `Select` or `ChipsInput` works inside the modal: their dropdowns render
  inside the open `<dialog>` that contains their anchor (see
  [popover](popover.md)).
- Never call `showModal()` / `close()` yourself.

### Styling

Build the dialog from the recipe styles: `dialog: { ...theme.recipe.modal.dialog }`
(`radius.lg`: the dialog sits on the page), `header`, `body` and `footer` from
`theme.recipe.modal.*`, and pad the body with `theme.space.xxl`. The examples
show it in full.

## Do / don't

- Do pass `canDismiss={!loading}` and also disable the Cancel button while
  loading, so every exit is gated the same way.
- Do keep the `onClick={(e) => e.stopPropagation()}` on the `<dialog>` when it
  is rendered inside a clickable ancestor (a card row); it only stops bubbling,
  dismissal is the hook's job.
- Do wrap the dialog's contents (header, body, footer) in
  [`Surface`](../component/surface.md): hand-drawn boxes are invisible to depth,
  so the Buttons and Selects inside then get the same `md` corners as in a
  `Modal`, with no `radius` or `surface` override.

<!-- generated:examples -->

## Examples

### Basic

The hook returns a ref for a `<dialog>` that stays mounted. `isOpen` drives
`showModal()` and `close()`; Escape and a click on the backdrop call `onDismiss`,
which closes nothing itself, so it sets `isOpen` to `false`. The `<dialog>` takes
the `theme.recipe.modal.*` styles, and its contents are wrapped in `Surface` so the
Buttons get the corners they would have in a `Modal`. This demo starts open.

```tsx
import { Stack, Surface, Text } from '@korzun/design/component';
import { Button, useModal } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyles = createUseStyles((theme: Theme) => ({
  dialog: { ...theme.recipe.modal.dialog, backgroundColor: theme.color.bg.card },
  header: { ...theme.recipe.modal.header },
  body: {
    padding: `0 ${theme.space.xxl} ${theme.space.xxl}`,
    color: theme.color.text.secondary,
  },
  footer: { ...theme.recipe.modal.footer },
}));

export default function Basic() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(true);
  const [saves, setSaves] = useState(0);
  const close = () => setIsOpen(false);
  const ref = useModal(isOpen, close);
  return (
    <Stack align="start">
      <Button onClick={() => setIsOpen(true)}>Edit progress</Button>
      <Text tone="muted">Saved: {saves}</Text>
      <dialog ref={ref} className={styles.dialog}>
        <Surface>
          <div className={styles.header}>Edit progress</div>
          <div className={styles.body}>You are on page 42 of 310.</div>
          <div className={styles.footer}>
            <Button type="text" onClick={close}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSaves((n) => n + 1);
                close();
              }}
            >
              Save
            </Button>
          </div>
        </Surface>
      </dialog>
    </Stack>
  );
}
```

### Gated dismissal

`canDismiss` is `!saving`, so Escape and backdrop clicks do nothing while a request
runs, and the Cancel button is disabled to match so every exit is gated the same.
The switch holds the busy state on. The `onClick` that stops propagation keeps a
click in the dialog from reaching a clickable ancestor; dismissal is the hook's job.

```tsx
import { Stack, Surface } from '@korzun/design/component';
import { Button, Switch, useModal } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyles = createUseStyles((theme: Theme) => ({
  dialog: { ...theme.recipe.modal.dialog, backgroundColor: theme.color.bg.card },
  header: { ...theme.recipe.modal.header },
  body: {
    padding: `0 ${theme.space.xxl} ${theme.space.xxl}`,
    color: theme.color.text.secondary,
  },
  footer: { ...theme.recipe.modal.footer },
}));

export default function GatedDismissal() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(true);
  const close = () => setIsOpen(false);
  const ref = useModal(isOpen, close, !saving);
  return (
    <Stack align="start">
      <Button onClick={() => setIsOpen(true)}>Open busy modal</Button>
      <dialog ref={ref} className={styles.dialog} onClick={(event) => event.stopPropagation()}>
        <Surface>
          <div className={styles.header}>Saving progress</div>
          <div className={styles.body}>
            <Stack>
              Escape and the backdrop are ignored while the request is in flight.
              <Switch
                name="saving"
                label="Request in flight"
                checked={saving}
                onChange={setSaving}
              />
            </Stack>
          </div>
          <div className={styles.footer}>
            <Button type="text" disabled={saving} onClick={close}>
              Cancel
            </Button>
            <Button type="primary" loading={saving} onClick={close}>
              Save
            </Button>
          </div>
        </Surface>
      </dialog>
    </Stack>
  );
}
```

### Select inside

A `Select` list opens inside the modal and takes Escape before the modal does. The
hook gives no surface depth, so the contents are wrapped in `Surface` and the
`Select` gets card corners.

```tsx
import { Stack, Surface, Text } from '@korzun/design/component';
import { Button, Select, useModal } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const SHELVES = ['Reading', 'To read', 'Finished', 'Abandoned'];

const useStyles = createUseStyles((theme: Theme) => ({
  dialog: { ...theme.recipe.modal.dialog, backgroundColor: theme.color.bg.card },
  header: { ...theme.recipe.modal.header },
  body: {
    padding: `0 ${theme.space.xxl} ${theme.space.xxl}`,
  },
  footer: { ...theme.recipe.modal.footer },
}));

export default function SelectInside() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [shelf, setShelf] = useState<string | undefined>('Reading');
  const close = () => setIsOpen(false);
  const ref = useModal(isOpen, close);
  return (
    <Stack align="start">
      <Button onClick={() => setIsOpen(true)}>Move book</Button>
      <Text tone="muted">Shelf: {shelf ?? 'none'}</Text>
      <dialog ref={ref} className={styles.dialog}>
        <Surface>
          <div className={styles.header}>Move book</div>
          <div className={styles.body}>
            <Select
              name="shelf"
              label="Shelf"
              layout="vertical"
              options={SHELVES}
              value={shelf}
              onChange={setShelf}
            />
          </div>
          <div className={styles.footer}>
            <Button type="primary" onClick={close}>
              Done
            </Button>
          </div>
        </Surface>
      </dialog>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

This module takes no props; see Usage for its API.

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

This module has no styles of its own.

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): **Breaking:** `Dialog` is renamed `Modal` and `useModalDialog` is renamed `useModal`, matching `ConfirmModal`; behaviour is unchanged. The old names `Dialog`, `DialogProps` and `useModalDialog` are removed. The footer marker attribute is now `data-modal-footer`.
- **0.4.0** (2026-11-23): Layer stack: popovers and dialogs now close innermost-first. Escape and an outside press only affect the topmost layer, so a popover inside a popover closes one level at a time. **Behaviour change:** a popover beneath an open dialog no longer takes its Escape or closes on a press inside the dialog.
- **0.3.0** (2026-11-22): `Popover` renders inside an open `<dialog>` that contains its anchor, so `Select` and `ChipsInput` work in modals.
- **0.0.5** (2026-11-21): Every prop has a JSDoc comment, so editors and coding agents see the guidance in the `.d.ts`. `useModalDialog` declares its return type.

<!-- /generated:changelog -->
