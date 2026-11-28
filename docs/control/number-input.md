---
title: NumberInput
description: A single-line field that reports a number, with a label and validation.
category: Inputs
---
# NumberInput

<!-- generated:import -->

`import { NumberInput, type NumberInputProps } from '@korzun/design/control'`

<!-- /generated:import -->

A single-line field for a number, with an optional label and validation. It
parses with `parseFloat` and reports `number | undefined`. Same label/layout
system as `TextInput`.

Use something else for: one of a few fixed numbers (`SegmentedControl` or
`Select`), free text (`TextInput`).

## Usage

### Behaviour to know

- It is a plain `<input>` (no `type="number"`, no `inputMode`), so phones show
  the full text keyboard and there are no spinner arrows.
- The default check accepts text that both `Number()` and `parseFloat` read as a
  number: `1.5`, `-3`, `1e3` (reported as `1000`). `onChange` sends `parseFloat`
  of the text, so `0x10` passes but is reported as `0`.
- Invalid text stays visible with a red label and border; your state keeps the
  last valid number.

### What it has no prop for

No `className`, no `disabled`, no `min` / `max` / `step`.

## Do / don't

- Do pass `label={undefined}` explicitly when there is no visible label, and name the field with `ariaLabel`.
- Do report `onValidChange` into the form and disable submit while any field is invalid.
- Don't expect integer-only input unless your `validate` enforces it.

<!-- generated:examples -->

## Examples

### Basic

A controlled number field. `onChange` receives a number, not an event or the
text, and `undefined` once the field is emptied.

```tsx
import { Space, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [pages, setPages] = useState<number | undefined>(42);
  return (
    <Space direction="vertical">
      <NumberInput name="pages" label="Pages" value={pages} onChange={setPages} />
      <Text tone="muted">Value: {pages === undefined ? 'undefined' : pages}</Text>
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
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<number | undefined>(412);
  const [vertical, setVertical] = useState<number | undefined>(880);
  const [inline, setInline] = useState<number | undefined>(160);
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <NumberInput
          name="horizontal"
          layout="horizontal"
          label="Pages"
          value={horizontal}
          onChange={setHorizontal}
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="vertical"
        </Text>
        <NumberInput
          name="vertical"
          layout="vertical"
          label="Pages"
          value={vertical}
          onChange={setVertical}
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="inline"
        </Text>
        <NumberInput
          name="inline"
          layout="inline"
          label="Pages"
          value={inline}
          onChange={setInline}
        />
      </Space>
    </Space>
  );
}
```

### Default check

Without `validate` the field accepts empty text or text that both `Number()` and
`parseFloat` read as a number: try `1.5`, `-3` or `1e3` (reported as 1000).
`onChange` sends `parseFloat` of the text, so `0x10` passes but is reported
as 0. Other text turns the
label and border red, `onValidChange` fires once, and `onChange` is not called,
so the saved number stays at the last valid one. Type `abc` to see it.

```tsx
import { Space, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function DefaultCheck() {
  const [rating, setRating] = useState<number | undefined>(4.5);
  const [valid, setValid] = useState(true);
  return (
    <Space direction="vertical">
      <NumberInput
        name="rating"
        layout="vertical"
        label="Rating"
        value={rating}
        onChange={setRating}
        onValidChange={(_name, ok) => setValid(ok)}
      />
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved number: {rating === undefined ? 'undefined' : rating}</Text>
    </Space>
  );
}
```

### Form in a card

The `horizontal` layout is made for a `Card` body. Index uses the built-in check.
Width replaces it with a rule that allows whole numbers up to 4096, and both
fields report validity through `onValidChange`, so Save stays disabled while
either is invalid.

```tsx
import { Card, Space, Text } from '@korzun/design/component';
import { Button, NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function FormInCard() {
  const [seriesIndex, setSeriesIndex] = useState<number | undefined>(2);
  const [coverWidth, setCoverWidth] = useState<number | undefined>(600);
  const [valid, setValid] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const invalid = Object.values(valid).some((ok) => !ok);
  const onValidChange = (field: string, ok: boolean) => setValid((s) => ({ ...s, [field]: ok }));
  return (
    <Card
      title="Series"
      footer={
        <Button
          type="primary"
          disabled={invalid}
          onClick={() => setSaved(`Index ${seriesIndex ?? '–'}, width ${coverWidth ?? '–'}`)}
        >
          Save
        </Button>
      }
    >
      <Space direction="vertical">
        <NumberInput
          name="seriesIndex"
          label="Index"
          value={seriesIndex}
          onChange={setSeriesIndex}
          onValidChange={onValidChange}
        />
        <NumberInput
          name="coverWidth"
          label="Width"
          value={coverWidth}
          onChange={setCoverWidth}
          validate={(t) => t === '' || (/^\d+$/.test(t) && Number(t) <= 4096)}
          onValidChange={onValidChange}
        />
        {saved !== null && <Text tone="success">Saved: {saved}</Text>}
      </Space>
    </Card>
  );
}
```

### Without a label

`label` is a required key: pass `label={undefined}` when there is no visible
label, name the field with `ariaLabel`, and describe it with a `placeholder`.

```tsx
import { Space, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function WithoutLabel() {
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  return (
    <Space>
      <NumberInput
        name="quantity"
        layout="inline"
        label={undefined}
        ariaLabel="Quantity"
        placeholder="Quantity"
        value={quantity}
        onChange={setQuantity}
      />
      <Text tone="muted">Quantity: {quantity === undefined ? 'none' : quantity}</Text>
    </Space>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` |  | Accessible name of the input when `label` is `undefined`. With a `label`, the label names it and this is ignored. |
| `label` (required) | `string \| undefined` |  | Required key: pass `label={undefined}` for none. Linked to the input so it names it. |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal` and `vertical` paint a shaded card-header row with corners that follow surface depth ([corners](../corners.md)); `inline` paints nothing. |
| `name` (required) | `string` |  | The input's `name` and the key passed to `onValidChange`. |
| `onChange` | `(newValue: number \| undefined) => void` | `() => {}` | Receives `parseFloat(text)`, or `undefined` when emptied; not called while `validate` fails. |
| `onValidChange` | `(fieldName: string, newValid: boolean) => void` | `() => {}` | Called with `name` and the new validity; fires only when validity flips. |
| `placeholder` | `string` |  | Placeholder text for the input. |
| `validate` | `(newValue: string) => boolean` | accepts empty or numeric text | Receives the raw text. Replacing it drops the built-in check, so include one. |
| `value` (required) | `number \| undefined` |  | Current number. Re-syncs into the field only when the prop changes. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.cardHeader` | `#EEEEEE` | `#232427` |
| `theme.layout.controlHeight` | `2.0625rem` | `2.0625rem` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.input` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxl` | `1rem` | `1rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.6.0 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px. A text field, `ChipsInput` box or field label directly on a Page also moves its text 16px in from the edge (8px elsewhere), the inset `Button` keeps, so it clears the deeper corner.
- **0.5.2** (2026-11-26): The visible `label` is linked to its field (`htmlFor` and a generated `id`), so it names the field and clicking it focuses the field. A new `ariaLabel` prop names a field that has no visible `label`; with a `label` it is ignored.

<!-- /generated:changelog -->
