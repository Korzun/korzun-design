---
title: TextArea
description: A multi-line text field with a label, validation, optional auto-grow, and a character counter near `maxLength`.
category: Inputs
---
# TextArea

<!-- generated:import -->

`import { TextArea, type TextAreaProps } from '@korzun/design/control'`

<!-- /generated:import -->

A multi-line text field with an optional label, validation, an optional
auto-grow mode, and a character counter near `maxLength`. Same label/layout
system as `TextInput`.

Use something else for: single-line text (`TextInput`), tags (`ChipsInput`).

## Usage

### Styling

No `className`, no `disabled`, no `rows`, never resizable by the user
(`resize: none`).

## Do / don't

- Do use `autoResize` for long free text so the card doesn't scroll inside itself.
- Do set `maxLength` when the server has a limit; the counter only appears near it.
- Do set `ariaLabel` on a textarea with no visible `label`.
- Don't expect `onChange('')`; an empty field reports `undefined`.
- Don't try to shrink it below 7rem / 10rem with CSS; the min height is inline.

<!-- generated:examples -->

## Examples

### Basic

A controlled multi-line field. `onChange` receives the string, not an event,
and `undefined` once the field is emptied.

```tsx
import { Space, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [note, setNote] = useState<string | undefined>('Remember to return the book.');
  return (
    <Space direction="vertical">
      <TextArea name="note" layout="vertical" label="Note" value={note} onChange={setNote} />
      <Text tone="muted">Length: {note === undefined ? 'undefined' : note.length}</Text>
    </Space>
  );
}
```

### Layouts

`horizontal` puts the label and field on one shaded row, `vertical` stacks
the label above the field on that row, and `inline` paints nothing around the
pair.

```tsx
import { Space, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Read on the train.');
  const [vertical, setVertical] = useState<string | undefined>('Lend to Sam.');
  const [inline, setInline] = useState<string | undefined>('Reread next year.');
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <TextArea
          name="horizontal"
          layout="horizontal"
          label="Note"
          value={horizontal}
          onChange={setHorizontal}
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="vertical"
        </Text>
        <TextArea
          name="vertical"
          layout="vertical"
          label="Note"
          value={vertical}
          onChange={setVertical}
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="inline"
        </Text>
        <TextArea name="inline" layout="inline" label="Note" value={inline} onChange={setInline} />
      </Space>
    </Space>
  );
}
```

### Variants

`outlined` has a border and the input background; `borderless` drops both, so
the browser's own textarea background shows. Check it in dark mode.

```tsx
import { Space } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function Variants() {
  const [outlined, setOutlined] = useState<string | undefined>('Outlined');
  const [borderless, setBorderless] = useState<string | undefined>('Borderless');
  return (
    <Space direction="vertical">
      <TextArea
        name="outlined"
        layout="vertical"
        variant="outlined"
        label="Outlined"
        value={outlined}
        onChange={setOutlined}
      />
      <TextArea
        name="borderless"
        layout="vertical"
        variant="borderless"
        label="Borderless"
        value={borderless}
        onChange={setBorderless}
      />
    </Space>
  );
}
```

### Auto-resize

With `autoResize` the field grows to fit what is typed, so it never scrolls;
its minimum height is 7rem. Without it the height stays at 10rem and long text
scrolls. Both start with the same text: add lines to each.

```tsx
import { Space } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

const SAMPLE = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';

export default function AutoResize() {
  const [grows, setGrows] = useState<string | undefined>(SAMPLE);
  const [fixed, setFixed] = useState<string | undefined>(SAMPLE);
  return (
    <Space direction="vertical">
      <TextArea
        name="grows"
        layout="vertical"
        label="Auto-resize"
        autoResize
        value={grows}
        onChange={setGrows}
      />
      <TextArea
        name="fixed"
        layout="vertical"
        label="Fixed height"
        value={fixed}
        onChange={setFixed}
      />
    </Space>
  );
}
```

### Character counter

`maxLength` limits the text natively. The `n/max` counter appears once the field is
within the last 10% of the limit (at least 50 characters) and turns red at the limit.
The first field is inside that window, the second is at the limit.

```tsx
import { Space } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function CharacterCounter() {
  const [near, setNear] = useState<string | undefined>(
    'A short summary of the book that is already past halfway.'
  );
  const [full, setFull] = useState<string | undefined>(
    'A short summary of the book that fills every one of the characters allowed.'
  );
  return (
    <Space direction="vertical">
      <TextArea
        name="near"
        layout="vertical"
        label="Near the limit"
        maxLength={100}
        value={near}
        onChange={setNear}
      />
      <TextArea
        name="full"
        layout="vertical"
        label="At the limit"
        maxLength={75}
        value={full}
        onChange={setFull}
      />
    </Space>
  );
}
```

### Validation and placeholder

`placeholder` shows while the field is empty. `validate` receives the raw text
on each keystroke; while it returns `false` the label turns red, `onChange` is
not called (the saved text stays at the last valid one) and `onValidChange`
fires once when validity flips. The demo opens with two lines typed in, so it
starts invalid; remove the line break to fix it.

