# NumberInput

`import { NumberInput } from '@korzun/design/control'`

A single-line field for a number, with an optional label and validation. It
parses with `parseFloat` and reports `number | undefined`. Same label/layout
system as `TextInput`.

Use something else for: one of a few fixed numbers (`SegmentedControl` or
`Select`), free text (`TextInput`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | The input's `name` and the key passed to `onValidChange`. |
| `label` | `string \| undefined` | (required key) | **Must be passed, even as `label={undefined}`**: the type has no `?`. Not linked to the input (no `htmlFor`). |
| `value` | `number \| undefined` | (required) | Re-syncs into the field only when the prop changes. |
| `onChange` | `(value: number \| undefined) => void` | no-op | Receives `parseFloat(text)`, or `undefined` when emptied. **Not called while `validate` fails.** |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal`/`vertical` paint a `bg.cardHeader` row with `radius.md`. |
| `placeholder` | `string` | | |
| `validate` | `(text: string) => boolean` | empty or numeric | Receives the **raw text**. Replacing it replaces the numeric check, so include one yourself. |
| `onValidChange` | `(name: string, valid: boolean) => void` | no-op | Fires only when validity flips. |

No `className`, no `disabled`, no `min` / `max` / `step`.

## Behaviour to know

- It is a plain `<input>` (no `type="number"`, no `inputMode`), so phones show
  the full text keyboard and there are no spinner arrows.
- The default check accepts anything JavaScript reads as a number: `1.5`, `-3`,
  `1e3` (reported as `1000`).
- Invalid text stays visible with a red label and border; your state keeps the
  last valid number.

## Examples

```tsx
// In a Card form.
<NumberInput
  name="seriesIndex"
  label="Index"
  value={seriesIndex}
  onChange={setSeriesIndex}
/>

// A custom rule: still check the text is numeric.
<NumberInput
  name="coverWidth"
  label="Width"
  value={coverWidth}
  onChange={setCoverWidth}
  validate={(t) => t === '' || (/^\d+$/.test(t) && Number(t) <= 4096)}
  onValidChange={(field, ok) => setValid((s) => ({ ...s, [field]: ok }))}
/>
```

## Do / don't

- Do pass `label={undefined}` explicitly when there is no visible label.
- Do report `onValidChange` into the form and disable submit while any field is invalid.
- Don't expect integer-only input unless your `validate` enforces it.
