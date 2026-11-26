---
title: CardRow
description: A compact card-shell row for a stack of list items, optionally clickable.
category: Layout
---
# CardRow

<!-- generated:import -->

`import { CardRow, type CardRowProps } from '@korzun/design/component'`

<!-- /generated:import -->

A compact card-shell row (card background, border, stacked shadow, 6px
padding) that sits on the page or in a Card, for a stack of list items. Optionally
clickable.

Use something else for: a shaded row inside a `Card` body (a row built on
`theme.recipe.row`), a section split (`CardDivider`), a key/value line
(`MetadataList`). Bookplate itself lists items with `<Card size="small" onClick>`.

## Usage

### Styling

No `className`, no `ariaLabel`, no `role`.

### Surprising behaviour

- **Not keyboard-reachable.** With `onClick` it still gets no `role="button"`
  and no `tabIndex`, so it cannot be focused; the Enter/Space handler only
  fires for keys bubbling from a focused child, and Space is not
  `preventDefault`ed (the page scrolls). For a keyboard-accessible clickable
  row, put a real control (`Button type="link"`) inside it.
- Bookplate itself does not use `CardRow`; it is the least-exercised layout
  primitive here.

### Corners

Follows depth: 16px (`radius.lg`) on the page, 8px (`md`) in a Card, `sm`
deeper. Content inside it steps down one level. See [corners](../corners.md).

## Do / don't

- Place it on the page or inside a `Card`; its corners follow.
- Don't rely on `onClick` as the only way to reach an action from the keyboard.

<!-- generated:examples -->

## Examples

### Basic

A stack of compact rows on the page. With `onClick` a row gets a pointer cursor and fires on
click, but it cannot be focused, so each row also holds a link `Button` with an `ariaLabel`:
the keyboard-reachable way to the same action. A row without `onClick` is plain content.

```tsx
import { CardRow, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const uploads = ['middlemarch.epub', 'persuasion.epub', 'villette.epub'];

export default function Basic() {
  const [opened, setOpened] = useState<string | undefined>();
  return (
    <Stack>
      {uploads.map((fileName) => (
        <CardRow key={fileName} onClick={() => setOpened(fileName)}>
          <Inline justify="between">
            <Text>{fileName}</Text>
            <Button type="link" ariaLabel={`Open ${fileName}`} onClick={() => setOpened(fileName)}>
              Open
            </Button>
          </Inline>
        </CardRow>
      ))}
      <CardRow>
        <Text>Not clickable</Text>
      </CardRow>
      <Text tone="muted">Opened: {opened ?? 'nothing yet'}</Text>
    </Stack>
  );
}
```

### On the page and in a Card

A row's corner follows where it sits: `lg` (16px) on the page, `md` (8px) inside a Card. The
content inside a row steps down one level too.

```tsx
import { Card, CardRow, Stack, Text } from '@korzun/design/component';

export default function Depth() {
  return (
    <Stack>
      <CardRow>
        <Text>On the page (16px)</Text>
      </CardRow>
      <Card title="Card">
        <CardRow>
          <Text>In a Card (8px)</Text>
        </CardRow>
      </Card>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | Row content. It sits one surface level deeper than the row. |
| `onClick` | `() => void` |  | Adds a pointer cursor; fires on click and Enter/Space. The row has no `role` or `tabIndex`, so keys only reach it from a focused child, and Space still scrolls the page. For a keyboard-reachable action, put a real control such as a link `Button` inside. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.card` | `#FCFCFC` | `#1A1B1E` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.card.shell` | `recipe` | `recipe` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.5.0** (2026-11-24): Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- **0.5.0** (2026-11-24): **Visible changes:**
  - Buttons in a Card default to 8px (they were 16px unless `radius="card"` was set), and Buttons in a Dialog body are 8px.
  - Selects directly on a Page get the page look (16px and the card shadow); in a Card or Dialog they stay 8px. This includes Selects in your own boxes on a Page (a `useModalDialog` modal, a `recipe.card.shell` or `recipe.row` box), because depth cannot see hand-drawn boxes: wrap their contents in `Surface`, or pass `surface="card"`.
  - Without a Page, a bare `Card` counts as depth 0: its Buttons go from 16px to 8px, a Card nested in it steps down, and a `CardRow` in it is 8px.
  - A Card nested in a Card or Dialog steps down (8px, then 4px), and so do its Buttons and Selects; `size="small"` keeps its extra 1px.
  - `CardRow` is 16px on a Page and 8px inside a Card (it was always 16px).
  - Buttons and Selects inside a Popover or Menu are 4px.
- **0.0.6** (2026-11-21): `CardRow` drops its off-scale `12px` corner and takes `radius.lg` from the card shell, since a row sits on the page background. Its stories now render it on the page, not inside a `Card`. **Visible change:** the corners get rounder (12px to 16px).

<!-- /generated:changelog -->