```tsx
import { Space, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useEffect, useRef, useState } from 'react';

// Types `text` into the field once on mount, as a user would, so the demo opens
// in the state that text produces (the ref survives Strict Mode's second run).
function useTypeOnMount(text: string) {
  const box = useRef<HTMLDivElement>(null);
  const typed = useRef(false);
  useEffect(() => {
    const field = box.current?.querySelector('textarea');
    if (typed.current || !field) return;
    typed.current = true;
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set?.call(field, text);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }, [text]);
  return box;
}

export default function Validation() {
  const [text, setText] = useState<string | undefined>(undefined);
  const [valid, setValid] = useState(true);
  const box = useTypeOnMount('Read on the train.\nLend to Sam.');
  return (
    <Space direction="vertical">
      <div ref={box}>
        <TextArea
          name="one-line"
          layout="vertical"
          label="One line only"
          placeholder="No line breaks allowed"
          value={text}
          onChange={setText}
          validate={(v) => !v.includes('\n')}
          onValidChange={(_name, ok) => setValid(ok)}
        />
      </div>
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved text: {text === undefined ? 'nothing' : `“${text}”`}</Text>
    </Space>
  );
}
```

### Form in a card

A short note in the `horizontal` layout, and a long description that
grows as the user types, with its label above and a `maxLength` the server
enforces.

```tsx
import { Card, Space, Text } from '@korzun/design/component';
import { Button, TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function FormInCard() {
  const [note, setNote] = useState<string | undefined>('Signed copy.');
  const [description, setDescription] = useState<string | undefined>(
    'A retired lighthouse keeper starts receiving letters from the sea.'
  );
  const [saved, setSaved] = useState(0);
  return (
    <Card
      title="Book details"
      footer={
        <Button type="primary" onClick={() => setSaved((n) => n + 1)}>
          Save
        </Button>
      }
    >
      <Space direction="vertical">
        <TextArea name="note" label="Note" value={note} onChange={setNote} />
        <TextArea
          name="description"
          layout="vertical"
          label="Description"
          autoResize
          maxLength={3000}
          value={description}
          onChange={setDescription}
        />
        <Text tone="muted">Saved {saved} times</Text>
      </Space>
    </Card>
  );
}
```

### Without a label

A textarea with no visible `label` takes `ariaLabel`, so assistive tech can
still name it.

```tsx
import { Space, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function WithoutLabel() {
  const [notes, setNotes] = useState<string | undefined>(undefined);
  return (
    <Space direction="vertical">
      <TextArea
        name="notes"
        layout="inline"
        ariaLabel="Reading notes"
        placeholder="Reading notes"
        value={notes}
        onChange={setNotes}
      />
      <Text tone="muted">Characters: {notes?.length ?? 0}</Text>
    </Space>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` |  | Accessible name of the textarea when there is no visible `label`. With a `label`, the label names it and this is ignored. |
| `autoResize` | `boolean` | `false` | Grows to fit content, so it never scrolls. The minimum height is 7rem with it and 10rem without, set inline so a class can't lower it. |
| `label` | `string` |  | Visible label, linked to the textarea so it names it. |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal` and `vertical` paint a shaded card-header row with corners that follow surface depth ([corners](../corners.md)); `inline` paints nothing. |
| `maxLength` | `number` |  | Native limit, plus an `n/max` counter once within `max(10% of max, 50)` characters; the counter turns red at the limit. |
| `name` (required) | `string` |  | The textarea's `name` and the key passed to `onValidChange`. |
| `onChange` | `(newValue: string \| undefined) => void` | `() => {}` | Receives the string, or `undefined` when emptied; not an event. Not called while `validate` fails. |
| `onValidChange` | `(fieldName: string, newValid: boolean) => void` | `() => {}` | Called with `name` and the new validity; fires only when validity flips. |
| `placeholder` | `string` |  | Placeholder text for the textarea. |
| `validate` | `(newValue: string) => boolean` | `() => true` | Receives the raw text on each keystroke; `false` turns the label red. |
| `value` (required) | `string \| undefined` | `''` | Typed as required (pass `undefined` for empty). Re-syncs into the field only when the prop changes. |
| `variant` | `'outlined' \| 'borderless'` | `'outlined'` | `'outlined'` has a border and the input background; `'borderless'` drops both and keeps its depth corners, so the browser's default textarea background shows (check it in dark mode). |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.cardHeader` | `#EEEEEE` | `#232427` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.fontFamily.body` | `system-ui, sans-serif` | `system-ui, sans-serif` |
| `theme.fontSize.lg` | `1rem` | `1rem` |
| `theme.fontSize.xxs` | `0.6rem` | `0.6rem` |
| `theme.lineHeight.tight` | `1` | `1` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.input` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxl` | `1rem` | `1rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.6.0 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px. A text field, `ChipsInput` box or field label directly on a Page also moves its text 16px in from the edge (8px elsewhere), the inset `Button` keeps, so it clears the deeper corner.
- **0.5.2** (2026-11-26): The visible `label` is linked to its field (`htmlFor` and a generated `id`), so it names the field and clicking it focuses the field. A new `ariaLabel` prop names a field that has no visible `label`; with a `label` it is ignored.

<!-- /generated:changelog -->
