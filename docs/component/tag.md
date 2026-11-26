---
title: Tag
description: A small coloured chip for a category, status or value, optionally clickable.
category: Data display
---
# Tag

<!-- generated:import -->

`import { Tag, type TagProps, type TagTone } from '@korzun/design/component'`

<!-- /generated:import -->

A small coloured chip (an inline `<span>`) for a category, status, or value:
an author, a subject, "Read only". Optionally clickable, in which case it
becomes `role="button"` with `tabIndex=0` and Enter/Space.

Use something else for: an editable list of chips (`ChipsInput` in
`@korzun/design/control`), an action (`Button`), a count on a nav tab
(`NavItem.badge`).

## Usage

### Choosing a tone

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

### Styling

No `className`, no `ariaLabel`.

### Corners

At both sizes the corners follow surface depth: `md` in a Card or modal, `lg`
directly on a `Page`, `sm` one more level in (a `CardRow` in a Card, a Popover);
see [corners](../corners.md).

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

<!-- generated:examples -->

## Examples

### Basic

Chips beside a title: the label is the child. An author chip names a person; a subject or keyword chip needs no `tone`.

```tsx
import { Inline, Tag, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Inline>
      <Text weight="semibold">Middlemarch</Text>
      <Tag tone="author">George Eliot</Tag>
      <Tag>Fiction</Tag>
    </Inline>
  );
}
```

### Status tones

Status tones report a state: `success`, `warning`, `danger`, `info`, and `neutral` for a state with no meaning to signal. Each tag is labelled with its tone.

```tsx
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

export default function StatusTones() {
  return (
    <Stack gap="sm" align="start">
      <Inline>
        <Tag tone="success">Published</Tag>
        <Text tone="muted">success: something went well</Text>
      </Inline>
      <Inline>
        <Tag tone="warning">Overdue</Tag>
        <Text tone="muted">warning: needs attention soon</Text>
      </Inline>
      <Inline>
        <Tag tone="danger">Failed</Tag>
        <Text tone="muted">danger: something failed or is blocked</Text>
      </Inline>
      <Inline>
        <Tag tone="info">Scheduled</Tag>
        <Text tone="muted">info: neutral news</Text>
      </Inline>
      <Inline>
        <Tag tone="neutral">No change</Tag>
        <Text tone="muted">neutral: a state with no category</Text>
      </Inline>
    </Stack>
  );
}
```

### Label tones

Label tones name a kind of thing, so the same kind of thing is the same colour everywhere. `status` is a legacy label tone despite its name: it is listed for completeness, and a new state tag uses a status tone. Each tag is labelled with its tone.

```tsx
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

export default function LabelTones() {
  return (
    <Stack gap="sm" align="start">
      <Inline>
        <Tag tone="author">George Eliot</Tag>
        <Text tone="muted">author: a person who wrote something</Text>
      </Inline>
      <Inline>
        <Tag tone="series">Discworld</Tag>
        <Text tone="muted">series: a series name</Text>
      </Inline>
      <Inline>
        <Tag tone="subject">Fiction</Tag>
        <Text tone="muted">subject: a subject, genre or keyword</Text>
      </Inline>
      <Inline>
        <Tag tone="book">Middlemarch</Tag>
        <Text tone="muted">book: a book or title</Text>
      </Inline>
      <Inline>
        <Tag tone="entryType">Essay</Tag>
        <Text tone="muted">entryType: the kind of an entry or record</Text>
      </Inline>
      <Inline>
        <Tag tone="user">simon</Tag>
        <Text tone="muted">user: an app user or account</Text>
      </Inline>
      <Inline>
        <Tag tone="rating">4.5</Tag>
        <Text tone="muted">rating: a rating value</Text>
      </Inline>
      <Inline>
        <Tag tone="status">Legacy</Tag>
        <Text tone="muted">status: legacy label tone</Text>
      </Inline>
    </Stack>
  );
}
```

### Sizes

`md` is the regular chip and `sm` the compact one. `sm` sits inside a line of text without making the row taller.

```tsx
import { Inline, Stack, Tag, Text } from '@korzun/design/component';

export default function Sizes() {
  return (
    <Stack gap="sm" align="start">
      <Inline>
        <Tag size="md">Medium</Tag>
        <Text tone="muted">md</Text>
      </Inline>
      <Inline>
        <Tag size="sm">Small</Tag>
        <Text tone="muted">sm</Text>
      </Inline>
      <Text>
        Chapter 12 <Tag size="sm">Fiction</Tag> <Tag size="sm">Classic</Tag> in a line of text
      </Text>
    </Stack>
  );
}
```

