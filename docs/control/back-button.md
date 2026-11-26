---
title: BackButton
description: A round glass "Back" button for mobile that navigates to a fixed path.
category: Navigation
---
# BackButton

<!-- generated:import -->

`import { BackButton, type BackButtonProps } from '@korzun/design/control'`

<!-- /generated:import -->

A round glass "Back" button that navigates to a fixed path. It is mobile-only:
at widths of 641px and up it renders `display: none`, because desktop has its
own navigation. Usually you don't render it yourself: pass `back` to `Page`.

Use something else for: any other action (`Button`), header actions
(`PageActionsMenu` / `PageActionsBar`, also via `Page`).

## Usage

### Navigation

- **It pushes `to`, it does not go back in history.** Click (or Enter / Space)
  calls `navigate(to, { state: { restoreScroll: true } })`: a new history entry,
  with a state flag asking the destination's scroll manager to restore its
  remembered position instead of jumping to the top.
- Requires a `react-router` (v8, a peer dependency) router above it; it calls
  `useNavigate()` and throws without one.

### Appearance

- Renders a `<div role="button" tabIndex={0} aria-label="Back">` with a
  left-pointing chevron, 46×46px, `radius.circle`, `recipe.glass`.
- It does not position itself. `Page` puts it in its sticky controls row; if
  you render it elsewhere, you place it.
- That is the whole API. No `className`, no label, no `onClick`.

## Do / don't

- Do use `Page back="…"` instead of rendering `BackButton` directly, so it lines
  up with the mobile actions menu.
- Do pass the logical parent route (`/library`, the book page), not a guess at
  the previous URL: it always goes to `to`.
- Don't expect it on desktop; it is hidden at 641px and up.
- Don't wrap it in a `<button>` or `<a>`, or try to restyle it: there is no
  `className`.

<!-- generated:examples -->

## Examples

### Basic

A round glass button that pushes `to` as a new history entry, asking the
destination to restore its scroll position. It does not go back in history,
so pass the logical parent route. Mobile only: it is hidden at 641px and up,
where the desktop navigation takes over. It does not position itself, so you
place it in your own row.

```tsx
import { Inline } from '@korzun/design/component';
import { BackButton } from '@korzun/design/control';

export default function Basic() {
  return (
    <Inline>
      <BackButton to="/library" />
    </Inline>
  );
}
```

### In a page

Usually you do not render it yourself: pass `back` to `Page`, which puts the
button in its sticky controls row on mobile, beside the page's actions menu
(`headerActions`).

```tsx
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function InPage() {
  const [status, setStatus] = useState('Unread');
  return (
    <Page
      back="/library"
      headerActions={[
        { label: 'Mark as read', onClick: () => setStatus('Read'), primary: true },
        { label: 'Mark as unread', onClick: () => setStatus('Unread') },
      ]}
    >
      <Card title="Dune">
        <Stack>
          <Text>Frank Herbert, 1965.</Text>
          <Text tone="muted">Status: {status}</Text>
        </Stack>
      </Card>
    </Page>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `to` (required) | `string` |  | Path to navigate to. Pushes a new history entry (it does not go back in history), asking the destination to restore its scroll position. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.normal` | `@media (min-width: 641px)` | `@media (min-width: 641px)` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.radius.circle` | `50%` | `50%` |
| `theme.recipe.glass` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
