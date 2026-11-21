# Tag

`import { Tag, type TagTone } from '@korzun/design/component'`

A small coloured chip (an inline `<span>`) for a category, status, or value:
an author, a subject, "Read only". Optionally clickable, in which case it
becomes `role="button"` with `tabIndex=0` and Enter/Space.

Use something else for: an editable list of chips (`ChipsInput` in
`@korzun/design/control`), an action (`Button`), a count on a nav tab
(`NavItem.badge`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | required | Label. |
| `tone` | `TagTone` | `'subject'` | Colour, from `theme.color.chip`. See below. |
| `size` | `'sm' \| 'md'` | `'md'` | `sm` is compact (tight line height) and fits inside a normal text line, so rows keep the same height with or without chips. |
| `onClick` | `() => void` | | Makes it a button: pointer cursor, focusable, hover deepens the tone. Receives no event. |

No `className`, no `ariaLabel`.

## Choosing a tone

`TagTone` is `keyof Theme['color']['chip']`, so the tones are **domain names**,
not colour names. Pick by what the tag *is*:

Status tones report a state:

| Tone | Use for |
|---|---|
| `success` | Something went well (Published, Paid). |
| `warning` | Needs attention soon (Overdue, Expiring). |
| `danger` | Something failed or is blocked (Failed, Rejected). |
| `info` | Neutral news (Scheduled, New). |
| `neutral` | A state with no category ("no change"): quiet grey. |

Label tones name a kind of thing:

| Tone | Use for |
|---|---|
| `status` | A generic state label (Pending, Active, Read only). Prefer a status tone above when the state has a meaning. |
| `author` | A person who wrote something. |
| `series` | A series name. |
| `subject` | A subject / genre / keyword. The default. |
| `book` | A book or title. |
| `entryType` | The kind of an entry or record. |
| `user` | An app user / account. |
| `rating` | A rating value. |

Note the name clash: `status` is a label tone (one of the eight above), not one
of the status tones.

Each tone has its own `text`, `bg`, and `border` in both light and dark themes.
A consumer's theme can't add tones; the list is fixed by the `Theme` type.

## Corners

`radius.md` at both sizes, which is right inside a Card or modal; see
[corners](../corners.md).

## Examples

```tsx
// Compact chips in a review row (inside a card).
{fix.toChips.map((c) => <Tag key={c} size="sm">{c}</Tag>)}

// A status, in neutral or status tone.
<Tag size="sm" tone="status">{write ? 'Read & write' : 'Read only'}</Tag>

// A clickable author chip that filters the list.
<Tag tone="author" onClick={() => setFilter({ author: name })}>{name}</Tag>
```

## Do / don't

- Do choose `tone` by meaning, so the same kind of thing is the same colour
  everywhere.
- Do use `tone="warning"` for "Overdue".
- Do use `size="sm"` inside text rows and lists.
- Don't use `neutral` just to make a tag grey when it has a category.
- Don't use `subject` or `author` to mean warning or success.
- Don't use `info` to look like a link.
- Don't nest a clickable Tag inside another clickable element (Button, a
  clickable Card); both would fire.
