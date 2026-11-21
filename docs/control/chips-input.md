# ChipsInput

`import { ChipsInput } from '@korzun/design/control'`

A tag field: the current values render as coloured chips inside an input box,
typing filters a suggestion dropdown (a `Popover`), and Enter adds a chip. Fully
controlled: you own the `string[]`.

Use something else for: one value from a list (`Select`), one of a few fixed
options (`SegmentedControl`), free text (`TextInput`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string[]` | (required) | The chips. Controlled. |
| `suggestions` | `string[]` | (required) | Pass `[]` for none. Already-chosen values are hidden; matching is case-insensitive substring. |
| `onChange` | `(values: string[]) => void` | (required) | Receives the whole new array, not an event. |
| `allowCustom` | `boolean` | `true` | Enter (or Tab) adds the typed text as a chip. `false`: only suggestions can be added. |
| `label` | `string` | | **Ignored in the default `block` layout.** Set `layout="horizontal"` or `"vertical"` to show it. |
| `layout` | `'block' \| 'horizontal' \| 'vertical'` | `'block'` | `block` = the bare box, no label. `horizontal`/`vertical` add a label on a `bg.cardHeader` row (`radius.md`), like the other fields. |
| `placeholder` | `string` | | Shown only while there are no chips. |
| `chipColor` | `keyof theme.color.chip` | `'subject'` | `status`, `author`, `series`, `subject`, `book`, `entryType`, `user`, `rating`, `neutral`. |
| `dense` | `boolean` | `false` | Matches a standard input's height, so it lines up with `TextInput`/`Select` rows. Leave off for a roomy standalone tag box. |
| `disabled` | `boolean` | `false` | Disables typing and the chip remove buttons. |
| `name` | `string` | | Set on the text input only: form data gets the **half-typed text, not the chips**. Submit `value` yourself. |

No `className`. The label is linked to the input with a generated id.

## Keyboard

- ArrowDown / ArrowUp move the highlight; Enter or Tab adds the highlighted
  suggestion, else (with `allowCustom`) the trimmed typed text.
- **Tab with text typed adds a chip and keeps focus in the field** (it calls
  `preventDefault`); Tab on an empty field moves focus normally.
- Enter never submits the surrounding form while text is typed, even when
  nothing could be added.
- Backspace on an empty field removes the last chip.
- A value that matches an existing chip case-insensitively is not added.

## Examples

```tsx
// A standalone subjects box in its own Card.
<Card title="Subjects">
  <ChipsInput
    value={subjects}
    suggestions={allSubjects}
    onChange={setSubjects}
    placeholder="Add subject…"
  />
</Card>

// A labelled row in a form, restricted to known users.
<ChipsInput
  name="users"
  label="Users"
  layout="horizontal"
  dense
  value={selectedUsers}
  suggestions={userNames}
  onChange={setSelectedUsers}
  allowCustom={false}
  chipColor="user"
  disabled={loadingUsers}
  placeholder={loadingUsers ? 'Loading…' : 'Add users…'}
/>
```

## Do / don't

- Do set `layout="horizontal"` and `dense` when it sits among other form fields
  in a `Card`; otherwise the label silently disappears.
- Do pick a `chipColor` that matches how the same values are tagged elsewhere.
- Don't rely on `name` for form submission.
- Don't use it inside a modal `<dialog>` without testing: the dropdown portals
  outside the dialog's top layer (see [popover](popover.md)).
