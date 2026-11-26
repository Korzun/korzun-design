---
title: Page
description: The `<main>` of every screen: a centred column of Cards, plus back button, header and footer actions.
category: Layout
---
# Page

<!-- generated:import -->

`import { Page, type PageProps, type PageTypeValue } from '@korzun/design/component'`

<!-- /generated:import -->

The `<main>` of every screen: a centred 800px column (gutter `space.xxl`) that
stacks its children vertically with a fixed gap. A screen is a `Page` holding a
vertical stack of `Card`s, one per feature. Page also owns the screen's chrome:
the mobile back button, the header actions (a bar on desktop, a floating `⋯`
menu on mobile), and the footer actions row.

Use something else for: a sign-in or splash screen with no chrome
(`type="minimal"` here, then lay it out yourself), a section inside a screen
(`Card`).

## Usage

### Header slot

`header` is the page's own content for the header row, the row the desktop
actions bar occupies. Pass a search bar there rather than rendering it as the
first child: as a child it would sit below the reserved row and start this page
lower than every other page.

### Behaviour

- Page marks everything inside it (header, content, footer actions, every `type`) as surface depth 0, so controls and cards inside pick their corner radius from where they sit; see `Surface`.
- **The header row is always reserved on default pages**, even with no actions
  and no `header` (min-height `2.25rem` on desktop), so content starts at the
  same height on every page. On mobile the row collapses (`display: contents`).
- On mobile the back button and the actions menu sit in a **sticky** row at the
  top that rides up with the page and then pins (at
  `theme.layout.floatingControlTopBase`); it also renders on `minimal` pages
  if you pass `back` or `headerActions`.
- `footerActions` is a plain `PageFooterActions` row after the children. It is
  not sticky.
- The column gap is `theme.fontSize.md` (0.875rem), a historical value, not a
  `space` token.
- `PageActionItem` and `FooterAction` are exported from
  `@korzun/design/control`, not from `component`.
- No `className`.

## Do / don't

- Do make each feature its own `Card`, as direct children of `Page`.
- Do pass `bottomNav` on every page shown under `NavMobile`.
- Do mark the one or two main actions `primary: true` so desktop shows them as
  buttons rather than burying them in "More…".
- Don't render your own search bar as the first child; use `header`.
- Don't wrap Page in another `<main>`; it is the `<main>`.
- Don't rely on `back` for desktop navigation.

<!-- generated:examples -->

## Examples

### Basic

A screen is a `Page` holding one `Card` per feature as direct children. The
header row stays reserved above the first card even with no actions, so every
page starts its content at the same height.

```tsx
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [loggedOut, setLoggedOut] = useState(false);
  return (
    <Page documentTitle="Settings">
      <Card title="Device password">
        <Text>Locks this device after five minutes away.</Text>
      </Card>
      <Card title="Change password">
        <Text>Choose a new password for your account.</Text>
      </Card>
      <Stack align="start">
        <Button danger onClick={() => setLoggedOut(true)}>
          Log out
        </Button>
        {loggedOut && <Text tone="muted">Logged out</Text>}
      </Stack>
    </Page>
  );
}
```

### Header actions

`headerActions` puts page-level actions in the header row. On desktop the
`primary` item is a button and the rest sit in the "More…" menu; mark the one
or two main actions `primary`. An action with `danger` and `separatorBefore`
sets itself apart.

```tsx
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function HeaderActions() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      headerActions={[
        { label: 'Edit', onClick: () => setLast('Edit'), primary: true },
        { label: 'Duplicate', onClick: () => setLast('Duplicate') },
        { label: 'Delete', onClick: () => setLast('Delete'), danger: true, separatorBefore: true },
      ]}
    >
      <Card title="Dune">
        <Text>Last action: {last}</Text>
      </Card>
    </Page>
  );
}
```

### Header slot

`header` is the page's own content for the header row, here a search field,
leading the actions bar in the same row. `actionsLabel` renames the overflow
trigger when every action lives in the menu.

```tsx
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function HeaderSlot() {
  const [query, setQuery] = useState<string | undefined>('');
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      header={<TextInput name="search" placeholder="Search" value={query} onChange={setQuery} />}
      actionsLabel="Actions"
      headerActions={[
        { label: 'Import', onClick: () => setLast('Import') },
        { label: 'Export', onClick: () => setLast('Export') },
      ]}
    >
      <Card title="Library">
        <Stack>
          <Text>Searching for: {query || 'nothing'}</Text>
          <Text tone="muted">Last action: {last}</Text>
        </Stack>
      </Card>
    </Page>
  );
}
```

### Footer actions

`footerActions` renders a `PageFooterActions` row after the children. It is
not sticky: it sits below the last card. Cancel and Save here, with Delete on
the leading side.

```tsx
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function FooterActions() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      footerActions={[
        { label: 'Delete', onClick: () => setLast('Delete'), danger: true, align: 'leading' },
        { label: 'Cancel', onClick: () => setLast('Cancel') },
        { label: 'Save', onClick: () => setLast('Save'), emphasis: true },
      ]}
    >
      <Card title="Details">
        <Text>Last pressed: {last}</Text>
      </Card>
    </Page>
  );
}
```

