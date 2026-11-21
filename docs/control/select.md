# Select

`import { Select, type SelectOption, type SelectProps } from '@korzun/design/control'`

A single-value dropdown with type-to-search (on by default), an optional "Add:
…" entry for new values, a clear button, and a loading state. The dropdown is a
`Popover`, so it escapes clipping cards.

Use something else for: 2–5 options that fit in one row (`SegmentedControl`),
several values (`ChipsInput`), on/off (`Switch`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | Only lands on the search box while it is open; see "Forms". |
| `value` | `string \| undefined` | (required) | Controlled. A value not in `options` displays as the raw string. |
| `options` | `SelectOption[]` | (required) | `string`, or `{ label, value, description? }`. Mix freely. |
| `onChange` | `(value: string \| undefined) => void` | no-op | Receives the option's `value`, `undefined` from the clear button, or the trimmed typed text from "Add:". Not an event. |
| `surface` | `'card' \| 'page'` | `'card'` | Sets radius **and** elevation together; see "Choosing a surface". |
| `label` | `string` | | Visible label. |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal`/`vertical` paint a `bg.cardHeader` row. |
| `placeholder` | `string` | `'Select…'` | Shown when nothing is selected. |
| `searchable` | `boolean` | `true` | Opening swaps the trigger for a search box. `false`: a plain list, arrow keys only. |
| `allowCreate` | `boolean` | `false` | With a search query that matches no label exactly, adds an "Add: *query*" option. |
| `clearable` | `boolean` | `true` | Shows a ✕ when a value is set. Pass `false` for required fields. |
| `loading` | `boolean` | `false` | Shows a spinner and "Loading…"; can't open. |
| `disabled` | `boolean` | `false` | Faded to 50%; can't open; no clear button. |

No `className`.

## Choosing a surface

Follow [corners](../corners.md):

- Inside a `Card` or a modal: omit it (`'card'`, `radius.md`, no shadow).
- Directly on the page background (e.g. a global picker above the cards):
  `surface="page"` (`radius.lg` + `shadow.cardStack`, like a card).
- There is no `sm` option for a select nested inside an inset box.

## Forms

There is no hidden input carrying `value`: native `FormData` will not contain
the selection (only the search text while open). Keep `value` in state and
submit that. The `<label>` targets the search box, so it is not the closed
trigger's accessible name; the trigger announces the selected label or
placeholder.

## Keyboard

Closed: Enter, Space or ArrowDown open it. Open: ArrowUp/ArrowDown move (and
wrap), Enter selects, Escape or Tab close. The highlight starts on the first
option, not the current value.

## Examples

```tsx
// In a Card form: a fixed list, required.
<Select
  name="coverFit"
  label="Fit"
  value={coverFit}
  options={[
    { label: 'Contain', value: 'contain', description: 'Letterbox the cover' },
    { label: 'Cover', value: 'cover' },
  ]}
  onChange={setCoverFit}
  searchable={false}
  clearable={false}
/>

// A creatable field with async options.
<Select name="seriesName" label="Name" value={series || undefined}
  options={seriesNames} loading={seriesLoading} allowCreate onChange={setSeries} />

// On the page background, no label.
<Select name="library" surface="page" value={libraryId} options={libraries}
  onChange={setLibraryId} placeholder="Select user…" />
```

## Do / don't

- Do pass `clearable={false}` when an empty value is invalid.
- Do test before using inside a modal `<dialog>`: the dropdown portals outside
  the dialog's top layer (see [popover](popover.md)).
- Don't pass `surface="page"` inside a card.
