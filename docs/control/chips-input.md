---
title: ChipsInput
description: A tag field: the values show as coloured chips in an input box, typing filters a suggestion dropdown, and Enter adds a chip.
category: Inputs
---
# ChipsInput

<!-- generated:import -->

`import { ChipsInput, type ChipColor, type ChipsInputProps } from '@korzun/design/control'`

<!-- /generated:import -->

A tag field: the current values render as coloured chips inside an input box,
typing filters a suggestion dropdown (a `Popover`), and Enter adds a chip. Fully
controlled: you own the `string[]`.

Use something else for: one value from a list (`Select`), one of a few fixed
options (`SegmentedControl`), free text (`TextInput`).

## Usage

### Keyboard

- ArrowDown / ArrowUp move the highlight; Enter or Tab adds the highlighted
  suggestion, else (with `allowCustom`) the trimmed typed text.
- **Tab with text typed adds a chip and keeps focus in the field** (it calls
  `preventDefault`); Tab on an empty field moves focus normally.
- Enter never submits the surrounding form while text is typed, even when
  nothing could be added.
- Backspace on an empty field removes the last chip.
- A value that matches an existing chip case-insensitively is not added.

### Styling

No `className`. The label is linked to the input with a generated id.

## Do / don't

- Do set `layout="horizontal"` and `dense` when it sits among other form fields
  in a `Card`; otherwise the label silently disappears.
- Do pick a `chipColor` that matches how the same values are tagged elsewhere.
- Do use it inside a `Dialog`: the dropdown opens inside the open dialog, so it
  is not hidden behind it (see [popover](popover.md)).
- Don't rely on `name` for form submission.

<!-- generated:examples -->

## Examples

### Basic

A controlled tag box in a `Card`. Typing filters the suggestions and Enter
adds the highlighted one, or the typed text; Backspace on an empty field
removes the last chip. `onChange` receives the whole new array, not an event.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { ChipsInput } from '@korzun/design/control';
import { useState } from 'react';

const SUBJECTS = ['Astronomy', 'Biology', 'Cooking', 'History', 'Poetry', 'Travel'];

export default function Basic() {
  const [subjects, setSubjects] = useState(['History']);
  return (
    <Card title="Subjects">
      <Stack>
        <ChipsInput
          value={subjects}
          suggestions={SUBJECTS}
          onChange={setSubjects}
          placeholder="Add subject…"
        />
        <Text tone="muted">Chosen: {subjects.join(', ') || 'nothing'}</Text>
      </Stack>
    </Card>
  );
}
```

### Custom values and suggestions only

Enter or Tab also adds text that matches no suggestion. With
`allowCustom={false}` only a suggestion can be added: unmatched text stays in
the field.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { ChipsInput } from '@korzun/design/control';
import { useState } from 'react';

const COLOURS = ['Amber', 'Blue', 'Crimson', 'Teal'];

export default function SuggestionsOnly() {
  const [anything, setAnything] = useState<string[]>([]);
  const [listed, setListed] = useState<string[]>([]);
  return (
    <Stack>
      <Text>Custom values allowed</Text>
      <ChipsInput
        value={anything}
        suggestions={COLOURS}
        onChange={setAnything}
        placeholder="Type any colour…"
      />
      <Text>Suggestions only</Text>
      <ChipsInput
        value={listed}
        suggestions={COLOURS}
        onChange={setListed}
        allowCustom={false}
        placeholder="Pick a listed colour…"
      />
    </Stack>
  );
}
```

### Layouts

`block` is the bare box and shows no label, even when `label` is set.
`horizontal` and `vertical` add the label on a header row, like the other
fields in a form.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { ChipsInput } from '@korzun/design/control';
import { useState } from 'react';

const TAGS = ['Fiction', 'Memoir', 'Reference'];

