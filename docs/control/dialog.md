---
title: Dialog
description: A modal on a native dialog element with a title, a body and an optional footer of actions.
category: Overlays
---
# Dialog

<!-- generated:import -->

`import { Dialog, type DialogProps } from '@korzun/design/control'`

<!-- /generated:import -->

A modal on a native `<dialog>` (via `useModalDialog`): a title, a body
(`children`), and an optional `footer` for actions. It is always mounted and
fully controlled by `open`. The title names the dialog for assistive tech.

Use something else for: a yes/no question ([`ConfirmModal`](confirm-modal.md)),
a non-blocking notice (toast).

## Usage

### Behaviour to know

- Escape and a backdrop press-and-release both call `onClose`; it is the
  single dismissal path. `canDismiss={false}` blocks both.
- Escape goes to the innermost open layer first: a `Select` list or other
  popover open inside the dialog closes before the dialog, and a dialog opened
  over a still-open popover closes before that popover.
- Always mounted: toggle `open`, don't render it conditionally.
- Focus is native: `showModal()` moves focus into the dialog and restores it
  on close.
- Clicks inside the dialog do not bubble to clickable ancestors.
- Content is one surface level in: Buttons in the body, header and `footer`
  (including nested ones inside an `Inline`) default to 8px. An explicit
  `radius` on a Button still wins.

## Do / don't

- Do use [`ConfirmModal`](confirm-modal.md) for yes/no questions.
- Do pass `canDismiss={!loading}` while a request runs.
- Don't set `radius` on Buttons inside a Dialog by hand; the depth does it.
- Don't write your own modal style files; build on `Dialog`.
- Don't render it conditionally (`{open && <Dialog …/>}`); toggle `open`.

<!-- generated:examples -->

## Examples

### Basic

A title, a body and a footer with a `text` Cancel and a `primary` Save. `open` is
controlled and `onClose` takes no arguments: it runs for Escape and a click on the
backdrop, and closes nothing by itself, so it sets `open` to `false`.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Dialog } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [open, setOpen] = useState(false);
  const [saves, setSaves] = useState(0);
  const save = () => {
    setSaves((n) => n + 1);
    setOpen(false);
  };
  return (
    <Stack>
      <Inline>
        <Button onClick={() => setOpen(true)}>Review fixes</Button>
        <Text tone="muted">Saved: {saves}</Text>
      </Inline>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Fixes waiting"
        footer={
          <>
            <Button type="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={save}>
              Save
            </Button>
          </>
        }
      >
        Three metadata fixes are waiting for review.
      </Dialog>
    </Stack>
  );
}
```

### Without a footer

With no `footer` no action bar is drawn. The dialog is dismissed with Escape or a
click on the backdrop, both of which call `onClose`.

```tsx
import { Inline, Text } from '@korzun/design/component';
import { Button, Dialog } from '@korzun/design/control';
import { useState } from 'react';

