---
title: Table
description: A generic data table that scrolls in its own box on a wide screen and stacks each row, labelled, on a phone.
category: Data display
---
# Table

<!-- generated:import -->

`import { Table, type TableColumn, type TableProps } from '@korzun/design/component'`

<!-- /generated:import -->

A generic data table: pass `columns` and `rows` and it draws a bordered box
with a header row and a row per item. On a wide screen it scrolls sideways
inside its own box when it is too wide; on a phone each row stacks, with every
value labelled by its column title.

Use something else for: a short list of items with actions (`CardRow`), a
list of name and value pairs (`MetaLine`), a layout grid (`Stack`,
`Inline`). A table is for data with the same fields in every row.

## Usage

### Columns and rows

Each column has a `key` and a `title`. By default a cell shows the row's field
named by `key`; `render(row, index)` draws it instead, for a `Tag` or a
`Button`. A missing value (`null` or `undefined`) shows a dash; `0`, `false`
and `''` show as themselves. Type the table with its row type
(`<Table<Book> … />`) to check `render` and `rowKey`.

### `rowKey`

Name the field that identifies a row (`rowKey="id"`), or pass a function that
returns a unique string (`rowKey={(row, i) => row.isbn}`). It must be unique
and stable, as a React key is.

### Phone layout, `label` and `wide`

Below the mobile breakpoint the header is hidden for sighted users and each
row becomes a block: short cells share a line, each prefixed by its column
`title` and a colon. `label` renames that prefix, and `label: false` shows the
value bare (for a button). `wide: true` gives a cell the full width of the
stacked row, for a long description. Pass `ariaLabel` to name the table for
screen readers.

### Empty

With no rows the header stays. `empty` fills one row across all columns; omit
it and the table shows the header only.

### Scrolling and `minWidth`

The table never widens the page: it scrolls inside its box. `minWidth`
(`'40rem'`) keeps columns readable by making the table that wide on a wide
screen before it scrolls. A phone ignores it, because rows stack there.
`width` on a column sets its heading's width, `nowrap` keeps a value on one
line and `align: 'end'` right-aligns numbers.

### Corners

The box's corners follow where it sits: `radius.lg` on the page, `md` in a
Card, `sm` deeper, and a control in a cell sits one level deeper still. See
[corners](../corners.md).

## Do / don't

- Do use one table per dataset, with the same fields in every row.
- Do right-align numeric columns with `align: 'end'`.
- Don't use a table for layout; use `Stack` or `Inline`.

<!-- generated:examples -->

## Examples

### Basic

Columns name a field of each row; `rowKey` names the field that identifies a row. Values show as text, and a missing one shows a dash.

```tsx
import { Table } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', author: 'George Eliot', year: 1871 },
  { id: 2, title: 'Persuasion', author: 'Jane Austen', year: 1817 },
  { id: 3, title: 'Villette', author: 'Charlotte Brontë', year: 1853 },
  { id: 4, title: 'Anonymous pamphlet', author: null, year: 1790 },
];

export default function Basic() {
  return (
    <Table
      ariaLabel="Books"
      rowKey="id"
      rows={books}
      columns={[
        { key: 'title', title: 'Title' },
        { key: 'author', title: 'Author' },
        { key: 'year', title: 'Year' },
      ]}
    />
  );
}
```

### Custom cells

`render` draws a cell from its row. A `Tag` shows a status, and a link `Button` in a cell sits one surface level deeper than the table, so its corners step down.

```tsx
import { Table, Tag } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

type Book = { id: number; title: string; status: 'reading' | 'finished' | 'unread' };

const books: Book[] = [
  { id: 1, title: 'Middlemarch', status: 'reading' },
  { id: 2, title: 'Persuasion', status: 'finished' },
  { id: 3, title: 'Villette', status: 'unread' },
];

export default function CustomCells() {
  return (
    <Table<Book>
      ariaLabel="Reading list"
      rowKey="id"
      rows={books}
      columns={[
        { key: 'title', title: 'Title', wide: true },
        {
          key: 'status',
          title: 'Status',
          render: (book) => (
            <Tag tone={book.status === 'finished' ? 'success' : 'neutral'} size="sm">
              {book.status}
            </Tag>
          ),
        },
        {
          key: 'open',
          title: 'Open',
          label: false,
          render: (book) => (
            <Button type="link" onClick={() => undefined}>
              {`Open ${book.title}`}
            </Button>
          ),
        },
      ]}
    />
  );
}
```

### Empty

With no rows the header stays and `empty` fills one full-width row. Without `empty` the table shows its header only.