export default function Layouts() {
  const [block, setBlock] = useState(['Fiction']);
  const [horizontal, setHorizontal] = useState(['Memoir']);
  const [vertical, setVertical] = useState(['Reference']);
  return (
    <Stack>
      <Text>block</Text>
      <ChipsInput label="Tags" value={block} suggestions={TAGS} onChange={setBlock} />
      <Text>horizontal</Text>
      <ChipsInput
        label="Tags"
        layout="horizontal"
        value={horizontal}
        suggestions={TAGS}
        onChange={setHorizontal}
      />
      <Text>vertical</Text>
      <ChipsInput
        label="Tags"
        layout="vertical"
        value={vertical}
        suggestions={TAGS}
        onChange={setVertical}
      />
    </Stack>
  );
}
```

### Chip colors

`chipColor` picks the colour family for a field's chips. Use the one that
tags the same values elsewhere in the app, so a subject looks like a subject
everywhere.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { ChipsInput, type ChipColor } from '@korzun/design/control';
import { useState } from 'react';

const COLORS: ChipColor[] = [
  'status',
  'author',
  'series',
  'subject',
  'book',
  'entryType',
  'user',
  'rating',
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
];

function ColorRow({ chipColor }: { chipColor: ChipColor }) {
  const [value, setValue] = useState<string[]>([chipColor]);
  return (
    <Stack gap="xs">
      <Text tone="muted">{chipColor}</Text>
      <ChipsInput value={value} suggestions={[]} onChange={setValue} chipColor={chipColor} />
    </Stack>
  );
}

export default function ChipColors() {
  return (
    <Stack>
      {COLORS.map((chipColor) => (
        <ColorRow key={chipColor} chipColor={chipColor} />
      ))}
    </Stack>
  );
}
```

### Disabled

`disabled` blocks typing and turns the chips' remove buttons off. A switch
toggles it so both states can be tried.

```tsx
import { Stack } from '@korzun/design/component';
import { ChipsInput, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Disabled() {
  const [disabled, setDisabled] = useState(true);
  const [value, setValue] = useState(['Cherry', 'Date']);
  return (
    <Stack>
      <Switch name="disabled" label="Disabled" checked={disabled} onChange={setDisabled} />
      <ChipsInput
        value={value}
        suggestions={['Apple', 'Banana']}
        onChange={setValue}
        disabled={disabled}
        placeholder="Add fruit…"
      />
    </Stack>
  );
}
```

### Form row

Among other fields in a `Card`, set `layout="horizontal"` and `dense` so the
label shows and the height matches a `TextInput`. `allowCustom={false}`
restricts it to known users, `chipColor="user"` matches how users are tagged
elsewhere, and `placeholder` and `disabled` follow the loading state. `name`
is set on the text input only: form data gets the half-typed text, so submit
the chips from state.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button, ChipsInput, TextInput } from '@korzun/design/control';
import { useState } from 'react';

const USERS = ['Ada', 'Grace', 'Linus', 'Margaret'];