### Back and actions on mobile

On a phone `back` shows a round back button and `headerActions` collapses into
one "More actions" menu beside it, in a sticky row at the top. The `header`
content, a search field here, leads the page content.

```tsx
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function BackAndActionsOnMobile() {
  const [query, setQuery] = useState<string | undefined>('');
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      back="/library"
      header={<TextInput name="search" placeholder="Search" value={query} onChange={setQuery} />}
      headerActions={[
        { label: 'Edit', onClick: () => setLast('Edit'), primary: true },
        { label: 'Delete', onClick: () => setLast('Delete'), danger: true, separatorBefore: true },
      ]}
    >
      <Card title="Dune">
        <Stack>
          <Text>Searching for: {query || 'nothing'}</Text>
          <Text tone="muted">Last action: {last}</Text>
        </Stack>
      </Card>
    </Page>
  );
}
```

### Bottom nav

`bottomNav` reserves space under the content so the last card clears the
floating `NavMobile`. Pass it on every page shown under that bar.

```tsx
import { Card, NavMobile, Page, Text } from '@korzun/design/component';
import { BookIcon, HomeIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';

export default function BottomNav() {
  return (
    <>
      <NavMobile
        main={{
          items: [
            { to: '/library', label: 'Library', Icon: BookIcon, active: true },
            { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
          ],
          collapsed: { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false },
        }}
        settings={{
          items: [],
          collapsed: { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false },
        }}
        expanded="main"
      />
      <Page bottomNav>
        <Card title="Reading now">
          <Text>Dune</Text>
        </Card>
        <Card title="Up next">
          <Text>Hyperion</Text>
        </Card>
      </Page>
    </>
  );
}
```

### Minimal

`type="minimal"` drops the page's width, margin, padding, gap and header row,
for a sign-in or splash screen. You lay it out yourself.

```tsx
import { Page, Stack, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Minimal() {
  const [name, setName] = useState<string | undefined>('');
  const [signedIn, setSignedIn] = useState(false);
  return (
    <Page type="minimal">
      <Stack>
        <TextInput name="username" label="Username" value={name} onChange={setName} />
        <Button type="primary" onClick={() => setSignedIn(true)}>
          Sign in
        </Button>
        {signedIn && <Text tone="muted">Signed in as {name || 'nobody'}</Text>}
      </Stack>
    </Page>
  );
}
```

### Document title

`documentTitle` sets the browser tab's title when the page renders and
whenever it changes. It is not restored on unmount, so omit it when the app
manages titles itself.

```tsx
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function DocumentTitle() {
  const [title, setTitle] = useState<string | undefined>('Library');
  return (
    <Page documentTitle={title}>
      <Card title="Tab title">
        <Stack>
          <TextInput name="title" label="Title" value={title} onChange={setTitle} />
          <Text tone="muted">Tab title: {title}</Text>
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
| `children` | `React.ReactNode` |  | The screen's content, usually one `Card` per feature. Direct children get the column gap. |
| `actionsLabel` | `string` | `'More…'` | Label of the desktop overflow trigger, e.g. "Actions" when every action lives in the menu. |
| `back` | `string` |  | Route path for the back button, which shows on mobile only. It navigates to the path with `state: { restoreScroll: true }` (a new history entry); needs a react-router router above the page. |
| `bottomNav` | `boolean` | `false` | Mobile only: reserves space under the content for a floating `NavMobile`. |
| `documentTitle` | `string` |  | Sets `document.title` when given. The title is not restored on unmount, so leave it out when the app manages the title itself. |
| `footerActions` | `FooterAction[]` |  | Buttons in a row after the children (type from `@korzun/design/control`; shape in [FooterAction](../control/page-footer-actions.md#footeraction)), rendered as a `PageFooterActions` row. Not sticky. |
| `header` | `React.ReactNode` |  | Content for the header row, leading the desktop actions bar in the same row; ignored on `minimal`. See [Header slot](#header-slot). |
| `headerActions` | `PageActionItem[]` |  | Page-level actions (type from `@korzun/design/control`; shape in [PageActionItem](../control/page-actions-menu.md#pageactionitem)). On desktop `primary` items are buttons and the rest sit in a "More…" menu; on mobile all of them sit in a floating menu next to the back button. |
| `type` | `'default' \| 'minimal'` | `'default'` | `'minimal'` drops all layout styles (no width, margin, padding or gap) and the header row, for a screen with no chrome such as a sign-in. |

### Types

```ts
type PageTypeValue = 'default' | 'minimal';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.breakpoint.normal` | `@media (min-width: 641px)` | `@media (min-width: 641px)` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.layout.floatingControlTopBase` | `max(1.25rem, calc(env(safe-area-inset-top) + 1.5rem))` | `max(1.25rem, calc(env(safe-area-inset-top) + 1.5rem))` |
| `theme.layout.navHeightMobile` | `96px` | `96px` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.xxl` | `1rem` | `1rem` |
| `theme.space.xxxxl` | `1.5rem` | `1.5rem` |
| `theme.space.xxxxxl` | `2rem` | `2rem` |
| `theme.zIndex.sticky` | `1000` | `1000` |

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

<!-- /generated:changelog -->
