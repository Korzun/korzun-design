# Page

`import { Page } from '@korzun/design/component'`

The `<main>` of every screen: a centred 800px column (gutter `space.xxl`) that
stacks its children vertically with a fixed gap. A screen is a `Page` holding a
vertical stack of `Card`s, one per feature. Page also owns the screen's chrome:
the mobile back button, the header actions (a bar on desktop, a floating `⋯`
menu on mobile), and sticky footer actions.

Use something else for: a sign-in or splash screen with no chrome
(`type="minimal"` here, then lay it out yourself), a section inside a screen
(`Card`).

## Props

| Prop            | Type                     | Default     | Notes                                                                                                                                                                                |
| --------------- | ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`      | `ReactNode`              |             | The Card stack. Direct children get the column gap.                                                                                                                                  |
| `type`          | `'default' \| 'minimal'` | `'default'` | `minimal` drops all layout styles (no width, margin, padding, gap) and the header row.                                                                                               |
| `back`          | `string`                 |             | Route path for the back button. **Mobile only**: there is no back button on desktop. Navigates with `state: { restoreScroll: true }` (needs a react-router router).                  |
| `headerActions` | `PageActionItem[]`       |             | Page-level actions (type from `@korzun/design/control`). Desktop: items with `primary: true` render as buttons, the rest in a "More…" overflow menu. Mobile: all in a floating menu. |
| `actionsLabel`  | `string`                 | `'More…'`   | Label of the desktop overflow trigger.                                                                                                                                               |
| `header`        | `ReactNode`              |             | Page's own header-row content (a search bar, a mode toggle), leading the desktop actions bar in the same row. Ignored on `minimal`.                                                  |
| `footerActions` | `FooterAction[]`         |             | Sticky footer buttons (type from `@korzun/design/control`): `{ label, onClick, disabled?, loading?, danger?, emphasis?, align?, submit?, form? }`.                                   |
| `documentTitle` | `string`                 |             | Sets `document.title`. **Not restored on unmount.** Omit when the app manages titles.                                                                                                |
| `bottomNav`     | `boolean`                | `false`     | Mobile: extra bottom padding to clear a floating `NavMobile`.                                                                                                                        |

No `className`.

## Surprising behaviour

- Page marks everything inside it (header, content, footer actions, every `type`) as surface depth 0, so controls and cards inside pick their corner radius from where they sit; see `Surface`.
- **The header row is always reserved on default pages**, even with no actions
  and no `header` (min-height `2.25rem` on desktop), so content starts at the
  same height on every page. On mobile the row collapses (`display: contents`).
- On mobile the back button and the actions menu sit in a **sticky** row at the
  top that rides up with the page and then pins (at
  `theme.layout.floatingControlTopBase`); it also renders on `minimal` pages
  if you pass `back` or `headerActions`.
- The column gap is `theme.fontSize.md` (0.875rem), a historical value, not a
  `space` token.
- `PageActionItem` and `FooterAction` are exported from
  `@korzun/design/control`, not from `component`.

## Examples

```tsx
// A settings screen: one Card per feature, plus a page-level button.
<Page bottomNav documentTitle="Settings">
  <ThemeSetting />
  <Card title="Device password">…</Card>
  <Card title="Change password">…</Card>
  <Button danger onClick={logOut}>Log out</Button>
</Page>

// A detail screen with back, actions and a search-style header slot.
<Page
  bottomNav
  back="/library"
  header={<LibrarySearch value={q} onChange={setQ} />} // your own component
  headerActions={[
    { label: 'Edit', onClick: edit, primary: true },
    { label: 'Delete', onClick: confirmDelete, danger: true, separatorBefore: true },
  ]}
>
  <Card title={book.title}>…</Card>
</Page>

// Sign-in: no chrome.
<Page type="minimal"><LoginLayout /></Page>
```

## Do / don't

- Do make each feature its own `Card`, as direct children of `Page`.
- Do pass `bottomNav` on every page shown under `NavMobile`.
- Do mark the one or two main actions `primary: true` so desktop shows them as
  buttons rather than burying them in "More…".
- Don't render your own search bar as the first child; use `header`.
- Don't wrap Page in another `<main>`; it is the `<main>`.
- Don't rely on `back` for desktop navigation.
