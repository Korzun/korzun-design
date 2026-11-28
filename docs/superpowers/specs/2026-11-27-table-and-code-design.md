# Table and code: design

Date: 2026-11-27. Status: draft for approval.

## Intent

The docs site draws its own tables and code (`gallery/part/props-table.tsx`,
`tokens-table.tsx`, `example-block.tsx`, `markdown.tsx`, `copy-button.tsx`,
`layout/type.ts`, `layout/scroll-hint.ts`). None of it is in
`@korzun/design`, so an app cannot show a table or a code snippet in the
library's look. Move them into the library as generic components, then rebuild
the site on them so the API is proven by real use.

The user asked for a **generic `Table`** (not a props table) and picked the
**columns + rows** API (approach A below).

## Goals

- `Table`: a generic, data-driven display table in the site's look, usable in
  any app (Bookplate, Scribe), with the phone layout built in.
- `CodeBlock`: a block of code with an optional Copy button.
- `Code`: inline code in running text.
- A **Copy button recipe** (not a component): how to build a Copy button from
  `Button`, the clipboard and a `CheckIcon`.
- A syntax-colour palette in the theme, so any highlighter can colour code in
  the library's colours without the library depending on one.
- The site's props table, tokens table, example code, import line, fenced code
  in docs and inline code all use the above, and look the same as today.

## Non-goals (for this round)

- Table sorting, row selection, clickable rows, pagination, sticky header,
  virtualisation, editable cells. The columns API leaves room for them later.
- Syntax highlighting inside the library (no runtime dependencies is a hard
  rule). The caller highlights; the library colours.
- Line numbers, line highlighting, diff views in `CodeBlock`.

## Anti-goals

- A table that only fits the docs site (prop-name styling, union wrapping,
  type links stay in the gallery as cell renderers).
- Anything that adds a runtime dependency or a peer beyond React/react-jss.
- A visible change to the docs site from the migration (beyond the Copy
  feedback change noted below).

## Approaches considered (Table)

- **A. Columns + rows (picked).** `columns` describe each column once (`key`,
  `title`, optional `render`), `rows` is the data. Table knows each column's
  title, so the phone layout labels every value without the caller doing
  anything, and later features (sorting, empty state, row clicks) hang off a
  column or the table. Cost: a custom cell is a `render` function.
- **B. Styled HTML table.** `<Table>` adds the look; the caller writes
  `<thead>/<tr>/<td>`. Most flexible, but every cell needs a hand-written label
  for the phone layout, and sorting has nowhere natural to live.
- **C. Compound parts** (`Table.Row`, `Table.Cell label`). Between A and B;
  more to type than A and the label is still per cell.

A was picked: it keeps tables consistent across apps, and the phone layout is
the part people get wrong by hand.

## Table

Module `src/component/table`, section **Data display**. Exports `Table`,
`TableProps`, `TableColumn`.

```tsx
type TableColumn<Row> = {
  /** Identifies the column; also the field shown when there is no `render`. */
  key: string;
  /** Header text, and the label a value gets in the phone layout. */
  title: string;
  /** `false`: no label before this value in the phone layout (a row's name). Default: `title`. */
  label?: string | false;
  /** The cell's content. Default: `String(row[key])`, or `–` when it is null or undefined. */
  render?: (row: Row, index: number) => ReactNode;
  /** Column width on a wide screen (`'35%'`, `'8rem'`). Default: shared by content. */
  width?: string;
  /** In the phone layout, this cell takes a full line below the others (a description). */
  wide?: boolean;
  /** Keep the cell on one line (a name). */
  nowrap?: boolean;
  /** `end` for numbers. Default `start`. */
  align?: 'start' | 'end';
};

type TableProps<Row> = {
  columns: TableColumn<Row>[];
  rows: readonly Row[];
  /** A row's React key: a field name or a function. */
  rowKey: keyof Row | ((row: Row, index: number) => string);
  /** Accessible name of the table (rendered as a visually hidden caption). */
  ariaLabel?: string;
  /** Shown in place of the body when `rows` is empty. Default: no body. */
  empty?: ReactNode;
  /** Below this width the table scrolls sideways in its box instead of squeezing (`'40rem'`). */
  minWidth?: string;
  className?: string;
};
```

Look and behaviour, moved from `gallery/part/props-table.tsx` (`useTableStyle`):

- A bordered box (`border.default`), `bg.card`, rounded; a wide table scrolls
  sideways inside the box, never widening the page.
- Header row: `bg.cardHeader`, `semibold`, `text.secondary`, no wrapping.
  Cells: `space.lg` × `space.xl` padding, top-aligned, `border.light`
  between rows, `fontSize.md`, `lineHeight.body`.
- Phone (`theme.breakpoint.mobile`): each row stacks; the header is hidden
  visually but kept for screen readers; each value is preceded by its column
  title (`data-label`, `text.faint`); short cells share a line and `wide`
  cells take a full line. A column with `label: false` shows its value unlabelled. `minWidth` does not apply on a phone.
- Corners follow surface depth like `Card`: `lg` on a Page, `md` in a Card or
  Modal, `sm` deeper. The box provides one level deeper, so a Button or Tag
  in a cell takes the next radius down (as in `CardRow`).
- Semantics: a real `<table>` with `<thead>`/`<th scope="col">`; the caption
  carries `ariaLabel`.

