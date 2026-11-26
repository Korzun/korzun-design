---
title: PageFooterActions
description: A row of Buttons for the bottom of a page, split into leading and trailing sides.
category: Actions
---
# PageFooterActions

<!-- generated:import -->

```ts
import {
  PageFooterActions,
  type FooterAction,
  type PageFooterActionsProps,
} from '@korzun/design/control';
```

<!-- /generated:import -->

A row of Buttons for the bottom of a page, split into leading and trailing
sides: typically Cancel / Save for a form that spans several cards. Leading
items sit left, trailing items right. It is a plain flex row (not sticky, shown
at every width). `Page` renders it after its children when you pass
`footerActions`; you can also render it directly after your form.

Use something else for: header actions (`PageActionsBar` / `PageActionsMenu`
via `Page headerActions`), a Card's own submit (`Button` in the Card `footer`),
modal buttons (`Dialog` footer).

## Usage

### Submitting a form

The row sits outside the form, below the cards, so a submit item needs `form`
(the id of the `<form>`) as well as `submit`. `onClick` is required on every
item but is never called for a submit one; the form's `action` or `onSubmit`
runs instead. Drive `loading` and `disabled` from your own pending and
validation state.

### Corners

The Buttons follow surface depth: the row sits on the page background below the
cards, so on a `Page` they get the page's 16px corners; see
[corners](../corners.md). No `className`.

## Do / don't

- Do give exactly one item `emphasis`.
- Do pair `submit` with `form` when the row is outside the `<form>`.
- Don't put a destructive action beside Save without `danger` and
  `align: 'leading'`.
- Don't put PageFooterActions inside a `Card`; a Card's own submit goes in its
  `footer`.

<!-- generated:examples -->

## Examples

### Basic

Cancel and Save on the trailing side. Give exactly one item `emphasis` so
the main action reads as primary. `onClick` takes no arguments.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { PageFooterActions } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Stack>
      <PageFooterActions
        items={[
          { label: 'Cancel', onClick: () => setLast('Cancel') },
          { label: 'Save', onClick: () => setLast('Save'), emphasis: true },
        ]}
      />
      <Text tone="muted">Last pressed: {last}</Text>
    </Stack>
  );
}
```

### Leading and trailing

`align: 'leading'` puts an item on the left, so a destructive action sits
away from Save; `danger` gives it the red treatment.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { PageFooterActions } from '@korzun/design/control';
import { useState } from 'react';

export default function LeadingAndTrailing() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Stack>
      <PageFooterActions
        items={[
          { label: 'Delete', onClick: () => setLast('Delete'), danger: true, align: 'leading' },
          { label: 'Cancel', onClick: () => setLast('Cancel') },
          { label: 'Save', onClick: () => setLast('Save'), emphasis: true },
        ]}
      />
      <Text tone="muted">Last pressed: {last}</Text>
    </Stack>
  );
}
```

### Loading and disabled

`loading` shows a spinner and blocks clicks; `disabled` greys the item out.
The label can change between renders (`Save` to `Saving…`) without
remounting the button. Both switches hold their state on.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { PageFooterActions, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function LoadingAndDisabled() {
  const [saving, setSaving] = useState(true);
  const [invalid, setInvalid] = useState(true);
  const [last, setLast] = useState('nothing yet');
  return (
    <Stack>
      <Switch name="saving" label="Saving" checked={saving} onChange={setSaving} />
      <Switch name="invalid" label="Form invalid" checked={invalid} onChange={setInvalid} />
      <PageFooterActions
        items={[
          { label: 'Cancel', onClick: () => setLast('Cancel'), disabled: saving },
          {
            label: saving ? 'Saving…' : 'Save',
            onClick: () => setLast('Save'),
            emphasis: true,
            loading: saving,
            disabled: invalid,
          },
        ]}
      />
      <Text tone="muted">Last pressed: {last}</Text>
    </Stack>
  );
}
```

### Submit a form

The row sits below the cards, outside the `<form>`, so the submit item names
the form with `form`. `onClick` is required on every item but never called
for a submit one (pass an empty function): the form's `action` runs instead. `loading` follows the
pending save, and Save is disabled while a field is empty.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { PageFooterActions, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function SubmitAForm() {
  const [title, setTitle] = useState<string | undefined>('Dune');
  const [author, setAuthor] = useState<string | undefined>('Frank Herbert');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('Not saved');
  const hasInvalidFields = !title?.trim() || !author?.trim();
  return (
    <Stack>
      <form
        id="book-form"
        action={async (data) => {
          setSaving(true);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setSaving(false);
          setStatus(`Saved ${String(data.get('title'))}`);
        }}
      >
        <Stack>
          <Card title="Details">
            <TextInput name="title" label="Title" value={title} onChange={setTitle} />
          </Card>
          <Card title="Identifiers">
            <TextInput name="author" label="Author" value={author} onChange={setAuthor} />
          </Card>
        </Stack>
      </form>
      <PageFooterActions
        items={[
          { label: 'Cancel', onClick: () => setStatus('Cancelled'), disabled: saving },
          {
            label: saving ? 'Saving…' : 'Save',
            onClick: () => {},
            submit: true,
            form: 'book-form',
            emphasis: true,
            loading: saving,
            disabled: hasInvalidFields,
          },
        ]}
      />
      <Text tone="muted">{status}</Text>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | [FooterAction](#footeraction)`[]` |  | Items in order within each side: leading items first, then trailing ones. |

### FooterAction

One button in a `PageFooterActions` row.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'leading' \| 'trailing'` | `'trailing'` | Which side of the row the button sits on: leading is left, trailing is right. |
| `danger` | `boolean` |  | Red treatment. |
| `disabled` | `boolean` |  | Greys the button out and blocks clicks. |
| `emphasis` | `boolean` |  | Renders `type="primary"`; otherwise `type="default"`. |
| `form` | `string` |  | Id of the `<form>` to submit; needed because the row sits outside the form. |
| `label` (required) | `string` |  | Button text; may change between renders (`Save` → `Saving…`) without remounting. |
| `loading` | `boolean` |  | Spinner; blocks clicks. |
| `onClick` (required) | `() => void` |  | Required even for a `submit` item, where it is never called (the form submits); pass `() => {}`. Receives no event. Not called while `disabled` or `loading`. |
| `submit` | `boolean` |  | Renders a native submit button; `onClick` is then ignored. Pair it with `form` when the row sits outside the `<form>`. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.space.md` | `0.5rem` | `0.5rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
