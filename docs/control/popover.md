---
title: Popover
description: A positioning primitive that shows content in a portal below or above an anchor element, and paints nothing itself.
category: Overlays
---

# Popover

<!-- generated:import -->

```ts
import {
  Popover,
  type PopoverAlign,
  type PopoverGap,
  type PopoverProps,
  type PopoverSide,
} from '@korzun/design/control';
```

<!-- /generated:import -->

A positioning primitive: renders `children` in a portal on `document.body`,
`position: fixed` below or above an anchor element, so a dropdown can escape
ancestors that clip overflow (rounded cards). It paints **nothing** itself: no
background, border, shadow, or radius. `Menu`, `Select` and `ChipsInput` build
their dropdowns on it.

Use something else for: a modal (`Dialog`), page action menus
(`PageActionsMenu`, `PageActionsBar`), choosing from a list (`Select`).

## Usage

### Behaviour to know

- **Content mounts one commit after `open` flips.** An effect keyed on `open`
  that reaches into the content must wait for it: use a ref callback or
  `autoFocus` instead.
- **Flip.** It opens on `side`. If the content does not fit on that side and
  the other side has more room, it opens on the other side. When neither side
  fits it keeps whichever has more room.
- **Clamp.** Only when `matchWidth` is false: `left` is clamped so the
  content stays `gap` pixels inside the viewport's left and right edges;
  content wider than the viewport pins to `gap`. With `matchWidth` it lines up
  with the anchor exactly, edge margin or not. There is no vertical clamp.
- **Align.** `align` sets the edge it lines up with: `start`, `center` or `end`. Use `end` for an anchor at the right edge of the screen, so the content grows leftwards.
- **Top side is anchored by its bottom edge** (CSS `bottom`), so a popover
  above its anchor stays attached when its content grows or shrinks.
- **`data-side`.** The wrapper carries `data-side="bottom"` or `"top"`: the side
  actually used after flipping. It also carries `data-preferred-side`, the
  `side` prop, so a flip can be told from a choice. Style against these (an
  arrow, an animation origin) rather than against the `side` prop.
- It re-measures, flip decision included, on window resize, on any scroll
  (capture phase), and when its content resizes (`ResizeObserver`, where the
  browser has it), so it stays attached to a scrolled anchor and to content
  that changes size.
- Its first render is transparent (`opacity: 0`) and is measured in a layout
  effect before paint, so it never flashes at 0,0 or on the wrong side. It is
  not `visibility: hidden`, so an `autoFocus` child takes focus on mount.
- **No focus management.** Focus stays where it was; return it yourself if
  closing should move it.
- z-index is `theme.zIndex.sticky` (1000). Inside an open `<dialog>` it portals
  into that dialog, so it shows in the top layer; this also matches a non-modal
  `show()` dialog. The target is resolved each time the popover opens, so it
  also works when it mounts already open.
- Clicking the anchor does not count as "outside", so a toggle button on the
  anchor works without racing `onClose`.

### Layers

Escape and outside pointer-down close the innermost open layer first. With
`onClose`, an open popover joins a layer stack shared with other popovers and
open `Dialog`s, in the order they opened. A popover registers once its portal
target resolves, one commit after each opening, so a `Dialog` that mounts
already open together with an already-open popover inside it still sits below
that popover.

- An Escape keydown anywhere in the document goes to the top layer only,
  unless the event is already `defaultPrevented` (a control such as
  `Select` handled it first). A popover on top calls `onClose` and
  `preventDefault()`s the key, so an enclosing native `<dialog>` does not
  also fire `cancel` and close. A `Dialog` on top keeps the key: its own
  `cancel` closes it, and the popover beneath stays open.
- A mousedown closes every layer above the one it lands in (every layer,
  when it lands outside them all), top first. A press in a nested popover
  closes neither it nor its parent; a press inside a `Dialog` opened over a
  popover does not close that popover.

### Styling the surface

Content is two surface levels in: Buttons and Selects inside a popover are 4px,
wherever the anchor sits.

A popover is a floating layer: corners `radius.md` with `shadow.hoverLift` (or
`recipe.glass`), and the items inside it `radius.sm`. See
[corners](../corners.md). The "Basic" example draws such a surface.

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

## Do / don't

- Do anchor to a `Button` through its `ref`, or wrap any element in a `<div ref>`.
- Do give the content its own surface and radius; the wrapper is transparent.
- Do call `preventDefault()` in your own Escape handler if you close the
  popover yourself, so `onClose` is not called a second time.
- Don't expect it to close on selection; that is your code.

<!-- generated:examples -->

## Examples

### Basic

A Filters button opens a popover under it. The popover paints nothing, so the
content brings its own background, border and radius. It does not close on
selection: choosing an option calls `setOpen(false)` itself.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.xs,
  },
}));