export default function FormRow() {
  const [title, setTitle] = useState<string | undefined>('Reading group');
  const [users, setUsers] = useState(['Ada']);
  const [loading, setLoading] = useState(true);
  return (
    <Card
      title="Share"
      footer={
        <Button type="text" onClick={() => setLoading((l) => !l)}>
          {loading ? 'Finish loading' : 'Reload users'}
        </Button>
      }
    >
      <Stack>
        <ChipsInput
          name="users"
          label="Users"
          layout="horizontal"
          dense
          value={users}
          suggestions={USERS}
          onChange={setUsers}
          allowCustom={false}
          chipColor="user"
          disabled={loading}
          placeholder={loading ? 'Loading…' : 'Add users…'}
        />
        <TextInput
          name="title"
          label="Title"
          layout="horizontal"
          value={title}
          onChange={setTitle}
        />
        <Text tone="muted">Shared with: {users.join(', ') || 'nobody'}</Text>
      </Stack>
    </Card>
  );
}
```

### In a dialog

The suggestion list opens inside an open `Dialog` that contains the field,
so it works in a modal.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, ChipsInput, Dialog } from '@korzun/design/control';
import { useState } from 'react';

const SUBJECTS = ['Astronomy', 'Biology', 'Cooking', 'History', 'Poetry', 'Travel'];

export default function InDialog() {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  return (
    <Stack align="start">
      <Button onClick={() => setOpen(true)}>Edit subjects</Button>
      <Text tone="muted">Subjects: {subjects.join(', ') || 'none'}</Text>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit subjects"
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <ChipsInput
          value={subjects}
          suggestions={SUBJECTS}
          onChange={setSubjects}
          placeholder="Add subject…"
        />
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
| `allowCustom` | `boolean` | `true` | Enter or Tab adds the typed text as a chip. `false`: only suggestions can be added. |
| `chipColor` | `'status' \| 'author' \| 'series' \| 'subject' \| 'book' \| 'entryType' \| 'user' \| 'rating' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'subject'` | Chip colour family from `theme.color.chip`. Pick the one that tags the same values elsewhere. |
| `dense` | `boolean` | `false` | Matches a standard input's height, so the field lines up with `TextInput` and `Select` rows. Leave it off for a roomy standalone tag box. |
| `disabled` | `boolean` | `false` | Disables typing and the chip remove buttons. |
| `label` | `string` |  | Field label. Ignored in the `block` layout; set `layout` to show it. |
| `layout` | `'horizontal' \| 'vertical' \| 'block'` | `'block'` | `'block'` is the bare box, with no label. `'horizontal'` and `'vertical'` add a label on a `bg.cardHeader` row, like the other fields. Corners follow surface depth ([corners](../corners.md)); chips are a step squarer than the box. |
| `name` | `string` |  | Set on the text input only: form data gets the half-typed text, not the chips. |
| `onChange` (required) | `(values: string[]) => void` |  | Receives the whole new array, not an event. |
| `placeholder` | `string` |  | Shown only while there are no chips. |
| `suggestions` (required) | `string[]` |  | Suggestion pool; pass `[]` for none. Values already chosen are hidden, and matching is a case-insensitive substring. |
| `value` (required) | `string[]` |  | The chips. Controlled: you own the array. |

### Types

```ts
/** A chip colour family: a key of `theme.color.chip` (`'subject'`, `'user'`, `'neutral'`, …). */
type ChipColor = 'status' | 'author' | 'series' | 'subject' | 'book' | 'entryType' | 'user' | 'rating' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.color.bg.cardHeader` | `#EEEEEE` | `#232427` |
| `theme.color.bg.input` | `#FFFFFF` | `#1A1B1E` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.border.focus` | `#0758d9` | `#3696fe` |
| `theme.color.border.hover` | `#91CAFF` | `#1D4ED8` |
| `theme.color.brand.light` | `#EFF6FF` | `rgba(23, 119, 255, 0.2)` |
| `theme.color.chip.author.bg` | `rgba(26,122,82,0.08)` | `rgba(52,211,153,0.16)` |
| `theme.color.chip.author.border` | `rgba(26,122,82,0.22)` | `rgba(52,211,153,0.30)` |
| `theme.color.chip.author.text` | `#1a7a52` | `#7EE6B4` |
| `theme.color.chip.book.bg` | `rgba(14, 107, 125, 0.08)` | `rgba(45, 170, 190, 0.18)` |
| `theme.color.chip.book.border` | `rgba(14, 107, 125, 0.22)` | `rgba(45, 170, 190, 0.32)` |
| `theme.color.chip.book.text` | `#0e6b7d` | `#7FD0DE` |
| `theme.color.chip.danger.bg` | `rgba(255, 77, 79, 0.08)` | `rgba(255, 77, 79, 0.16)` |
| `theme.color.chip.danger.border` | `rgba(255, 77, 79, 0.22)` | `rgba(255, 77, 79, 0.3)` |
| `theme.color.chip.danger.text` | `#D9373e` | `#FF8E8E` |
| `theme.color.chip.entryType.bg` | `rgba(192, 65, 94, 0.08)` | `rgba(192, 65, 94, 0.18)` |
| `theme.color.chip.entryType.border` | `rgba(192, 65, 94, 0.22)` | `rgba(192, 65, 94, 0.32)` |
| `theme.color.chip.entryType.text` | `#c0415e` | `#E89BAC` |
| `theme.color.chip.info.bg` | `rgba(23, 119, 255, 0.08)` | `rgba(54, 150, 254, 0.18)` |
| `theme.color.chip.info.border` | `rgba(23, 119, 255, 0.24)` | `rgba(54, 150, 254, 0.36)` |
| `theme.color.chip.info.text` | `#0758d9` | `#87BAFF` |
| `theme.color.chip.neutral.bg` | `rgba(110, 110, 110, 0.08)` | `rgba(156, 161, 171, 0.16)` |
| `theme.color.chip.neutral.border` | `rgba(110, 110, 110, 0.22)` | `rgba(156, 161, 171, 0.3)` |
| `theme.color.chip.neutral.text` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.chip.rating.bg` | `rgba(181,69,27,0.08)` | `rgba(181,69,27,0.18)` |
| `theme.color.chip.rating.border` | `rgba(181,69,27,0.22)` | `rgba(181,69,27,0.32)` |
| `theme.color.chip.rating.text` | `#b5451b` | `#F2A07B` |
| `theme.color.chip.series.bg` | `rgba(26,95,168,0.08)` | `rgba(96,165,250,0.16)` |
| `theme.color.chip.series.border` | `rgba(26,95,168,0.22)` | `rgba(96,165,250,0.30)` |
| `theme.color.chip.series.text` | `#1a5fa8` | `#8EC3F5` |
| `theme.color.chip.status.bg` | `rgba(109,63,192,0.08)` | `rgba(167,139,250,0.16)` |
| `theme.color.chip.status.border` | `rgba(109,63,192,0.22)` | `rgba(167,139,250,0.30)` |
| `theme.color.chip.status.text` | `#6d3fc0` | `#C9B0F2` |
| `theme.color.chip.subject.bg` | `rgba(138,94,0,0.08)` | `rgba(217,168,67,0.16)` |
| `theme.color.chip.subject.border` | `rgba(138,94,0,0.22)` | `rgba(217,168,67,0.30)` |
| `theme.color.chip.subject.text` | `#8a5e00` | `#E8C879` |
| `theme.color.chip.success.bg` | `rgba(22, 163, 74, 0.08)` | `rgba(34, 197, 94, 0.16)` |
| `theme.color.chip.success.border` | `rgba(22, 163, 74, 0.22)` | `rgba(34, 197, 94, 0.3)` |
| `theme.color.chip.success.text` | `#15803d` | `#86EFAC` |
| `theme.color.chip.user.bg` | `rgba(162,58,149,0.08)` | `rgba(162,58,149,0.16)` |
| `theme.color.chip.user.border` | `rgba(162,58,149,0.22)` | `rgba(162,58,149,0.30)` |
| `theme.color.chip.user.text` | `#a23a95` | `#E7A6DA` |
| `theme.color.chip.warning.bg` | `rgba(234,179,8,0.16)` | `rgba(234,179,8,0.20)` |
| `theme.color.chip.warning.border` | `rgba(202,138,4,0.40)` | `rgba(234,179,8,0.42)` |
| `theme.color.chip.warning.text` | `#854d0e` | `#FDE047` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.fontWeight.medium` | `500` | `500` |
| `theme.layout.controlHeight` | `2.0625rem` | `2.0625rem` |
| `theme.lineHeight.tight` | `1` | `1` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.shadow.hoverLift` | `0 2px 8px rgba(0,0,0,0.15)` | `0 2px 8px rgba(0,0,0,0.6)` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xl` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxl` | `1rem` | `1rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.6.0** (2026-11-26): Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.5.2 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px. A text field, `ChipsInput` box or field label directly on a Page also moves its text 16px in from the edge (8px elsewhere), the inset `Button` keeps, so it clears the deeper corner.
- **0.3.0** (2026-11-22): `Popover` renders inside an open `<dialog>` that contains its anchor, so `Select` and `ChipsInput` work in modals.
- **0.1.0** (2026-11-21): `Popover`:
  - `side` (`bottom`/`top`) and `align` (`start`/`center`/`end`).
  - Flips when the preferred side has no room.
  - Stays inside the viewport horizontally, unless `matchWidth` (then it lines up with the anchor exactly).
  - On the top side it is anchored by its bottom edge, and it re-measures when its content resizes (`ResizeObserver`), so it stays attached as content grows or shrinks.
  - The provisional first render is transparent rather than hidden, so an `autoFocus` child takes focus.
  - Exposes `data-side`.
  - Escape calls `onClose` unless already handled, without closing a surrounding dialog.
  - Defaults keep the same position when there is room below; `Select` and `ChipsInput` now open upward near the bottom of the viewport.

<!-- /generated:changelog -->
