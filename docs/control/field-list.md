---
title: FieldList
description: An editable list of rows of text and number inputs, each with a remove button, plus an add button.
category: Inputs
---
# FieldList

<!-- generated:import -->

```ts
import {
  FieldList,
  type ColumnDescriptor,
  type FieldListProps,
  type FieldRow,
} from '@korzun/design/control';
```

<!-- /generated:import -->

An editable list of rows, each with one or more text/number inputs and a
remove button, plus a dashed "add" button underneath. Fully controlled: you own
the rows and apply every change. On phones a row's columns stack.

Use something else for: a list of single words or tags (`ChipsInput`), a fixed
set of fields (`TextInput` / `NumberInput` directly).

## Usage

### Columns

A text column renders a `TextInput`, a number column a `NumberInput` (see
those docs for the controlled-ish behaviour). A number column shows a row value
only if it is a `number`; a numeric string displays as empty.

### Corners

The add button follows surface depth: 16px directly on a Page, 8px in a Card
or Modal, 4px deeper (8px with no Page, Modal, Card, CardRow, Alert or Surface above it).

### Behaviour to know

- The add button is 8px outside any surface and follows surface depth inside
  one (a Card body, a Modal, a Popover).
- Inputs have no labels; use `placeholder` to say what each column is.
- Every remove button is titled "Remove row" (its accessible name); they are not
  distinguished per row.
- No `className`.

## Do / don't

- Do generate `_key` once per row (`crypto.randomUUID()`), never from the index.
- Do strip `_key` before sending rows to the server.
- Don't store numeric columns as strings; they won't display.

<!-- generated:examples -->

## Examples

### Basic

Rows of inputs with a remove button each and a dashed add button below. You
own the rows: every `onAdd`, `onRemove` and `onChange` is yours to apply, and
each row needs a stable `_key` made once (`crypto.randomUUID()`), never from
the index. Inputs have no labels, so `placeholder` says what each column is.

```tsx
import { Card } from '@korzun/design/component';
import { FieldList, type FieldRow } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [identifiers, setIdentifiers] = useState<FieldRow[]>([
    { _key: crypto.randomUUID(), scheme: 'isbn', value: '9780441172719' },
  ]);
  return (
    <Card title="Identifiers">
      <FieldList
        addLabel="Add identifier"
        columns={[
          { type: 'text', key: 'scheme', placeholder: 'Scheme (e.g. isbn)' },
          { type: 'text', key: 'value', placeholder: 'Value' },
        ]}
        rows={identifiers}
        onAdd={() => setIdentifiers((r) => [...r, { _key: crypto.randomUUID() }])}
        onRemove={(key) => setIdentifiers((r) => r.filter((row) => row._key !== key))}
        onChange={(key, field, value) =>
          setIdentifiers((r) =>
            r.map((row) => (row._key === key ? { ...row, [field]: value } : row))
          )
        }
      />
    </Card>
  );
}
```

### Number column and validation

A `number` column renders a `NumberInput` and reports a `number`, or
`undefined` when the field is emptied; a `text` column reports a string.
`validate` receives the raw text: while it fails, `onChange` is not called
and `onValidChange` reports that field once, when validity flips.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { FieldList, type FieldRow } from '@korzun/design/control';
import { useState } from 'react';

export default function NumberAndValidation() {
  const [rows, setRows] = useState<FieldRow[]>([
    { _key: crypto.randomUUID(), name: 'Dune', qty: 2 },
  ]);
  const [invalid, setInvalid] = useState<string[]>([]);
  return (
    <Card title="Order">
      <Stack>
        <FieldList
          addLabel="Add item"
          columns={[
            {
              type: 'text',
              key: 'name',
              placeholder: 'Title (letters only)',
              validate: (text) => /^[A-Za-z ]*$/.test(text),
            },
            { type: 'number', key: 'qty', placeholder: 'Quantity' },
          ]}
          rows={rows}
          onAdd={() => setRows((r) => [...r, { _key: crypto.randomUUID() }])}
          onRemove={(key) => setRows((r) => r.filter((row) => row._key !== key))}
          onChange={(key, field, value) =>
            setRows((r) => r.map((row) => (row._key === key ? { ...row, [field]: value } : row)))
          }
          onValidChange={(field, valid) =>
            setInvalid((names) => (valid ? names.filter((n) => n !== field) : [...names, field]))
          }
        />
        <Text tone="muted">
          Stored: {rows.map((row) => `${row.name ?? '–'} × ${row.qty ?? '–'}`).join(', ') || 'none'}
        </Text>
        <Text tone={invalid.length > 0 ? 'danger' : 'muted'}>
          {invalid.length > 0
            ? `Invalid: ${invalid.map((name) => name.split('.')[1]).join(', ')}`
            : 'All fields valid'}
        </Text>
      </Stack>
    </Card>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `addLabel` (required) | `string` |  | Text of the dashed add button ("Add identifier"). |
| `columns` (required) | [ColumnDescriptor](#columndescriptor)`[]` |  | One input per column per row; inputs have no labels, so use `placeholder`. A number column shows a row value only if it is a `number`: a numeric string shows as empty. |
| `onAdd` (required) | `() => void` |  | Append a row with a fresh `_key`. Receives no event. |
| `onChange` (required) | `(rowKey: string, fieldKey: string, newValue: string \| number \| undefined) => void` |  | `string` from a text column, `number` from a number column, `undefined` when emptied. Not called while that field's `validate` fails. |
| `onRemove` (required) | `(rowKey: string) => void` |  | Remove the row with this `_key`. |
| `onValidChange` | `(fieldName: string, isValid: boolean) => void` |  | `fieldName` is `${rowKey}.${columnKey}`. Fires only when validity flips. |
| `rows` (required) | [FieldRow](#fieldrow)`[]` |  | `_key` must be stable and unique: it is the React key and part of each input's `name`. |

### ColumnDescriptor

One column of a `FieldList`: a `TextInput` (`'text'`) or `NumberInput` (`'number'`) per row, keyed by `key`. `validate` receives the raw text. A number column shows a row value only if it is a `number`: a numeric string shows as empty.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `key` (required) | `string` |  | The row field this column reads and writes, and the end of each input's `name`. |
| `placeholder` | `string` |  | Says what the column is, since inputs have no labels. |
| `type` (required) | `'text' \| 'number'` |  | `'text'` renders a `TextInput`, `'number'` a `NumberInput`. |
| `validate` | `(v: string) => boolean` |  | Receives the raw text on each keystroke; while it returns `false`, `onChange` is not called. |

### FieldRow

A `FieldList` row: a stable unique `_key` plus one value per column key.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `_key` (required) | `string` |  | Stable and unique: it is the React key and part of each input's `name`. |

Also accepts: `Record<string, string | number | undefined>`.

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.xl` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