## CodeBlock

Module `src/component/code-block`, section **Data display**. Exports
`CodeBlock`, `CodeBlockProps`.

```tsx
type CodeBlockProps = {
  /** The code: copied by the Copy button, and shown when there are no children. */
  code: string;
  /** Highlighted rendering of `code` (token spans from any highlighter). Default: `code` as plain text. */
  children?: ReactNode;
  /** Show a Copy button. Default false. */
  copyable?: boolean;
  /** The Copy button's accessible name ("Copy import"). Default "Copy code". */
  copyLabel?: string;
  /** Wrap long lines instead of scrolling sideways. Default false. */
  wrap?: boolean;
  className?: string;
};
```

- **One look, no variants** (the user's decision; any variant worth adding is
  raised with the user first, not added). `fontFamily.mono`, `fontSize.md`,
  line height 1.5, `bg.cardHeader`, `space.xl` padding, rounded by depth like
  Table. Directly on the page (no surface above) it also draws a
  `border.default` hairline in dark mode, where `bg.cardHeader` is 1.01:1 on
  the page, as `pageCodeEdge` does today; inside a Card, Modal or table cell it
  does not.
- Long lines scroll sideways and the right edge fades while more is hidden
  (`useScrollHint` and `scrollHint` move from the gallery into the library).
- Copy: a `text` Button at the top right, built as the Copy button recipe
  describes. Pressing it copies `code`, and the button turns into "Copied"
  with a `CheckIcon` for 2 seconds (the done state the Button doc recommends). On failure (no clipboard: insecure context)
  it reads "Could not copy" for 2 seconds. It does not toast, so CodeBlock
  works without a `ToastProvider`. **This changes the site's Copy feedback
  from a toast to the button itself.**
- Highlight colours: the block sets the `--code-*` CSS variables from
  `theme.color.code` (below), so the output of Shiki's css-variables theme
  (prefix `--code-`) is coloured with no extra setup. The variable names are
  part of the API and documented.

## Code (inline)

Module `src/component/code`, section **Typography**. Exports `Code`,
`CodeProps` (`children`, `className`). Renders `<code>`: mono, `0.875em` of
the surrounding text (so it scales in a heading), `space.xxs` side padding,
`radius.sm`, `bg.cardHeader`, breaks a long name only when it cannot fit
(`overflow-wrap: break-word`). Same rule for the dark-mode hairline as
CodeBlock: only directly on the page.

## Copy button recipe

The user decided against a Copy component (few libraries have one). Instead,
`docs/recipes/copy-button.md` with a runnable example under
`recipes/copy-button/`, following the Sign in recipe's shape: a `Button`
that writes text to the clipboard, then shows "Copied" with a `CheckIcon`
prefix for 2 seconds, "Could not copy" on failure, and keeps its width steady.
The gallery's own `CopyButton` (icon grid, example meta row, import line) is
rebuilt to match the recipe and stays in the gallery.

## Theme additions

- `theme.color.code`: `foreground`, `keyword`, `string`, `function`,
  `parameter`, `constant`, `punctuation`, `comment`, `link`, valued as the
  site's `useHighlightStyle` does today (chip text colours, `text.*`,
  `brand.default`) in light and dark.
- `theme.recipe.codeBlock` and `theme.recipe.inlineCode`: the two looks as
  recipes, for HTML the caller does not render through React (the docs'
  markdown is an HTML string). Being static, they carry the in-surface look
  (no hairline, `md` corners for the block); the gallery adds the page edge
  for markdown that sits on the page.

## Site migration

- `PropsTable` and `TokensTable` render through `Table`; the prop-name,
  union-wrapping, type-link and swatch cells stay in the gallery as `render`
  functions. The Name and Token columns use `label: false`. Recipe rows in the
  tokens table (one cell spanning Light and Dark today) move to their own
  `Table` with Token and Properties columns.
- `ExampleBlock` code, the import line and the alias box use `CodeBlock`; the
  example code's flush placement at the bottom of its card and the import
  line's inline Copy are site styles (`className`), not CodeBlock options;
  markdown `pre` and inline `code` use the recipes; `useHighlightStyle`,
  `codeBlock`, `inlineCode`, `pageCodeEdge`, `scrollHint` and
  `useScrollHint` are deleted from the gallery or reduced to the recipes.
- Screenshots before and after (desktop 1440 and phone 390, light and dark)
  of the Button page, the Tokens page and an example with code shown. Expected
  differences: Copy feedback, and code padding unified on `space.xl`. Anything
  else is a bug.

## Package rules that apply

Each new module gets a test, examples (`examples/NN-*.tsx` + preview), a doc
at `docs/component/<slug>.md` with front matter and regions, an AGENTS.md
index line, a slug in `scripts/docs-gen/categories.mjs`, `<Name>Props`
exported with JSDoc on every prop, and CHANGELOG bullets under 0.7.0
(`[Table]`, `[CodeBlock]`, `[Code]`, `[lightTheme, darkTheme]`). The
`new-component` skill covers the steps.

## Delivery

A new branch `org/4-table-code` stacked on `org/3-sections` (#26), its own PR.

## Left to the builder

- Internal file layout of each module, test cases beyond the behaviour above.
- Example content (use Bookplate-flavoured data: books, shelves, devices).
- Whether `useScrollHint` is exported publicly or kept internal to CodeBlock.
