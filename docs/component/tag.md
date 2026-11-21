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

`TagTone` is `keyof Theme['color']['chip']`. There are two groups: label tones
are **domain names** (what kind of thing the tag names) and status tones are
**meanings** (what state it reports). Neither group is a set of colour names:
never pick a tone for its colour. Pick by what the tag *is*:

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
| `status` | Legacy; kept for Bookplate's existing chips. Don't pick it for new state tags. |
| `author` | A person who wrote something. |
| `series` | A series name. |
| `subject` | A subject / genre / keyword. The default. |
| `book` | A book or title. |
| `entryType` | The kind of an entry or record. |
| `user` | An app user / account. |
| `rating` | A rating value. |

Note the name clash: `status` is a legacy label tone despite its name; for a state use `success`/`warning`/`danger`/`info`, or `neutral` when it carries no meaning.

Each tone has its own `text`, `bg`, and `border` in both light and dark themes.
A consumer's theme can't add tones; the list is fixed by the `Theme` type.

## Corners

`radius.md` at both sizes, which is right inside a Card or modal; see
[corners](../corners.md).

## Examples

```tsx
// Compact chips in a review row (inside a card).
{fix.toChips.map((c) => <Tag key={c} size="sm">{c}</Tag>)}

// A state with no meaning to signal: neutral.
<Tag size="sm" tone="neutral">{write ? 'Read & write' : 'Read only'}</Tag>

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
- Don't use `info` to look like a link (it shares a hue with links; use
  `Button type="link"` for actions).
- Don't use `status` for a new state tag; it is a legacy label tone.
- Don't nest a clickable Tag inside another clickable element (Button, a
  clickable Card); both would fire.
