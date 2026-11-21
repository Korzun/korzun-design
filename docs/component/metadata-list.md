# MetadataList

`import { MetadataList, type Metadata } from '@korzun/design/component'`

A wrapping row of small labelled values ("Slug my-kindle", "Cover fit
Contain"): each pair is a faint, capitalized title followed by its value, laid
out inline with `space.lg` between pairs and `space.sm` between wrapped lines.
Typically the body of a `Card` describing one record.

Use something else for: unlabelled secondary data on a row (`MetaLine`),
editable fields (controls in `@korzun/design/control`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `metadata` | `Metadata[]` | required | `Metadata` is `{ title: string; value: string \| ReactNode }`. |

No `className`.

## Surprising behaviour

- **Title is CSS `text-transform: capitalize`:** "cover fit" displays as
  "Cover Fit". Write titles in the case you want only if that agrees.
- **Each value is truncated** to `theme.size.metadataValue` (`15rem`) with an
  ellipsis and never wraps (`white-space: nowrap`). Long values are cut off;
  there is no tooltip.
- **Keys are `title + value`.** With an element as `value` the key becomes
  `"Title[object Object]"`, so two entries with the same title and element
  values collide (React key warning, possible wrong reconciliation). Keep
  titles unique.
- Every entry renders, including ones whose value is `null`/`undefined`
  (title with an empty value). Filter the array first.
- Its building block (`Metadata` component) is internal; only the `Metadata`
  **type** is exported.

## Examples

```tsx
<Card
  title={device.name}
  headerAction={<Button type="link" onClick={edit}>Edit</Button>}
>
  <MetadataList
    metadata={[
      { title: 'Slug', value: device.slug },
      { title: 'Cover size', value: `${device.coverWidth}×${device.coverHeight}` },
      { title: 'Grayscale cover', value: device.bwCover ? 'Yes' : 'No' },
      { title: 'Status', value: <Tag size="sm" tone="success">Active</Tag> },
    ]}
  />
</Card>
```

## Do / don't

- Do keep values short (a word, a number, a small `Tag size="sm"`).
- Do keep `title`s unique within one list.
- Don't use it for long text such as descriptions; it truncates at 15rem.
- Don't include entries with missing values; filter them out.
