# DateTimeInput

`import { DateTimeInput, type DateTimeInputProps } from '@korzun/design/control'`

A date with an optional time, edited through the browser's native date and time
pickers and stored as an ISO 8601 string. The time box stays disabled until
there is a date; clearing the date clears the time.

Use something else for: free text (`TextInput`), a year-only number
(`NumberInput`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | Date input's `name`; the time input is named `` `${name}Time` ``. |
| `value` | `string \| undefined` | (required) | ISO 8601: `2023`, `2023-06`, `2023-06-06`, or a timestamp. `undefined` and `''` mean no date. Re-syncs when the prop changes. |
| `onChange` | `(value: string \| undefined) => void` | no-op | Receives the recomposed string, not an event (see below). |
| `label` | `string` | | Linked to the date input. The time input is labelled `` `${label} time` `` (or `Time`). |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal`/`vertical` paint a `bg.cardHeader` row with `radius.md`. |

No `className`, no `disabled`, no `min` / `max`.

## Value format

| User has | `onChange` receives |
|---|---|
| no date | `undefined` |
| a date only | `'2023-06-06'` |
| date and time | `'2023-06-06T16:30:00Z'` |

- **The time is UTC, not local.** A stored `2015-08-04T22:30:00-05:00` displays
  as 2015-08-05, 03:30, and the user picks times in UTC too.
- Year and year-month values display as the 1st of the period (`1965` shows
  1965-01-01). Merely displaying doesn't rewrite them; editing does.
- An unreadable value (`'June 2023'`, `'2023-13-45'`) displays as empty.
- Native form data holds the date and the time as **two separate fields**
  (`name`, `nameTime`), not the composed value. Submit `value` from state.

## Example

```tsx
// In a Card form.
<DateTimeInput
  name="publishDate"
  label="Publish Date"
  value={publishDate}
  onChange={setPublishDate}
/>
```

## Do / don't

- Do keep the composed string from `onChange` in state and send that.
- Do tell users times are UTC if that matters for the field.
- Don't read `FormData.get(name)` expecting a timestamp; it is only the date part.
