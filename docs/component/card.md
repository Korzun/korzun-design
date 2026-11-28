---
title: Card
description: The bordered surface each feature on a screen lives in, with an optional header and footer.
category: Layout
---
# Card

<!-- generated:import -->

`import { Card, type CardProps } from '@korzun/design/component'`

<!-- /generated:import -->

The bordered surface every feature on a screen lives in: an optional header
(title, subtitle, header actions), a padded body, and an optional footer. A
screen is a `<Page>` holding a vertical stack of Cards, one per feature. It can
also be a whole clickable list row (`size="small"` with `onClick`).

Use something else for: a "nothing here" block on the bare page (`EmptyState`),
a disclosure section with no card chrome (`CollapsibleSection`), a modal
(`Dialog` / `ConfirmModal` in `@korzun/design/control`).

## Usage

The header renders only if one of `title`, `subTitle`, `headerAction`,
`onClickHeader`, or `isCollapsible` is set.

### Surprising behaviour

- **Keyboard on `onClick` is incomplete.** The root gets no `role` or
  `tabIndex`, so it is not focusable; its `onKeyDown` fires `onClick` on
  Enter/Space bubbling up from *any* focused child (an input inside a clickable
  card triggers it). Don't put form fields inside a clickable card.
- A header click on a collapsible card bubbles to the root, so `isCollapsible`
  together with `onClick` fires both.
- Collapsed content is unmounted, not hidden: child state resets on reopen.

### Corners

The corner follows depth: `radius.lg` on the page, `md` for a Card inside a
Card, `sm` deeper. A Card provides the next depth to its header, body and
footer, so nested Cards step down and Buttons inside take the matching radius
automatically (8px in a Card on a Page). See [corners](../corners.md).
`size="small"` insets its body by only 1px, so its corner is `calc(radius.md + 1px)`
(9px) on a page and `calc(radius.sm + 1px)` (5px) inside a Card: concentric with the `md`-cornered covers and rows flush inside it.

## Do / don't

- Do give each feature on a screen its own Card, stacked directly in `<Page>`.
- Do put row actions that must not fire by accident in `footer` of a
  collapsible card; they are unreachable while it is collapsed.
- Don't nest Cards just to group content; use `Divider`. When you do nest, corners step down automatically.
- Don't set `radius` on Buttons inside a Card: it follows depth, and an explicit `radius="card"` would stay 8px inside a nested Card, breaking the concentric corners.
- Don't expect `isCollapsible` cards to start open; pass `defaultCollapsed={false}`.
- Do use the exported `CardProps` type when wrapping Card.

<!-- generated:examples -->

## Examples

### Basic

A feature on a screen: `title`, a `subTitle`, a `headerAction`, a form in the body and its
submit button in the `footer`. The footer button reaches the form by `form` id, so it submits it.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [name, setName] = useState<string | undefined>('Kitchen frame');
  const [saved, setSaved] = useState('Kitchen frame');
  return (
    <Card
      title="Device name"
      subTitle="Shown on the frame"
      headerAction={
        <Button type="link" onClick={() => setName('Kitchen frame')}>
          Reset
        </Button>
      }
      footer={
        <Button type="primary" submit form="device-name">
          Save
        </Button>
      }
    >
      <form
        id="device-name"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(name ?? '');
        }}
      >
        <Stack>
          <TextInput name="name" label="Name" value={name} onChange={setName} />
          <Text tone="muted">Saved name: {saved}</Text>
        </Stack>
      </form>
    </Card>
  );
}
```

### Collapsible

`isCollapsible` turns the header into a toggle. A collapsible card starts collapsed, so the first
one is closed; pass `defaultCollapsed={false}` to start open, as the second one does. The
footer's destructive action is only reachable while the card is open.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Collapsible() {
  const [removed, setRemoved] = useState<string | undefined>();
  return (
    <Stack>
      <Card isCollapsible title="ada" subTitle="Starts collapsed">
        <Text>ada@example.com</Text>
      </Card>
      <Card
        isCollapsible
        defaultCollapsed={false}
        title="grace"
        subTitle="Starts open"
        footer={
          <Button type="link" danger onClick={() => setRemoved('grace')}>
            Delete user
          </Button>
        }
      >
        <Text>grace@example.com</Text>
      </Card>
      <Text tone="muted">Deleted: {removed ?? 'nobody'}</Text>
    </Stack>
  );
}
```

### Clickable rows

`size="small"` with `onClick` makes a whole-card list row: a pointer cursor and only 1px of body
padding, so the child supplies its own padding and corner. A `CardRow` inside is flush with the
card and concentric with it. Clicking anywhere on a row fires `onClick`.

```tsx
import { Card, CardRow, Stack, Text } from '@korzun/design/component';
import { useState } from 'react';

const books = ['Middlemarch', 'Persuasion', 'Villette'];

export default function ClickableRows() {
  const [opened, setOpened] = useState<string | undefined>();
  return (
    <Stack>
      {books.map((book) => (
        <Card key={book} size="small" onClick={() => setOpened(book)}>
          <CardRow>
            <Text>{book}</Text>
          </CardRow>
        </Card>
      ))}
      <Text tone="muted">Opened: {opened ?? 'nothing yet'}</Text>
    </Stack>
  );
}
```

### Header click