export default function Basic() {
  const styles = useStyle();
  const anchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState('nothing yet');
  const choose = (label: string) => {
    setChosen(label);
    setOpen(false);
  };
  return (
    <Stack align="start">
      <Button ref={anchor} onClick={() => setOpen((value) => !value)}>
        Filters
      </Button>
      <Popover anchorRef={anchor} open={open} matchWidth={false} onClose={() => setOpen(false)}>
        <div className={styles.panel}>
          <Stack gap="xxs">
            <Button type="text" onClick={() => choose('Unread')}>
              Unread
            </Button>
            <Button type="text" onClick={() => choose('Finished')}>
              Finished
            </Button>
            <Button type="text" onClick={() => choose('Favourites')}>
              Favourites
            </Button>
          </Stack>
        </div>
      </Popover>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### Side

`side="bottom"` opens the popover below its anchor and `side="top"` above it.
Each anchor is labelled with the side it asks for.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.md,
  },
}));

export default function Side() {
  const styles = useStyle();
  const belowAnchor = useRef<HTMLElement>(null);
  const aboveAnchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<'bottom' | 'top' | null>(null);
  const toggle = (side: 'bottom' | 'top') => setOpen((current) => (current === side ? null : side));
  return (
    <Stack>
      <Text tone="muted">Open: {open ?? 'none'}</Text>
      <Inline>
        <Button ref={belowAnchor} onClick={() => toggle('bottom')}>
          Opens below
        </Button>
        <Button ref={aboveAnchor} onClick={() => toggle('top')}>
          Opens above
        </Button>
      </Inline>
      <Popover
        anchorRef={belowAnchor}
        open={open === 'bottom'}
        side="bottom"
        matchWidth={false}
        onClose={() => setOpen(null)}
      >
        <div className={styles.panel}>
          <Text>Below the anchor</Text>
        </div>
      </Popover>
      <Popover
        anchorRef={aboveAnchor}
        open={open === 'top'}
        side="top"
        matchWidth={false}
        onClose={() => setOpen(null)}
      >
        <div className={styles.panel}>
          <Text>Above the anchor</Text>
        </div>
      </Popover>
    </Stack>
  );
}
```

### Align

`align` lines the popover up with the anchor's start edge, centre or end
edge. The anchors are wider than the popover so each edge shows.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.md,
  },
}));

type Align = 'start' | 'center' | 'end';

export default function Align() {
  const styles = useStyle();
  const startAnchor = useRef<HTMLElement>(null);
  const centerAnchor = useRef<HTMLElement>(null);
  const endAnchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Align | null>(null);
  const toggle = (align: Align) => setOpen((current) => (current === align ? null : align));
  const anchors = { start: startAnchor, center: centerAnchor, end: endAnchor };
  return (
    <Stack>
      <Text tone="muted">Open: {open ?? 'none'}</Text>
      <Button ref={startAnchor} onClick={() => toggle('start')}>
        align start: popover at the left edge
      </Button>
      <Button ref={centerAnchor} onClick={() => toggle('center')}>
        align center: popover at the middle
      </Button>
      <Button ref={endAnchor} onClick={() => toggle('end')}>
        align end: popover at the right edge
      </Button>
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover
          key={align}
          anchorRef={anchors[align]}
          open={open === align}
          align={align}
          matchWidth={false}
          onClose={() => setOpen(null)}
        >
          <div className={styles.panel}>
            <Text>align {align}</Text>
          </div>
        </Popover>
      ))}
    </Stack>
  );
}
```

### Width

`matchWidth` makes the popover exactly as wide as its anchor, as a Select's
list is. `matchWidth={false}` lets the content size itself.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.md,
  },
}));

