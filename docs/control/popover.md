# Popover

`import { Popover } from '@korzun/design/control'`

A positioning primitive: renders `children` in a portal on `document.body`,
`position: fixed` below or above an anchor element, so a dropdown can escape
ancestors that clip overflow (rounded cards). It paints **nothing** itself: no
background, border, shadow, or radius. `Select` and `ChipsInput` build their
dropdowns on it.

Use something else for: a modal (`useModalDialog`), page action menus
(`PageActionsMenu`, `PageActionsBar`), choosing from a list (`Select`).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `anchorRef` | `RefObject<HTMLElement \| null>` | (required) | Element to place against. |
| `open` | `boolean` | (required) | When `false`, renders nothing. Fully controlled. |
| `children` | `ReactNode` | (required) | Your surface: give it its own background, border, radius. |
| `side` | `'bottom' \| 'top'` | `'bottom'` | Preferred side; flips to the other side when this one has no room. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Horizontal alignment to the anchor's left edge, centre, or right edge. |
| `gap` | `number` | `4` | Pixels between the anchor and the popover; also the margin kept from the viewport's left and right edges when `matchWidth` is false. |
| `matchWidth` | `boolean` | `true` | Width = anchor width. `false` lets content size itself. |
| `onClose` | `() => void` | | Called on a mousedown outside both anchor and content, and on Escape (see below). Omit to opt out of both. Receives no event. |
| `className` | `string` | | Applied to the fixed wrapper. Override with `'&&'`, never `!important`. |

## Behaviour to know

- **Flip.** It opens on `side`. If the content does not fit on that side and
  the other side has more room, it opens on the other side. When neither side
  fits it keeps whichever has more room.
- **Clamp.** Only when `matchWidth` is false: `left` is clamped so the
  content stays `gap` pixels inside the viewport's left and right edges;
  content wider than the viewport pins to `gap`. With `matchWidth` (the
  default) it lines up with the anchor exactly, edge margin or not. There is
  no vertical clamp.
- **Top side is anchored by its bottom edge** (CSS `bottom`), so a popover
  above its anchor stays attached when its content grows or shrinks.
- **`data-side`.** The wrapper carries `data-side="bottom"` or `"top"`: the side
  actually used after flipping. Style against it (an arrow, an animation
  origin) rather than against the `side` prop.
- It re-measures, flip decision included, on window resize, on any scroll
  (capture phase), and when its content resizes (`ResizeObserver`, where the
  browser has it), so it stays attached to a scrolled anchor and to content
  that changes size.
- Its first render is transparent (`opacity: 0`) and is measured in a layout
  effect before paint, so it never flashes at 0,0 or on the wrong side. It is
  not `visibility: hidden`, so an `autoFocus` child takes focus on mount.
- **Escape.** With `onClose`, an Escape keydown anywhere in the document calls
  `onClose`, unless the event is already `defaultPrevented` (a control such as
  `Select` handled it first). It calls `preventDefault()` on the key, so an
  enclosing native `<dialog>` does not also fire `cancel` and close.
- **Nested popovers.** Each open popover listens on the document, so with
  nested popovers Escape is taken by the one opened first (the outermost),
  not the innermost. A proper layer stack comes with `Menu`.
- **No focus management.** Focus stays where it was; return it yourself if
  closing should move it.
- z-index is `theme.zIndex.sticky` (1000). Inside an open `<dialog>` it portals
  into that dialog, so it shows in the top layer; this also matches a non-modal
  `show()` dialog. The anchor must already be mounted when the popover opens
  (open it after mount, as a toggle does). An open popover left behind a
  `showModal()` dialog still takes Escape first, so the dialog does not close.
  Close popovers before opening a dialog.
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
- Do call `preventDefault()` in your own Escape handler if you close the
  popover yourself, so `onClose` is not called a second time.
- Don't expect it to close on selection; that is your code.