`onClickHeader` makes the header clickable. A click in `headerAction` does not reach it.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function HeaderClick() {
  const [event, setEvent] = useState('none yet');
  return (
    <Stack>
      <Card
        title="Library"
        onClickHeader={() => setEvent('header clicked')}
        headerAction={
          <Button type="link" onClick={() => setEvent('action clicked')}>
            Sync
          </Button>
        }
      >
        <Text>42 books</Text>
      </Card>
      <Text tone="muted">Last event: {event}</Text>
    </Stack>
  );
}
```

### Nested cards

A Card inside a Card steps its corner down one level: `lg` on the page, `md` inside a Card,
`sm` one level deeper. Each Card's Button follows the same depth, so pass no `radius`. Nest
for a group that is itself a feature; to split one body into sections use `Divider`.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Nested() {
  const [pressed, setPressed] = useState<string | undefined>();
  return (
    <Card
      title="Library (16px)"
      footer={<Button onClick={() => setPressed('Sync library')}>Sync library</Button>}
    >
      <Stack>
        <Text>The feature sits on the page.</Text>
        <Card
          title="Devices (8px)"
          footer={<Button onClick={() => setPressed('Pair device')}>Pair device</Button>}
        >
          <Stack>
            <Text>A group inside the feature, one level in.</Text>
            <Card title="Kitchen frame (4px)">
              <Text>Deeper Cards stay at the smallest step.</Text>
            </Card>
          </Stack>
        </Card>
        <Text tone="muted">Pressed: {pressed ?? 'nothing yet'}</Text>
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
| `children` | `ReactNode` |  | Body. A collapsible card unmounts it while collapsed, so child state resets on reopen. |
| `className` | `string` |  | On the outer element. Override with `'&&'` specificity, never `!important`. |
| `defaultCollapsed` | `boolean` | `true` | Starts a collapsible card collapsed; pass `false` to start it open. Uncontrolled: there is no `open` prop. |
| `footer` | `ReactNode` |  | Grey footer bar, children right-aligned. Clicks don't bubble to `onClick`. Hidden while a collapsible card is collapsed. |
| `headerAction` | `ReactNode \| ReactElement[]` |  | Right side of the header. Clicks and keys here don't bubble to `onClick` or the collapse toggle. |
| `isCollapsible` | `boolean` | `false` | Header becomes a `role="button"` toggle (Enter/Space) with a rotating chevron before the title. A header click still bubbles to `onClick`, so both fire. |
| `onClick` | `() => void` |  | Whole-card click; adds a pointer cursor. The card is not focusable: Enter/Space bubbling from any focused child fires it, so keep form fields out of a clickable card. |
| `onClickHeader` | `() => void` |  | Header click. Ignored when `isCollapsible` (the header toggles instead); its presence renders a header. |
| `size` | `'small' \| 'large'` | `'large'` | `'large'`: `space.xl` body padding. `'small'`: 1px body padding and a corner 1px over the next step down, for list rows; see [Corners](#corners). |
| `subTitle` | `string` |  | Small faint text after the title. |
| `title` | `string \| ReactNode` |  | Header title. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.fontSize.xs` | `0.7rem` | `0.7rem` |
| `theme.fontWeight.semibold` | `600` | `600` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.card.footer` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.card.header` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.card.shell` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xl` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.transition.medium` | `0.2s ease-in` | `0.2s ease-in` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): `CardDivider` is now `Divider` and works anywhere: directly in a Card or Dialog body it reaches the edges as before (cancelling `space.xl` in a large Card, 1px in a small one, `space.xxl` in a Dialog, where it used to overhang everything but a large Card), and on the page, in a `CardRow`, `Alert`, `Surface` or nested Card it spans its container. The new `bleed` prop overrides that. **Breaking:** the old names `CardDivider`, `CardDividerProps` and `CardDividerAlign` are removed; import `Divider`, `DividerProps` and `DividerAlign`.
- **0.5.0** (2026-11-24): Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- **0.5.0** (2026-11-24): **Visible changes:**
  - Buttons in a Card default to 8px (they were 16px unless `radius="card"` was set), and Buttons in a Dialog body are 8px.
  - Selects directly on a Page get the page look (16px and the card shadow); in a Card or Dialog they stay 8px. This includes Selects in your own boxes on a Page (a `useModalDialog` modal, a `recipe.card.shell` or `recipe.row` box), because depth cannot see hand-drawn boxes: wrap their contents in `Surface`, or pass `surface="card"`.
  - Without a Page, a bare `Card` counts as depth 0: its Buttons go from 16px to 8px, a Card nested in it steps down, and a `CardRow` in it is 8px.
  - A Card nested in a Card or Dialog steps down (8px, then 4px), and so do its Buttons and Selects; `size="small"` keeps its extra 1px.
  - `CardRow` is 16px on a Page and 8px inside a Card (it was always 16px).
  - Buttons and Selects inside a Popover or Menu are 4px.
- **0.0.6** (2026-11-21): `CardRow` drops its off-scale `12px` corner and takes `radius.lg` from the card shell, since a row sits on the page background. Its stories now render it on the page, not inside a `Card`. **Visible change:** the corners get rounder (12px to 16px).
- **0.0.6** (2026-11-21): `Card size="small"` writes its corner as `calc(radius.md + 1px)`: md plus its 1px inset, concentric with its flush `md` children. Same 9px as before, now derived from the token.

<!-- /generated:changelog -->
