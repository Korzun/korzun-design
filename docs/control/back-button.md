# BackButton

`import { BackButton } from '@korzun/design/control'`

A round glass "Back" button that navigates to a fixed path. It is mobile-only:
at widths of 641px and up it renders `display: none`, because desktop has its
own navigation. Usually you don't render it yourself: pass `back` to `Page`.

Use something else for: any other action (`Button`), header actions
(`PageActionsMenu` / `PageActionsBar`, also via `Page`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `to` | `string` | (required) | Path to navigate to. |

That is the whole API. No `className`, no label, no `onClick`.

## Behaviour to know

- **It pushes `to`, it does not go back in history.** Click (or Enter / Space)
  calls `navigate(to, { state: { restoreScroll: true } })`: a new history entry,
  with a state flag asking the destination's scroll manager to restore its
  remembered position instead of jumping to the top.
- Requires a `react-router` (v8, a peer dependency) router above it; it calls
  `useNavigate()` and throws without one.
- Renders a `<div role="button" tabIndex={0} aria-label="Back">` with a
  left-pointing chevron, 46×46px, `radius.circle`, `recipe.glass`.
- It does not position itself. `Page` puts it in its sticky controls row; if
  you render it elsewhere, you place it.

## Examples

```tsx
// Preferred: let Page render it (and PageActionsMenu beside it on mobile).
<Page back="/library" headerActions={actions}>
  …
</Page>

// Standalone, inside your own row.
<div className={styles.controls}>
  <BackButton to={path.book(book.id)} />
</div>
```

## Do / don't

- Do use `Page back="…"` instead of rendering `BackButton` directly, so it lines
  up with the mobile actions menu.
- Do pass the logical parent route (`/library`, the book page), not a guess at
  the previous URL: it always goes to `to`.
- Don't expect it on desktop; it is hidden at 641px and up.
- Don't wrap it in a `<button>` or `<a>`, or try to restyle it: there is no
  `className`.
