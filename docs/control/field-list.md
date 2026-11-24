# FieldList

`import { FieldList, type ColumnDescriptor, type FieldRow } from '@korzun/design/control'`

An editable list of rows, each with one or more text/number inputs and a
remove button, plus a dashed "add" button underneath. Fully controlled: you own
the rows and apply every change. On phones a row's columns stack.

Use something else for: a list of single words or tags (`ChipsInput`), a fixed
set of fields (`TextInput` / `NumberInput` directly).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `rows` | `FieldRow[]` | (required) | `{ _key: string } & Record<string, string \| number \| undefined>`. `_key` must be stable and unique: it is the React key and part of each input's `name`. |
| `columns` | `ColumnDescriptor[]` | (required) | One input per column per row; see below. |
| `onAdd` | `() => void` | (required) | Append a row with a fresh `_key`. Receives no event. |
| `onRemove` | `(rowKey: string) => void` | (required) | |
| `onChange` | `(rowKey: string, fieldKey: string, value: string \| number \| undefined) => void` | (required) | `string` from a text column, `number` from a number column, `undefined` when a field is emptied. Not called while that field's `validate` fails. |
| `onValidChange` | `(fieldName: string, valid: boolean) => void` | | `fieldName` is `` `${rowKey}.${columnKey}` ``. Fires only when validity flips. |
| `addLabel` | `string` | (required) | Text of the add button ("Add identifier"). |

The add button follows surface depth: 16px directly on a Page, 8px in a Card
or Dialog, 4px deeper (8px with no Page, Dialog, Card, CardRow, Alert or Surface above it).

No `className`.

`ColumnDescriptor` is
`{ type: 'text' | 'number'; key: string; placeholder?: string; validate?: (text: string) => boolean }`.
A text column renders a `TextInput`, a number column a `NumberInput` (see
those docs for the controlled-ish behaviour). A number column shows a row value
only if it is a `number`; a numeric string displays as empty.

## Behaviour to know

- The add button is 8px outside any surface and follows surface depth inside
  one (a Card body, a Dialog, a Popover).
- Inputs have no labels; use `placeholder` to say what each column is.
- Every remove button is titled "Remove row" (its accessible name); they are not
  distinguished per row.

## Example

```tsx
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
      setIdentifiers((r) => r.map((row) => (row._key === key ? { ...row, [field]: value } : row)))
    }
    onValidChange={handleValidChange}
  />
</Card>
```

## Do / don't

- Do generate `_key` once per row (`crypto.randomUUID()`), never from the index.
- Do strip `_key` before sending rows to the server.
- Don't store numeric columns as strings; they won't display.
