# TextArea

`import { TextArea } from '@korzun/design/control'`

A multi-line text field with an optional label, validation, an optional
auto-grow mode, and a character counter near `maxLength`. Same label/layout
system as `TextInput`.

Use something else for: single-line text (`TextInput`), tags (`ChipsInput`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | The textarea's `name` and the key passed to `onValidChange`. |
| `value` | `string \| undefined` | `''` | Typed as required. Re-syncs into the field only when the prop changes. |
| `onChange` | `(value: string \| undefined) => void` | no-op | Receives the string, **`undefined` when emptied**, not an event. **Not called while `validate` fails.** |
| `label` | `string` | | Not linked to the textarea (no `htmlFor`). |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal`/`vertical` paint a `bg.cardHeader` row with `radius.md`. |
| `variant` | `'outlined' \| 'borderless'` | `'outlined'` | `outlined` uses the input recipe (border, `bg.input`); `borderless` drops the border (keeps `radius.md`) and sets no background of its own, so the browser's default textarea background shows; check it in dark mode. |
| `autoResize` | `boolean` | `false` | Grows to fit content (no scrollbar). Min height 7rem with it, 10rem without; set inline, so a class can't lower it. |
| `maxLength` | `number` | | Native limit, plus a `n/max` counter once within `max(10% of max, 50)` characters; red at the limit. |
| `placeholder` | `string` | | |
| `validate` | `(value: string) => boolean` | `() => true` | `false` turns the label red. |
| `onValidChange` | `(name: string, valid: boolean) => void` | no-op | Fires only when validity flips. |

No `className`, no `disabled`, no `rows`, never resizable by the user
(`resize: none`).

## Examples

```tsx
// A note field in a Card form (default horizontal layout).
<TextArea name="note" label="Note" value={note} onChange={setNote} />

// A long description that grows as the user types, label above.
<TextArea
  name="description"
  layout="vertical"
  autoResize
  maxLength={3000}
  value={description}
  onChange={setDescription}
/>
```

## Do / don't

- Do use `autoResize` for long free text so the card doesn't scroll inside itself.
- Do set `maxLength` when the server has a limit; the counter only appears near it.
- Don't expect `onChange('')`; an empty field reports `undefined`.
- Don't try to shrink it below 7rem / 10rem with CSS; the min height is inline.
