# TextInput

`import { TextInput } from '@korzun/design/control'`

A single-line text (or password) field with an optional label, optional
validation, and a character counter that appears near `maxLength`. The default
`horizontal` layout puts the label and field on one shaded row, which is how
form fields look inside a `Card`.

Use something else for: multi-line text (`TextArea`), numbers (`NumberInput`),
picking from a list (`Select`), a list of tags (`ChipsInput`), dates
(`DateTimeInput`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | The input's `name` (form data) and the key passed to `onValidChange`. |
| `value` | `string \| undefined` | `''` | Typed as required: pass it, even as `undefined`. See "Controlled-ish" below. |
| `onChange` | `(value: string \| undefined) => void` | no-op | Receives the string, **`undefined` when the field is emptied**, not an event. **Not called while `validate` fails.** |
| `label` | `string` | | Visible label. Not linked to the input (`<label>` has no `htmlFor`). |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal`/`vertical` paint a `bg.cardHeader` row with `radius.md`; `inline` paints nothing. |
| `placeholder` | `string` | | |
| `password` | `boolean` | `false` | Renders `type="password"`. |
| `maxLength` | `number` | | Native limit, plus a `n/max` counter once within `max(10% of max, 10)` characters; red at the limit. |
| `validate` | `(value: string) => boolean` | `() => true` | Runs on each keystroke. `false` turns the label and border red. |
| `onValidChange` | `(name: string, valid: boolean) => void` | no-op | Fires only when validity flips. |
| `onKeyDown` | `(event: KeyboardEvent<HTMLInputElement>) => void` | | Passed through; this one does receive the event. |
| `autoComplete` | `HTMLInputAutoCompleteAttribute` | | Passed through. |
| `autoCapitalize` | `'none' \| 'sentences' \| 'words' \| 'characters'` | | Passed through. |
| `action` | `{ icon, action, danger? }` | | **Broken: do not use.** The icon button is drawn but its `action` callback is never wired up, so clicking does nothing. |

No `className`, no `disabled`, no `id`.

## Controlled-ish

The field keeps its own text. It re-syncs from `value` only when the `value`
prop changes. While `validate` fails, the field shows the invalid text but
`onChange` is not called, so your state keeps the last valid value. Track
`onValidChange` to block submit.

## Examples

```tsx
// Inside a Card form: default horizontal layout.
<TextInput
  name="new-password"
  label="New"
  password
  autoComplete="new-password"
  value={newPassword}
  onChange={(v) => setNewPassword(v ?? '')}
/>

// Validated, reporting validity to the form.
<TextInput
  name="name"
  label="Name"
  maxLength={64}
  validate={(v) => v.length <= 64}
  onValidChange={(field, ok) => setValid((s) => ({ ...s, [field]: ok }))}
  value={name}
  onChange={setName}
/>
```

## Do / don't

- Do keep the default `horizontal` layout for fields in a `Card` body; use
  `vertical` when the label is long or the field is wide.
- Do coalesce `undefined` (`v ?? ''`) if your state is a plain string.
- Don't pass an `action`; render a separate `Button` beside the field instead.
- Don't rely on clicking the label to focus the field; it isn't associated.
