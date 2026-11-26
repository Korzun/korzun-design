---
title: MetadataList
description: A wrapping row of small labelled values, typically the body of a Card describing one record.
category: Data display
---
# MetadataList

<!-- generated:import -->

`import { MetadataList, type Metadata, type MetadataListProps } from '@korzun/design/component'`

<!-- /generated:import -->

A wrapping row of small labelled values ("Slug my-kindle", "Cover fit
Contain"): each pair is a faint, capitalized title followed by its value, laid
out inline with `space.lg` between pairs and `space.sm` between wrapped lines.
Typically the body of a `Card` describing one record.

Use something else for: unlabelled secondary data on a row (`MetaLine`),
editable fields (controls in `@korzun/design/control`).

## Usage

### Titles and keys

Titles are CSS `text-transform: capitalize`: "cover fit" displays as
"Cover Fit". Write titles in the case you want only if that agrees.

**Keys are `title + value`.** With an element as `value` the key becomes
`"Title[object Object]"`, so two entries with the same title and element
values collide (React key warning, possible wrong reconciliation). Keep
titles unique.

Its building block (`Metadata` component) is internal; only the `Metadata`
**type** is exported.

### Values

Each value is truncated to `theme.size.metadataValue` (`15rem`) with an
ellipsis and never wraps (`white-space: nowrap`). Long values are cut off;
there is no tooltip. Every entry renders, including ones whose value is
`null`/`undefined` (title with an empty value). Filter the array first.

### Styling

No `className`.

## Do / don't

- Do keep values short (a word, a number, a small `Tag size="sm"`).
- Do keep `title`s unique within one list.
- Don't use it for long text such as descriptions; it truncates at 15rem.
- Don't include entries with missing values; filter them out.

<!-- generated:examples -->

## Examples

### Basic

The body of a `Card` describing one record: short text values and a small `Tag` as a value. The header action flips the grayscale entry.

```tsx
import { Card, MetadataList, Tag } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [grayscale, setGrayscale] = useState(false);
  return (
    <Card
      title="Kindle Scribe"
      headerAction={
        <Button type="link" onClick={() => setGrayscale((on) => !on)}>
          Toggle grayscale
        </Button>
      }
    >
      <MetadataList
        metadata={[
          { title: 'Slug', value: 'my-kindle' },
          { title: 'Cover size', value: '1860×2480' },
          { title: 'Grayscale cover', value: grayscale ? 'Yes' : 'No' },
          {
            title: 'Status',
            value: (
              <Tag size="sm" tone="success">
                Active
              </Tag>
            ),
          },
        ]}
      />
    </Card>
  );
}
```

### Long values

A value wider than its cap is cut off with an ellipsis and never wraps, so keep values short. Titles are capitalized by CSS: “cover fit” displays as “Cover Fit”.

```tsx
import { MetadataList } from '@korzun/design/component';

export default function Truncation() {
  return (
    <MetadataList
      metadata={[
        { title: 'cover fit', value: 'Contain' },
        { title: 'Path', value: '/library/science-fiction/frank-herbert/children-of-dune.epub' },
      ]}
    />
  );
}
```

### Optional entries

Every entry renders, even one with no value, so build the array without the entries you do not have. Here “Last sync” is added only once there is a value.

```tsx
import { Inline, MetadataList, Stack } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function OptionalEntries() {
  const [lastSync, setLastSync] = useState<string | undefined>(undefined);
  return (
    <Stack gap="md">
      <Inline>
        <Button onClick={() => setLastSync(lastSync ? undefined : '12 March 2026')}>
          {lastSync ? 'Forget sync' : 'Sync now'}
        </Button>
      </Inline>
      <MetadataList
        metadata={[
          { title: 'Slug', value: 'my-kindle' },
          ...(lastSync ? [{ title: 'Last sync', value: lastSync }] : []),
        ]}
      />
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `metadata` (required) | [Metadata](#metadata)`[]` |  | The pairs, in order. Every entry renders, even one whose value is `null` or `undefined` (its title shows with an empty value), so filter the array first. |

### Metadata

One labelled value in a `MetadataList`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | The label, shown faint and capitalized by CSS: `'cover fit'` displays as “Cover Fit”. It is part of the React key, so keep it unique within a list. |
| `value` (required) | `string \| ReactNode` |  | The value. It is cut off with an ellipsis at `theme.size.metadataValue` (`15rem`) and never wraps, with no tooltip. With an element as value the key becomes `Title[object Object]`, so entries that share a title and hold elements collide. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.size.metadataValue` | `15rem` | `15rem` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
