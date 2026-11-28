# MetaLine absorbs MetadataList: design

Date: 2026-11-27. Status: approved (short design).

## Intent

`MetaLine` (unlabelled data separated by `·`) and `MetadataList` (faint-labelled
pairs separated by a gap) are the same thing, a short run of facts about one
record, with a slight visual difference. Keep one component, `MetaLine`, that
draws both looks. Pre-1.0, so breaking changes are fine (the owner accepted
them).

## Approaches

- **One look (dots for everything).** Simplest, but changes the book page.
- **Both looks, chosen by a `separator` prop (picked).** No separator: gaps.
  A separator: that character between items. The owner: "If the developer
  wants a separator they can set one. It should be a character not a token."
- A `variant` prop or a theme separator token: rejected (the owner asked for a
  literal character; whether `separator` is set already picks the look).

## Design

`MetaLine` (`src/component/meta-line`, Data display):

- `items: MetaLineItem[]`, where `MetaLineItem = ReactNode | { label: string; value: ReactNode }`.
  Plain items and labelled pairs may be mixed. A label is `text.faint` and
  CSS-capitalized (as `Metadata` today), followed by its value.
- Skipped: an item that is `null`, `undefined` or `false`, and a pair whose
  `value` is `null`, `undefined` or `false`. Nothing renders when every item is
  skipped. `''` and `0` are kept (as today).
- `separator?: string`, one character.
  - Unset: items are spaced `space.lg` apart, lines `space.sm` apart (the
    MetadataList look). No separators.
  - Set: today's MetaLine look: the character is drawn by CSS (`::before`) in a
    1em cell, the list is shifted left one cell and clipped, so no separator
    dangles at a line break; screen readers don't read it. The string is
    escaped for CSS `content` (quotes, backslashes, newlines), set through a
    CSS custom property or an inline-style-safe path, never injected as raw
    CSS.
- Font size and colour inherit from the surroundings (MetaLine today).
- An item never wraps inside itself; one wider than the line ellipsizes.
  MetadataList's 15rem cap on each value goes.
- `className` on the root, as today.

## Removed

The owner: "Drop MetadataList completely. We are still pre 1.0." So:

- `MetadataList`, `MetadataListProps` and the `Metadata` item type are removed,
  with no deprecated alias.
- The `metadata` and `metadata-list` folders and `docs/component/metadata-list.md`
  are removed; `metadata-list` leaves `categories.mjs`; its examples become
  MetaLine labelled-pair examples.
- `theme.size.metadataValue` (used only by MetadataList) is removed, and with it
  the `size` group if it is then empty.

## Breaking

- `MetaLine` without `separator` now shows gaps, not dots. Callers that want
  dots pass `separator="·"` (Bookplate's five rows on migration).
- A labelled pair with an empty value no longer renders its label.
- `MetadataList` is gone: use `MetaLine` with `{ label, value }` items.
- `theme.size.metadataValue` is gone.
- CHANGELOG under 0.7.0: `[MetaLine] **Breaking:** …`, `[MetadataList] **Breaking:** removed …`,
  `[lightTheme, darkTheme] **Breaking:** …`.

## Left to the builder

Test cases beyond the above, example content (Bookplate data), the exact CSS
mechanism for the separator character as long as it is escaped and covered by
a test with `'"'` and `'\\'`.