export default function Width() {
  const styles = useStyle();
  const matchedAnchor = useRef<HTMLElement>(null);
  const contentAnchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<'matched' | 'content' | null>(null);
  const toggle = (name: 'matched' | 'content') =>
    setOpen((current) => (current === name ? null : name));
  return (
    <Stack>
      <Text tone="muted">Open: {open ?? 'none'}</Text>
      <Button ref={matchedAnchor} onClick={() => toggle('matched')}>
        matchWidth: as wide as this button
      </Button>
      <Button ref={contentAnchor} onClick={() => toggle('content')}>
        matchWidth false: as wide as its content
      </Button>
      <Popover
        anchorRef={matchedAnchor}
        open={open === 'matched'}
        matchWidth
        onClose={() => setOpen(null)}
      >
        <div className={styles.panel}>
          <Text>Same width as the anchor</Text>
        </div>
      </Popover>
      <Popover
        anchorRef={contentAnchor}
        open={open === 'content'}
        matchWidth={false}
        onClose={() => setOpen(null)}
      >
        <div className={styles.panel}>
          <Text>Short</Text>
        </div>
      </Popover>
    </Stack>
  );
}
```

### Gap

`gap` is the space between the anchor and the popover. It takes a number of
pixels, a `px` or `rem` string, or a theme space value (`theme.space.xl`).
Each button is labelled with the value it passes.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, useTheme, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.md,
  },
}));

type Name = 'pixels' | 'px' | 'rem' | 'theme';

export default function Gap() {
  const styles = useStyle();
  const theme = useTheme();
  const pixelsAnchor = useRef<HTMLElement>(null);
  const pxAnchor = useRef<HTMLElement>(null);
  const remAnchor = useRef<HTMLElement>(null);
  const themeAnchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Name | null>(null);
  const toggle = (name: Name) => setOpen((current) => (current === name ? null : name));
  const close = () => setOpen(null);
  const panel = (text: string) => (
    <div className={styles.panel}>
      <Text>{text}</Text>
    </div>
  );
  return (
    <Stack>
      <Text tone="muted">Open: {open ?? 'none'}</Text>
      <Inline>
        <Button ref={pixelsAnchor} onClick={() => toggle('pixels')}>
          {'gap={24}'}
        </Button>
        <Button ref={pxAnchor} onClick={() => toggle('px')}>
          {'gap="12px"'}
        </Button>
        <Button ref={remAnchor} onClick={() => toggle('rem')}>
          {'gap="2rem"'}
        </Button>
        <Button ref={themeAnchor} onClick={() => toggle('theme')}>
          {'gap={theme.space.xl}'}
        </Button>
      </Inline>
      <Popover
        anchorRef={pixelsAnchor}
        open={open === 'pixels'}
        gap={24}
        matchWidth={false}
        onClose={close}
      >
        {panel('24 pixels')}
      </Popover>
      <Popover
        anchorRef={pxAnchor}
        open={open === 'px'}
        gap="12px"
        matchWidth={false}
        onClose={close}
      >
        {panel('12px')}
      </Popover>
      <Popover
        anchorRef={remAnchor}
        open={open === 'rem'}
        gap="2rem"
        matchWidth={false}
        onClose={close}
      >
        {panel('2rem')}
      </Popover>
      <Popover
        anchorRef={themeAnchor}
        open={open === 'theme'}
        gap={theme.space.xl}
        matchWidth={false}
        onClose={close}
      >
        {panel('theme.space.xl')}
      </Popover>
    </Stack>
  );
}
```

### Nested popovers

A popover inside a popover is one layer deeper. Escape and a press outside
close the innermost open layer first: Escape closes "More" before "Filters",
and a press inside "More" closes neither.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.xs,
  },
}));

export default function Nested() {
  const styles = useStyle();
  const outerAnchor = useRef<HTMLElement>(null);
  const innerAnchor = useRef<HTMLElement>(null);
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Stack align="start">
      <Button ref={outerAnchor} onClick={() => setOuterOpen((value) => !value)}>
        Filters
      </Button>
      <Popover
        anchorRef={outerAnchor}
        open={outerOpen}
        matchWidth={false}
        onClose={() => setOuterOpen(false)}
      >
        <div className={styles.panel}>
          <Stack gap="xxs">
            <Button type="text" onClick={() => setChosen('Unread')}>
              Unread
            </Button>
            <Button ref={innerAnchor} type="text" onClick={() => setInnerOpen((value) => !value)}>
              More
            </Button>
          </Stack>
          <Popover
            anchorRef={innerAnchor}
            open={innerOpen}
            matchWidth={false}
            onClose={() => setInnerOpen(false)}
          >
            <div className={styles.panel}>
              <Stack gap="xxs">
                <Button type="text" onClick={() => setChosen('Finished')}>
                  Finished
                </Button>
                <Button type="text" onClick={() => setChosen('Favourites')}>
                  Favourites
                </Button>
              </Stack>
            </div>
          </Popover>
        </div>
      </Popover>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Stack>
  );
}
```

### In a Dialog

A popover whose anchor is inside an open Dialog renders into that dialog, so
it shows above the backdrop. Escape closes the popover first and the Dialog
on the next press.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Dialog, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.xs,
  },
}));

export default function InDialog() {
  const styles = useStyle();
  const anchor = useRef<HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState('nothing yet');
  const choose = (label: string) => {
    setChosen(label);
    setOpen(false);
  };
  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Edit book">
        <Stack align="start">
          <Button ref={anchor} onClick={() => setOpen((value) => !value)}>
            Status
          </Button>
          <Popover anchorRef={anchor} open={open} matchWidth={false} onClose={() => setOpen(false)}>
            <div className={styles.panel}>
              <Stack gap="xxs">
                <Button type="text" onClick={() => choose('Reading')}>
                  Reading
                </Button>
                <Button type="text" onClick={() => choose('Finished')}>
                  Finished
                </Button>
              </Stack>
            </div>
          </Popover>
          <Text tone="muted">Chosen: {chosen}</Text>
        </Stack>
      </Dialog>
    </>
  );
}
```

