# PageActionsMenu

`import { PageActionsMenu, type PageActionItem, type PageActionIntentProps } from '@korzun/design/control'`

The **mobile** page-actions control: a round glass "More actions" button (⋯)
that opens a glass menu listing every action. It is hidden at 641px and up,
where `PageActionsBar` takes over with the same items. Usually you don't render
it yourself: pass `headerActions` to `Page`, which renders both.

Use something else for: desktop header actions (`PageActionsBar`), bottom-of-
page form actions (`PageFooterActions`), a single inline action (`Button`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `PageActionItem[]` | (required) | All of them appear in the menu, in order. |

No `className`, no label prop (the trigger is always "More actions").

## PageActionItem

Shared with `PageActionsBar`, so one array drives both.

| Field | Type | Notes |
|---|---|---|
| `label` | `string` | Menu text. **Must be unique**: it is the React key. |
| `onClick` | `() => void` | Receives no event. The menu closes first. |
| `danger` | `boolean` | Red text. Styling only. |
| `disabled` | `boolean` | |
| `separatorBefore` | `boolean` | Divider above this item (ignored on the first). `danger` does not add one. |
| `intentProps` | `{ onMouseEnter, onFocus, onTouchStart }` | Spread onto the menu item, e.g. to prefetch. |
| `primary` | `boolean` | **Ignored here.** Only `PageActionsBar` uses it. |
| `align` | `'leading' \| 'trailing'` | **Ignored here.** Only `PageActionsBar` uses it. |

## Behaviour to know

- Closes on item select, Escape, or a mousedown outside. No arrow-key
  navigation; Tab moves through the items.
- The menu is a floating layer (`radius.md`, glass, items `radius.sm`),
  absolutely positioned under the trigger, right-aligned.
- It doesn't place itself: `Page` puts it in the sticky controls row
  (`margin-left: auto` keeps it at the trailing end, with or without a
  `BackButton`).

## Example

```tsx
const actions: PageActionItem[] = [
  { label: 'Edit', onClick: edit, primary: true },
  { label: 'Read', onClick: read, primary: true, align: 'leading' },
  { label: 'Download', onClick: download, intentProps: prefetchDownload },
  { label: 'Delete', onClick: () => setConfirming(true), danger: true, separatorBefore: true },
];

// Preferred: Page renders PageActionsMenu (mobile) and PageActionsBar (desktop).
<Page back="/library" headerActions={actions}>…</Page>
```

## Do / don't

- Do pass the same `items` you give `PageActionsBar` (or just use `Page`).
- Do put destructive items last with `separatorBefore`.
- Don't render it on its own and expect it on desktop; it is hidden there.
- Don't give two items the same `label`; they collide as React keys.
