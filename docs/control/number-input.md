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
import { Stack, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [pages, setPages] = useState<number | undefined>(42);
  return (
    <Stack>
      <NumberInput name="pages" label="Pages" value={pages} onChange={setPages} />
      <Text tone="muted">Value: {pages === undefined ? 'undefined' : pages}</Text>
    </Stack>
  );
}
```

### Layouts

`horizontal` puts the label and field on one shaded row, `vertical` stacks
the label above the field on that row, and `inline` paints nothing around the
pair.

```tsx
import { Stack } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<number | undefined>(1);
  const [vertical, setVertical] = useState<number | undefined>(2);
  const [inline, setInline] = useState<number | undefined>(3);
  return (
    <Stack>
      <NumberInput
        name="horizontal"
        layout="horizontal"
        label="Horizontal"
        value={horizontal}
        onChange={setHorizontal}
      />
      <NumberInput
        name="vertical"
        layout="vertical"
        label="Vertical"
        value={vertical}
        onChange={setVertical}
      />
      <NumberInput
        name="inline"
        layout="inline"
        label="Inline"
        value={inline}
        onChange={setInline}
      />
    </Stack>
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
import { Stack, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function DefaultCheck() {
  const [rating, setRating] = useState<number | undefined>(4.5);
  const [valid, setValid] = useState(true);
  return (
    <Stack>
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
    </Stack>
  );
}
```

### Form in a card

The `horizontal` layout is made for a `Card` body. Index uses the built-in check.
Width replaces it with a rule that still checks the text is numeric, and both
fields report validity through `onValidChange`, so Save stays disabled while
either is invalid.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
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
      <Stack>
        <NumberInput
          name="seriesIndex"
          label="Index"
          value={seriesIndex}
          onChange={setSeriesIndex}
          onValidChange={onValidChange}
        />
        <NumberInput
          name="coverWidth"
          label="Width (up to 4096)"
          value={coverWidth}
          onChange={setCoverWidth}
          validate={(t) => t === '' || (/^\d+$/.test(t) && Number(t) <= 4096)}
          onValidChange={onValidChange}
        />
        {saved !== null && <Text tone="success">Saved: {saved}</Text>}
      </Stack>
    </Card>
  );
}
```

### Without a label

`label` is a required key: pass `label={undefined}` when there is no visible
label, name the field with `ariaLabel`, and describe it with a `placeholder`.

```tsx
import { Inline, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function WithoutLabel() {
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  return (
    <Inline>
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
    </Inline>
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
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal` and `vertical` paint a shaded card-header row with `md` corners; `inline` paints nothing. |
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
| `theme.radius.md` | `8px` | `8px` |
| `theme.recipe.input` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.6.0** (2026-11-26): The visible `label` is linked to its field (`htmlFor` and a generated `id`), so it names the field and clicking it focuses the field. A new `ariaLabel` prop names a field that has no visible `label`; with a `label` it is ignored.

<!-- /generated:changelog -->