```tsx
import { Table } from '@korzun/design/component';

type Book = { id: number; title: string; author: string };

export default function Empty() {
  return (
    <Table<Book>
      ariaLabel="Books"
      rowKey="id"
      rows={[]}
      empty="No books yet. Upload an EPUB to start your library."
      columns={[
        { key: 'title', title: 'Title' },
        { key: 'author', title: 'Author' },
      ]}
    />
  );
}
```

### In a card

A table inside a `Card` sits one level deeper than one on the page, so its corners are `md` (8px) instead of `lg` (16px).

```tsx
import { Card, Table } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', author: 'George Eliot' },
  { id: 2, title: 'Persuasion', author: 'Jane Austen' },
];

export default function InACard() {
  return (
    <Card title="Recently added">
      <Table
        ariaLabel="Recently added"
        rowKey="id"
        rows={books}
        columns={[
          { key: 'title', title: 'Title' },
          { key: 'author', title: 'Author' },
        ]}
      />
    </Card>
  );
}
```

### Numbers

`align: 'end'` right-aligns a numeric column, header included, so digits line up. `nowrap` keeps a value on one line.

```tsx
import { Table } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', pages: 880, chapters: 86 },
  { id: 2, title: 'Persuasion', pages: 249, chapters: 24 },
  { id: 3, title: 'Villette', pages: 560, chapters: 42 },
];

export default function Numbers() {
  return (
    <Table
      ariaLabel="Book lengths"
      rowKey="id"
      rows={books}
      columns={[
        { key: 'title', title: 'Title', wide: true },
        { key: 'pages', title: 'Pages', align: 'end', nowrap: true },
        { key: 'chapters', title: 'Chapters', align: 'end', nowrap: true },
      ]}
    />
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` |  | The table's accessible name, announced by screen readers. |
| `className` | `string` |  | Extra class on the scrolling box, merged after the component's own. |
| `columns` (required) | [TableColumn](#tablecolumn)`<Row>[]` |  | The columns, in order. |
| `empty` | `ReactNode` |  | Shown in one full-width row when `rows` is empty. Without it the table shows its header only. |
| `minWidth` | `string` |  | A CSS minimum width for the table on a wide screen (`'40rem'`); it scrolls inside its box when narrower. A phone ignores it. |
| `rowKey` (required) | `keyof Row \| ((row: Row, index: number) => string)` |  | What identifies a row: one of its fields, or a function returning a unique string. |
| `rows` (required) | `readonly Row[]` |  | The data, one row each. |

### TableColumn

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end'` |  | Where the cell's content sits; `'end'` right-aligns numbers. Defaults to `'start'`. |
| `key` (required) | `string` |  | The field of the row this column shows by default, and the column's identity. |
| `label` | `string \| false` |  | What names a value on a phone, where the headings are hidden. Defaults to `title`; `false` shows the value bare. |
| `nowrap` | `boolean` |  | Keeps the cell's text on one line. |
| `render` | `(row: Row, index: number) => ReactNode` |  | Draws the cell instead of the row's `key` field. Receives the row and its index. |
| `title` (required) | `string` |  | The column heading. On a phone it also labels each value, unless `label` says otherwise. |
| `wide` | `boolean` |  | Takes a stacked row's full width on a phone, for a long description. |
| `width` | `string` |  | A CSS width for the heading cell (`'35%'`, `'8rem'`), on a wide screen. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.breakpoint.normal` | `@media (min-width: 641px)` | `@media (min-width: 641px)` |
| `theme.color.bg.card` | `#FCFCFC` | `#1A1B1E` |
| `theme.color.bg.cardHeader` | `#EEEEEE` | `#232427` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.border.light` | `#e5e7eb` | `#333439` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.text.secondary` | `#5A6375` | `#C8CBD2` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.fontWeight.semibold` | `600` | `600` |
| `theme.lineHeight.body` | `1.3` | `1.3` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xl` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): New `Table` (component): a generic data table. `columns` name a row field or `render` a cell, `rowKey` is a field name or a function, and `empty` shows one full-width row when there are no rows. It scrolls inside its own bordered box on a wide screen (`minWidth` sets a minimum width there only), and on a phone each row stacks with every value labelled by its column title (`label`, `wide`). `nowrap`, `align: 'end'` and `width` shape the cells. Its corners follow surface depth, and a control in a cell sits one level deeper. Falsy values (`0`, `false`, `''`) show as themselves; only `null` and `undefined` show a dash.

<!-- /generated:changelog -->
