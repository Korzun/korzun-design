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
| `gap` | `number` | `4` | Pixels between the anchor and the popover; also the margin kept from the viewport's left and right edges. |
| `matchWidth` | `boolean` | `true` | Width = anchor width. `false` lets content size itself. |
| `onClose` | `() => void` | | Called on a mousedown outside both anchor and content, and on Escape (see below). Omit to opt out of both. Receives no event. |
| `className` | `string` | | Applied to the fixed wrapper. Override with `'&&'`, never `!important`. |

## Behaviour to know

- **Flip.** It opens on `side`. If the content does not fit on that side and
  the other side has more room, it opens on the other side. When neither side
  fits it keeps whichever has more room.
- **Clamp.** `left` is clamped so the content stays `gap` pixels inside the
  viewport's left and right edges; content wider than the viewport pins to
  `gap`. There is no vertical clamp.
- **`data-side`.** The wrapper carries `data-side="bottom"` or `"top"`: the side
  actually used after flipping. Style against it (an arrow, an animation
  origin) rather than against the `side` prop.
- It re-measures, flip decision included, on window resize and on any scroll
  (capture phase), so it stays attached to a scrolled anchor.
- It renders hidden (`visibility: hidden`) until measured in a layout effect,
  so it never flashes at 0,0 or on the wrong side.
- **Escape.** With `onClose`, an Escape keydown anywhere in the document calls
  `onClose`, unless the event is already `defaultPrevented` (a control such as
  `Select` handled it first). It calls `preventDefault()` on the key, so an
  enclosing native `<dialog>` does not also fire `cancel` and close.
- **No focus management.** Focus stays where it was; return it yourself if
  closing should move it.
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
- Do call `preventDefault()` in your own Escape handler if you close the
  popover yourself, so `onClose` is not called a second time.
- Don't expect it to close on selection; that is your code.