export default function NoFooter() {
  const [open, setOpen] = useState(false);
  const [dismissals, setDismissals] = useState(0);
  const dismiss = () => {
    setDismissals((n) => n + 1);
    setOpen(false);
  };
  return (
    <Inline>
      <Button onClick={() => setOpen(true)}>Show notice</Button>
      <Text tone="muted">Dismissed: {dismissals}</Text>
      <Dialog open={open} onClose={dismiss} title="Sync finished">
        Press Escape or click outside the dialog to close it.
      </Dialog>
    </Inline>
  );
}
```

### Not dismissable while busy

`canDismiss={!saving}` makes Escape and backdrop clicks do nothing while a request
runs. The switch holds the busy state on so you can try both; the footer buttons
are disabled or loading to match, so every way out is gated the same.

```tsx
import { Stack } from '@korzun/design/component';
import { Button, Dialog, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function NotDismissable() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(true);
  return (
    <Stack align="start">
      <Button onClick={() => setOpen(true)}>Open busy dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        canDismiss={!saving}
        title="Saving changes"
        footer={
          <>
            <Button type="text" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" loading={saving} onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <Stack>
          Escape and the backdrop are ignored while the request is in flight.
          <Switch name="saving" label="Request in flight" checked={saving} onChange={setSaving} />
        </Stack>
      </Dialog>
    </Stack>
  );
}
```

### Form in a dialog

Controls in the body and a footer that saves. `Select` lists open inside the dialog
and Escape closes the list before the dialog. `canDismiss={!saving}` and a
`loading` Save keep it open until the request finishes.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Dialog, Select, TextInput } from '@korzun/design/control';
import { useState } from 'react';

const SHELVES = ['Reading', 'To read', 'Finished', 'Abandoned'];

export default function Form() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | undefined>('');
  const [shelf, setShelf] = useState<string | undefined>('Reading');
  const [saved, setSaved] = useState('nothing yet');
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved(`${shelf ?? 'no shelf'}, note “${note ?? ''}”`);
      setSaving(false);
      setOpen(false);
    }, 1000);
  };
  return (
    <Stack>
      <Inline>
        <Button onClick={() => setOpen(true)}>Edit book</Button>
        <Text tone="muted">Saved: {saved}</Text>
      </Inline>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        canDismiss={!saving}
        title="Edit book"
        footer={
          <>
            <Button type="text" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" loading={saving} onClick={save}>
              Save
            </Button>
          </>
        }
      >
        <Stack>
          <TextInput name="note" label="Note" layout="vertical" value={note} onChange={setNote} />
          <Select
            name="shelf"
            label="Shelf"
            layout="vertical"
            options={SHELVES}
            value={shelf}
            onChange={setShelf}
          />
        </Stack>
      </Dialog>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | Body content, in secondary text colour. |
| `canDismiss` | `boolean` | `true` | When `false`, Escape and backdrop clicks are ignored; pass `!loading` while a request runs. |
| `className` | `string` |  | Extra class on the `<dialog>` element. Win specificity with `'&&'`, never `!important`. |
| `footer` | `ReactNode` |  | Action row. No footer bar is drawn when omitted. |
| `onClose` (required) | `() => void` |  | Called on Escape and a backdrop click (unless `canDismiss` is false); receives no event. Close the dialog here. |
| `open` (required) | `boolean` |  | Controls visibility. Keep the Dialog mounted and toggle this. |
| `title` (required) | `ReactNode` |  | Header content; also the dialog's accessible name. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.card` | `#FCFCFC` | `#1A1B1E` |
| `theme.color.text.secondary` | `#5A6375` | `#C8CBD2` |
| `theme.recipe.modal.dialog` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.modal.footer` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.modal.header` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.xxl` | `1rem` | `1rem` |
| `theme.space.xxxxl` | `1.5rem` | `1.5rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.5.0** (2026-11-24): Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- **0.5.0** (2026-11-24): **Visible changes:**
  - Buttons in a Card default to 8px (they were 16px unless `radius="card"` was set), and Buttons in a Dialog body are 8px.
  - Selects directly on a Page get the page look (16px and the card shadow); in a Card or Dialog they stay 8px. This includes Selects in your own boxes on a Page (a `useModalDialog` modal, a `recipe.card.shell` or `recipe.row` box), because depth cannot see hand-drawn boxes: wrap their contents in `Surface`, or pass `surface="card"`.
  - Without a Page, a bare `Card` counts as depth 0: its Buttons go from 16px to 8px, a Card nested in it steps down, and a `CardRow` in it is 8px.
  - A Card nested in a Card or Dialog steps down (8px, then 4px), and so do its Buttons and Selects; `size="small"` keeps its extra 1px.
  - `CardRow` is 16px on a Page and 8px inside a Card (it was always 16px).
  - Buttons and Selects inside a Popover or Menu are 4px.
- **0.5.0** (2026-11-24): The internal `ButtonRadiusContext` is removed; Dialog footer Buttons are unchanged (8px).
- **0.4.0** (2026-11-23): Layer stack: popovers and dialogs now close innermost-first. Escape and an outside press only affect the topmost layer, so a popover inside a popover closes one level at a time. **Behaviour change:** a popover beneath an open dialog no longer takes its Escape or closes on a press inside the dialog.
- **0.3.0** (2026-11-22): New `Dialog` (control): a modal with a title, body and optional footer on a native `<dialog>`; `canDismiss` blocks Escape and backdrop dismissal while busy.
- **0.3.0** (2026-11-22): `ConfirmModal` is rebuilt on `Dialog`. No API or visual change; it is now named by its title (`aria-labelledby`).
- **0.3.0** (2026-11-22): `Popover` renders inside an open `<dialog>` that contains its anchor, so `Select` and `ChipsInput` work in modals.
- **0.3.0** (2026-11-22): Buttons in a `Dialog` footer default to `radius="modal"`; an explicit `radius` still wins. The radius applies to the footer only (a Dialog nested in a footer is unaffected), and `footer={false}`, `''` and `null` render no footer bar.

<!-- /generated:changelog -->