### Without onClose

With no `onClose`, Escape and a press outside do nothing: the popover stays
open until your code sets `open` to `false`, here the Show and Hide button.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.md,
  },
}));

export default function WithoutOnClose() {
  const styles = useStyle();
  const anchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <Stack align="start">
      <Button ref={anchor} onClick={() => setOpen((value) => !value)}>
        {open ? 'Hide' : 'Show'}
      </Button>
      <Popover anchorRef={anchor} open={open} matchWidth={false}>
        <div className={styles.panel}>
          <Text>Press Escape or click outside: it stays</Text>
        </div>
      </Popover>
      <Text tone="muted">Open: {open ? 'yes' : 'no'}</Text>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | Your surface: give it its own background, border, and radius. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Horizontal alignment to the anchor's left edge, centre, or right edge. |
| `anchorRef` (required) | `RefObject<HTMLElement \| null>` |  | Element the popover aligns to (placed below or above it, per `side`). |
| `className` | `string` |  | Applied to the fixed wrapper; win specificity with `'&&'`, never `!important`. |
| `gap` | `` number \| `${number}px` \| `${number}rem` `` | `4` | Space between the anchor and the popover: a number of pixels, or a CSS length string in `px` or `rem` (`'6px'`, `'0.375rem'`), resolved at each measurement. Also the margin kept from the viewport's left and right edges when `matchWidth` is false. Theme space values (`theme.space.sm`) are assignable as they are. |
| `matchWidth` | `boolean` | `true` | Sets the popover's width to the anchor's width. `false` lets the content size itself and keeps it inside the viewport's left and right edges. |
| `onClose` | `() => void` |  | Called on a pointer-down outside both the anchor and the popover content, and on an Escape keydown no control has already handled; it receives no event. Escape and outside pointer-down close the innermost open layer first (see [Layers](#layers)). Omit to opt out of both. |
| `open` (required) | `boolean` |  | Whether the popover is rendered; when `false` it renders nothing. Fully controlled: it never closes itself. |
| `side` | `'bottom' \| 'top'` | `'bottom'` | Preferred side; flips to the other side when this one has no room. |

### Types

```ts
/** Horizontal alignment of the popover against the anchor. */
type PopoverAlign = 'start' | 'center' | 'end';
/** A popover gap: pixels, or a CSS length in `px` or `rem`. TypeScript rejects other units. */
type PopoverGap = number | `${number}px` | `${number}rem`;
/** Which side of the anchor the popover prefers. */
type PopoverSide = 'bottom' | 'top';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
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
- **0.5.0** (2026-11-24): `theme.space` values are typed as `SpaceValue` (`${number}rem`), so `gap={theme.space.sm}` on `Popover` and `Menu` needs no `as PopoverGap` cast. `Theme['space']` is now typed `${number}rem`, so hand-built Theme objects or mocks with `px` values stop type-checking.
- **0.4.0** (2026-11-23): Layer stack: popovers and dialogs now close innermost-first. Escape and an outside press only affect the topmost layer, so a popover inside a popover closes one level at a time. **Behaviour change:** a popover beneath an open dialog no longer takes its Escape or closes on a press inside the dialog.
- **0.4.0** (2026-11-23): `Popover` `gap` also accepts a `px` or `rem` string (type `PopoverGap`: `` number | `${number}px` | `${number}rem` ``), not only a number of pixels.
- **0.3.0** (2026-11-22): `Popover` renders inside an open `<dialog>` that contains its anchor, so `Select` and `ChipsInput` work in modals.
- **0.1.0** (2026-11-21): `Popover`:
  - `side` (`bottom`/`top`) and `align` (`start`/`center`/`end`).
  - Flips when the preferred side has no room.
  - Stays inside the viewport horizontally, unless `matchWidth` (then it lines up with the anchor exactly).
  - On the top side it is anchored by its bottom edge, and it re-measures when its content resizes (`ResizeObserver`), so it stays attached as content grows or shrinks.
  - The provisional first render is transparent rather than hidden, so an `autoFocus` child takes focus.
  - Exposes `data-side`.
  - Escape calls `onClose` unless already handled, without closing a surrounding dialog.
  - Defaults keep the same position when there is room below; `Select` and `ChipsInput` now open upward near the bottom of the viewport.
- **0.1.0** (2026-11-21): New types: `PopoverSide`, `PopoverAlign`.

<!-- /generated:changelog -->
