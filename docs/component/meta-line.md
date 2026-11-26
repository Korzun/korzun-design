---
title: MetaLine
description: A row's secondary line: a few short data separated by middots that wrap between data, never inside one.
category: Data display
---
# MetaLine

<!-- generated:import -->

`import { MetaLine, type MetaLineProps } from '@korzun/design/component'`

<!-- /generated:import -->

A row's secondary line: a few short data ("Frank Herbert", "Book 3", "42%")
separated by middots. When too narrow, it wraps *between* data, never inside
one, and never leaves a separator dangling at a line end or leading the next
line. The separators are CSS (`::before`), not text, so screen readers read
only the data.

Use something else for: labelled key/value pairs (`MetadataList`), a row's
primary title (`Text` or `Heading`).

## Usage

### Behaviour

- Only `null`/`undefined`/`false` are skipped. `''` and `0` are kept and draw a
  separator with nothing (or `0`) after it; filter them yourself.
- A single datum wider than the line ellipsizes instead of wrapping.
- Items are keyed by index.

### Typography

MetaLine sets no font size or colour of its own except the separator colour
(`text.muted`); wrap it in `Text` to set the rest.

## Do / don't

- Do pass conditional data as `cond && value`; `false` is skipped.
- Do set typography by wrapping the line in `Text` (`size`, `tone`); the items inherit it.
- Don't join data into one string with your own " · ": wrapping then breaks
  inside a datum and the dots are read aloud.
- Don't pass empty strings; they leave a stray separator.

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
        <MetaLine items={['Frank Herbert', 'Dune #3', '42%']} />
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
          <MetaLine items={[hasSeries && 'Dune #2', hasProgress && '42%']} />
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

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` |  | On the outer element. The font size and colour set here reach every item, and the separators scale with it. Override with `'&&'` specificity, never `!important`. |
| `items` (required) | `ReactNode[]` |  | The data, in order. `null`, `undefined` and `false` are skipped, and nothing renders when every item is. `''` and `0` are kept and draw a separator, so filter them yourself. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
