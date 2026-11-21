# Popover

`import { Popover } from '@korzun/design/control'`

A positioning primitive: renders `children` in a portal on `document.body`,
`position: fixed` directly beneath an anchor element, so a dropdown can escape
ancestors that clip overflow (rounded cards). It paints **nothing** itself: no
background, border, shadow, or radius. `Select` and `ChipsInput` build their
dropdowns on it.

Use something else for: a modal (`useModalDialog`), page action menus
(`PageActionsMenu`, `PageActionsBar`), choosing from a list (`Select`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `anchorRef` | `RefObject<HTMLElement \| null>` | (required) | Element to sit under. Left edges align. |
| `open` | `boolean` | (required) | When `false`, renders nothing. Fully controlled. |
| `children` | `ReactNode` | (required) | Your surface: give it its own background, border, radius. |
| `gap` | `number` | `4` | Pixels between the anchor's bottom and the popover. |
| `matchWidth` | `boolean` | `true` | Width = anchor width. `false` lets content size itself. |
| `onClose` | `() => void` | | Called on a mousedown outside both anchor and content. Omit to opt out. Receives no event. |
| `className` | `string` | | Applied to the fixed wrapper. Override with `'&&'`, never `!important`. |

## Behaviour to know

- **No Escape handling and no focus management.** Add your own keydown handler
  if Escape should close it.
- Always opens below the anchor; it does not flip up or clamp to the viewport.
  It repositions on window resize and on any scroll (capture phase).
- First paint is skipped until the anchor is measured, so it never flashes at 0,0.
- z-index is `theme.zIndex.sticky` (1000). Inside a modal `<dialog>` opened with
  `showModal()`, a body portal sits outside the dialog's top layer, so it is
  likely hidden behind the dialog and inert. Test before using it there.
- Clicking the anchor does not count as "outside", so a toggle button on the
  anchor works without racing `onClose`.

## Styling the surface

A popover is a floating layer: corners `radius.md` with `shadow.hoverLift` (or
`recipe.glass`), and the items inside it `radius.sm`. See
[corners](../corners.md).

```ts
menu: {
  backgroundColor: theme.color.bg.card,
  border: `1px solid ${theme.color.border.strong}`,
  borderRadius: theme.radius.md,
  boxShadow: theme.shadow.hoverLift,
  padding: theme.space.xs,
},
item: { borderRadius: theme.radius.sm, padding: theme.space.md },
```

## Example

```tsx
const anchor = useRef<HTMLDivElement>(null);
const [open, setOpen] = useState(false);

<div ref={anchor} className={styles.anchor}>
  <Button onClick={() => setOpen((o) => !o)}>Filters</Button>
</div>
<Popover anchorRef={anchor} open={open} matchWidth={false} onClose={() => setOpen(false)}>
  <div className={styles.menu}>…</div>
</Popover>
```

## Do / don't

- Do wrap a `Button` in a `<div ref>` to anchor it; `Button` takes no ref.
- Do give the content its own surface and radius; the wrapper is transparent.
- Don't expect it to close on Escape or on selection; that is your code.
