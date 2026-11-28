---
title: MetaLine
description: A short run of data about one record, as a dotted line or labelled pairs, wrapping between data, never inside one.
category: Data display
---
# MetaLine

<!-- generated:import -->

```ts
import {
  MetaLine,
  type MetaLineItem,
  type MetaLinePair,
  type MetaLineProps,
} from '@korzun/design/component';
```

<!-- /generated:import -->

A short run of data about one record. Two looks:

- **A separated line**, a row's secondary line: "Frank Herbert · Book 3 · 42%".
  Pass `separator`.
- **Labelled facts**, a card's body: "Format EPUB   Size 2.1 MB". Pass
  `{ label, value }` items and no separator; items are spaced by gaps.

Either way it wraps *between* data, never inside one.

Use something else for: many fields, or the same fields across records
(`Table`), a row's primary title (`Text` or `Heading`).

## Usage

### Items and pairs

`items` holds nodes and `{ label, value }` pairs, mixed freely. A pair shows
its label in `text.faint`, capitalized by CSS (`'cover fit'` shows as "Cover
Fit"), then its value.

- `null`, `undefined` and `false` items are skipped, and so is a pair whose
  `value` is one of them, so pass optional data as `cond && value` or
  `{ label, value: maybe }`.
- `''` and `0` are kept; filter them yourself.
- **Renders `null`** when every item is skipped: no empty line is left behind.
- Items are keyed by position.

### Separator

`separator` takes one character (`'·'`, `'|'`, `'/'`); `''` counts as unset. It sits in a 1em
cell before each item, drawn by CSS (`::before`), so screen readers read only
the data, and the one that would lead a line is clipped: none dangles at a line
end or starts the next line. It is drawn in `text.muted`. Without
`separator`, items are `space.lg` apart and lines `space.sm` apart.

One character means one grapheme (an emoji with a skin tone counts as one). A
longer string such as `' | '` or `'->'` overflows the 1em cell and overlaps the
next item, so in development MetaLine logs a `console.warn` once per such
separator. It works in right-to-left text too: the clip uses logical
properties, so the line start is clipped on whichever side it is.

### Long data

A datum never wraps inside itself. One wider than the whole line ellipsizes.

### Typography

MetaLine sets no font size or colour of its own except the label and
separator colours; wrap it in `Text` to set the rest (`size="sm"` in a card
body, `tone="faint"` for a row's secondary line).

## Do / don't

- Do pass conditional data as `cond && value`; `false` is skipped.
- Do set typography by wrapping the line in `Text` (`size`, `tone`); the items inherit it.
- Don't join data into one string with your own " · ": wrapping then breaks
  inside a datum and the dots are read aloud.
- Don't pass empty strings; with a separator they leave a stray one.

<!-- generated:examples -->

## Examples

### Basic

A book row's secondary line: author, series and progress, separated by middots. Wrap it in `Text` to set the size and tone the items inherit.

```tsx
import { MetaLine, Stack, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Stack gap="xs">
      <Text weight="semibold">Children of Dune</Text>
      <Text as="div" size="sm" tone="faint">
        <MetaLine separator="·" items={['Frank Herbert', 'Dune #3', '42%']} />
      </Text>
    </Stack>
  );
}
```

### Conditional data

Pass optional data as `cond && value`: `false` is skipped and leaves no separator. When every item is skipped nothing renders, so the line leaves no gap behind.

```tsx
import { Inline, MetaLine, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function ConditionalData() {
  const [hasSeries, setHasSeries] = useState(true);
  const [hasProgress, setHasProgress] = useState(true);
  return (
    <Stack gap="md">
      <Inline>
        <Button onClick={() => setHasSeries((on) => !on)}>
          {hasSeries ? 'Remove series' : 'Add series'}
        </Button>
        <Button onClick={() => setHasProgress((on) => !on)}>
          {hasProgress ? 'Remove progress' : 'Add progress'}
        </Button>
      </Inline>
      <Stack gap="xs">
        <Text weight="semibold">Dune Messiah</Text>
        <Text as="div" size="sm" tone="faint">
          <MetaLine separator="·" items={[hasSeries && 'Dune #2', hasProgress && '42%']} />
        </Text>
      </Stack>
    </Stack>
  );
}
```

### Wrapping

When the line is too narrow it wraps between data, never inside one, and no separator is left at a line end or leading the next line.

```tsx
import { MetaLine, Text } from '@korzun/design/component';

export default function Wrapping() {
  return (
    <Text as="div" size="sm" tone="faint">
      <MetaLine
        separator="·"
        items={[
          'Frank Herbert',
          'Dune Chronicles #3',
          'Science fiction',
          'Hardcover, first edition',
          '612 pages',
          'Added 12 March 2026',
          'Last read on a Kindle Scribe',
          'Finished in 9 days',
          'Rated four stars',
          'Lent to a friend in April',
          'Recommended by the book club',
        ]}
      />
    </Text>
  );
}
```

### Elements as items

An item can be any node, such as a `time` element or a `Tag`.

```tsx
import { MetaLine, Tag, Text } from '@korzun/design/component';

export default function ElementItems() {
  return (
    <Text as="div" size="sm" tone="faint">
      <MetaLine
        separator="·"
        items={[
          <time key="added" dateTime="2026-03-12">
            12 March 2026
          </time>,
          'Kindle Scribe',
          <Tag key="sync" size="sm" tone="success">
            Synced
          </Tag>,
        ]}
      />
    </Text>
  );
}
```

### Labelled pairs

A card describing one record: `{ label, value }` items with no `separator` are spaced by gaps, each label faint and capitalized by CSS (“cover size” shows as “Cover Size”). A value can be any node, such as a `Tag`. A pair whose value is `undefined` is skipped, so “Last sync” appears only once there is one.

```tsx
import { Card, MetaLine, Tag, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function LabelledPairs() {
  const [lastSync, setLastSync] = useState<string | undefined>(undefined);
  return (
    <Card
      title="Kindle Scribe"
      headerAction={
        <Button type="link" onClick={() => setLastSync(lastSync ? undefined : '12 March 2026')}>
          {lastSync ? 'Forget sync' : 'Sync now'}
        </Button>
      }
    >
      <Text as="div" size="sm">
        <MetaLine
          items={[
            { label: 'slug', value: 'my-kindle' },
            { label: 'cover size', value: '1860×2480' },
            { label: 'last sync', value: lastSync },
            {
              label: 'status',
              value: (
                <Tag size="sm" tone="success">
                  Active
                </Tag>
              ),
            },
          ]}
        />
      </Text>
    </Card>
  );
}
```

### Separator choices

`separator` takes any one character, drawn between items by CSS. Pairs take a separator too.

```tsx
import { MetaLine, Stack, Text } from '@korzun/design/component';

const data = ['Frank Herbert', 'Dune #3', '42%'];

export default function SeparatorChoices() {
  return (
    <Text as="div" size="sm" tone="muted">
      <Stack gap="sm">
        <MetaLine separator="·" items={data} />
        <MetaLine separator="|" items={data} />
        <MetaLine separator="/" items={data} />
        <MetaLine
          separator="·"
          items={[
            { label: 'format', value: 'EPUB' },
            { label: 'size', value: '2.1 MB' },
          ]}
        />
      </Stack>
    </Text>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` |  | On the outer element. The font size and colour set here reach every item, and the separators scale with it. Override with `'&&'` specificity, never `!important`. |
| `items` (required) | [MetaLineItem](#types)`[]` |  | The data, in order: nodes and `{ label, value }` pairs, mixed freely. `null`, `undefined` and `false` items (and pairs with such a value) are skipped, and nothing renders when every item is. `''` and `0` are kept, so filter them yourself. |
| `separator` | `string` |  | One character (one grapheme) drawn between items (`'·'`, `'\|'`, `'/'`). It never dangles at a line break, works in right-to-left text, and is not read by screen readers. Unset or `''`: items are spaced by gaps instead. A longer string overflows its one-character cell and overlaps the next item; in development it logs a console warning once. |

### MetaLinePair

A labelled datum: a faint, CSS-capitalized label followed by its value.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Shown faint and capitalized by CSS: `'cover fit'` displays as “Cover Fit”. |
| `value` (required) | `ReactNode` |  | The value. When it is `null`, `undefined` or `false` the whole pair is skipped; `''` and `0` are kept. |

### Types

```ts
/** One datum: any node, or a labelled pair. */
type MetaLineItem = ReactNode | MetaLinePair;
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): `separator=""` now counts as unset (gaps, no empty cells); a separator longer than one character logs a development-only console warning once, since it overflows its cell; the separator clip uses logical properties, so right-to-left lines clip and place the separator correctly.
- **0.7.0** (2026-11-26): **Breaking:** without `separator` the items are spaced by gaps (`space.lg`, lines `space.sm`), not dots; pass `separator="·"` for the old look. `separator` takes any one character, drawn by CSS between items. Items can now be labelled pairs, `{ label, value }`, shown with a faint capitalized label, mixed with plain items; a pair whose value is `null`, `undefined` or `false` is skipped. New `MetaLineItem` and `MetaLinePair` types. MetaLine replaces `MetadataList`.

<!-- /generated:changelog -->