### Clickable

`onClick` makes a tag a button: focusable, Enter and Space activate it, and hover deepens the tone. It receives no event. Here an author chip filters the list, and clearing the filter is an action, so it is a link `Button`.

```tsx
import { Inline, Stack, Tag, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const authors = ['George Eliot', 'Terry Pratchett', 'Ursula K. Le Guin'];

export default function Clickable() {
  const [author, setAuthor] = useState<string | undefined>(undefined);
  return (
    <Stack gap="sm" align="start">
      <Inline wrap>
        {authors.map((name) => (
          <Tag key={name} tone="author" onClick={() => setAuthor(name)}>
            {name}
          </Tag>
        ))}
        <Button type="link" onClick={() => setAuthor(undefined)}>
          Clear
        </Button>
      </Inline>
      <Text tone="muted">Filter: {author ?? 'none'}</Text>
    </Stack>
  );
}
```

### In a card

Compact `sm` chips in rows inside a `Card`. A kind of thing keeps its own tone; a state with no meaning to signal is `neutral`.

```tsx
import { Card, Inline, Stack, Tag, Text } from '@korzun/design/component';

export default function InCard() {
  return (
    <Card title="Metadata fixes">
      <Stack gap="sm">
        <Inline wrap gap="xs">
          <Text>Middlemarch</Text>
          <Tag size="sm" tone="author">
            George Eliot
          </Tag>
          <Tag size="sm">Fiction</Tag>
          <Tag size="sm">Classic</Tag>
        </Inline>
        <Inline gap="xs">
          <Text>Access</Text>
          <Tag size="sm" tone="neutral">
            Read only
          </Tag>
        </Inline>
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
| `children` (required) | `ReactNode` |  | The label. |
| `onClick` | `() => void` |  | Makes it a button: `role="button"`, focusable, pointer cursor, Enter/Space activate it, and hover deepens the tone. Receives no event. |
| `size` | `'sm' \| 'md'` | `'md'` | `sm` is compact (tight line height) and fits inside a normal text line, so rows keep the same height with or without chips. |
| `tone` | `'status' \| 'author' \| 'series' \| 'subject' \| 'book' \| 'entryType' \| 'user' \| 'rating' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'subject'` | Colour, from the theme's `color.chip` tokens. Status tones report a state; label tones name a kind of thing, and `status` is a legacy label tone despite its name. See [Choosing a tone](#choosing-a-tone). |

### Types

```ts
type TagTone = 'status' | 'author' | 'series' | 'subject' | 'book' | 'entryType' | 'user' | 'rating' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.chip.author.bg` | `rgba(26,122,82,0.08)` | `rgba(52,211,153,0.16)` |
| `theme.color.chip.author.border` | `rgba(26,122,82,0.22)` | `rgba(52,211,153,0.30)` |
| `theme.color.chip.author.text` | `#1a7a52` | `#7EE6B4` |
| `theme.color.chip.book.bg` | `rgba(14, 107, 125, 0.08)` | `rgba(45, 170, 190, 0.18)` |
| `theme.color.chip.book.border` | `rgba(14, 107, 125, 0.22)` | `rgba(45, 170, 190, 0.32)` |
| `theme.color.chip.book.text` | `#0e6b7d` | `#7FD0DE` |
| `theme.color.chip.danger.bg` | `rgba(255, 77, 79, 0.08)` | `rgba(255, 77, 79, 0.16)` |
| `theme.color.chip.danger.border` | `rgba(255, 77, 79, 0.22)` | `rgba(255, 77, 79, 0.3)` |
| `theme.color.chip.danger.text` | `#D9373e` | `#FF8E8E` |
| `theme.color.chip.entryType.bg` | `rgba(192, 65, 94, 0.08)` | `rgba(192, 65, 94, 0.18)` |
| `theme.color.chip.entryType.border` | `rgba(192, 65, 94, 0.22)` | `rgba(192, 65, 94, 0.32)` |
| `theme.color.chip.entryType.text` | `#c0415e` | `#E89BAC` |
| `theme.color.chip.info.bg` | `rgba(23, 119, 255, 0.08)` | `rgba(54, 150, 254, 0.18)` |
| `theme.color.chip.info.border` | `rgba(23, 119, 255, 0.24)` | `rgba(54, 150, 254, 0.36)` |
| `theme.color.chip.info.text` | `#0758d9` | `#87BAFF` |
| `theme.color.chip.neutral.bg` | `rgba(110, 110, 110, 0.08)` | `rgba(156, 161, 171, 0.16)` |
| `theme.color.chip.neutral.border` | `rgba(110, 110, 110, 0.22)` | `rgba(156, 161, 171, 0.3)` |
| `theme.color.chip.neutral.text` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.chip.rating.bg` | `rgba(181,69,27,0.08)` | `rgba(181,69,27,0.18)` |
| `theme.color.chip.rating.border` | `rgba(181,69,27,0.22)` | `rgba(181,69,27,0.32)` |
| `theme.color.chip.rating.text` | `#b5451b` | `#F2A07B` |
| `theme.color.chip.series.bg` | `rgba(26,95,168,0.08)` | `rgba(96,165,250,0.16)` |
| `theme.color.chip.series.border` | `rgba(26,95,168,0.22)` | `rgba(96,165,250,0.30)` |
| `theme.color.chip.series.text` | `#1a5fa8` | `#8EC3F5` |
| `theme.color.chip.status.bg` | `rgba(109,63,192,0.08)` | `rgba(167,139,250,0.16)` |
| `theme.color.chip.status.border` | `rgba(109,63,192,0.22)` | `rgba(167,139,250,0.30)` |
| `theme.color.chip.status.text` | `#6d3fc0` | `#C9B0F2` |
| `theme.color.chip.subject.bg` | `rgba(138,94,0,0.08)` | `rgba(217,168,67,0.16)` |
| `theme.color.chip.subject.border` | `rgba(138,94,0,0.22)` | `rgba(217,168,67,0.30)` |
| `theme.color.chip.subject.text` | `#8a5e00` | `#E8C879` |
| `theme.color.chip.success.bg` | `rgba(22, 163, 74, 0.08)` | `rgba(34, 197, 94, 0.16)` |
| `theme.color.chip.success.border` | `rgba(22, 163, 74, 0.22)` | `rgba(34, 197, 94, 0.3)` |
| `theme.color.chip.success.text` | `#15803d` | `#86EFAC` |
| `theme.color.chip.user.bg` | `rgba(162,58,149,0.08)` | `rgba(162,58,149,0.16)` |
| `theme.color.chip.user.border` | `rgba(162,58,149,0.22)` | `rgba(162,58,149,0.30)` |
| `theme.color.chip.user.text` | `#a23a95` | `#E7A6DA` |
| `theme.color.chip.warning.bg` | `rgba(234,179,8,0.16)` | `rgba(234,179,8,0.20)` |
| `theme.color.chip.warning.border` | `rgba(202,138,4,0.40)` | `rgba(234,179,8,0.42)` |
| `theme.color.chip.warning.text` | `#854d0e` | `#FDE047` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.fontSize.xs` | `0.7rem` | `0.7rem` |
| `theme.fontWeight.medium` | `500` | `500` |
| `theme.lineHeight.tight` | `1` | `1` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxxs` | `0.1rem` | `0.1rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.6.0** (2026-11-26): Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.5.2 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px. A text field, `ChipsInput` box or field label directly on a Page also moves its text 16px in from the edge (8px elsewhere), the inset `Button` keeps, so it clears the deeper corner.
- **0.1.0** (2026-11-21): `Tag` status tones: `success`, `warning` (yellow, stronger fill), `danger`, `info` (brand blue). New `color.warning` and `color.info` solid colours. Status tones report state; label tones name things. No visual change to existing tags.
- **0.0.3** (2026-11-21): `Tag` takes a `tone` prop that picks any `theme.color.chip` token (`status`, `author`, `series`, `subject`, `book`, `entryType`, `user`, `rating`, `neutral`) for text, background and border. It defaults to `subject`, so existing tags look the same. The clickable hover now comes from the tone too; with `subject` in light mode it matches the old amber.
- **0.0.3** (2026-11-21): New `color.chip.neutral` token: a quiet grey built from each mode's muted text colour (light 0.08 / 0.22 alphas, dark 0.16 / 0.30, matching the other chips in each mode).
- **0.0.3** (2026-11-21): `TagTone` type exported from the package root and `/component`.

<!-- /generated:changelog -->
