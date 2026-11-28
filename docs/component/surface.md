---
title: Surface
description: Marks a hand-made box as one more level of nesting, so the library controls inside it take the next corner radius down.
category: Layout
---
# Surface

<!-- generated:import -->

`import { Surface, useSurfaceRadius, type SurfaceProps } from '@korzun/design/component'`

<!-- /generated:import -->

Marks a hand-made box as one more level of nesting. Every library control
inside it (`Button`, `Select`, `Card`, `CardRow`, ...) takes its corner radius
from how deep it sits, following the one-radius-step-per-level rule in
[corners](../corners.md). `Page` marks its whole area as depth 0, `Modal` as
depth 1, and `Card`, `CardRow` and `Alert` each one level deeper than where
they sit. `Surface` adds one more level for a box you draw yourself.

Wrap the box's contents, not the box: the box itself takes the surrounding depth.

Use `Surface` when you build your own bordered or filled box that contains
library controls. Do not use it around a library `Card`, `CardRow` or `Modal`;
they already count themselves.

## Usage

### `useSurfaceRadius()`

```ts
useSurfaceRadius(): string
```

Returns the radius string (a theme `radius` token) for the current depth. Call
it in the component that draws the box, outside its own `Surface`: the box
then gets the radius for where it sits, and `Surface` steps the controls inside
it one level deeper. With no `Page`, `Modal`, `Card`, `CardRow`, `Alert` or
`Surface` above it, it returns the depth 0 radius.

### Depth table

| Depth | Radius                       | Where                                    |
| ----- | ---------------------------- | ---------------------------------------- |
| 0     | `radius.lg`                  | on the page background                   |
| 1     | `radius.md`                  | inside a Card or Modal                  |
| 2+    | `radius.sm`                  | inside a surface inside a Card or Modal |
| none  | each component's own default | no Page, Modal, Card, CardRow, Alert or Surface above it |

Depth never goes below `sm`; deeper nesting stays at `sm`. Hand-drawn boxes are invisible to depth, so wrap their contents in `Surface`.

### Styling

`Surface` renders no element of its own, so it has no `className`.

## Do / don't

- Do wrap the contents of a hand-made box that holds library controls in `Surface`.
- Do take the box's own radius from `useSurfaceRadius()`, never a literal.
- Don't wrap library `Card`, `CardRow` or `Modal` in `Surface`.

<!-- generated:examples -->

## Examples

### Basic

A hand-made bordered box inside a `Card`. The box reads its own radius from `useSurfaceRadius()` and wraps its contents in `Surface`, so the Button inside is one corner step smaller than the box.

```tsx
import { Card, Space, Surface, Text, useSurfaceRadius } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState, type ReactNode } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  box: {
    border: `1px solid ${theme.color.border.default}`,
    padding: theme.space.lg,
  },
}));

const InsetBox = ({ children }: { children: ReactNode }) => {
  const styles = useStyle();
  const borderRadius = useSurfaceRadius();
  return (
    <div className={styles.box} style={{ borderRadius }}>
      <Surface>{children}</Surface>
    </div>
  );
};

export default function Basic() {
  const [saves, setSaves] = useState(0);
  return (
    <Card title="Settings">
      <InsetBox>
        <Space direction="vertical" gap="sm">
          <Text>
            Your own box: its corners follow the card, and the button inside is one step smaller.
          </Text>
          <Space>
            <Button onClick={() => setSaves((n) => n + 1)}>Save</Button>
          </Space>
          <Text tone="muted">Saves: {saves}</Text>
        </Space>
      </InsetBox>
    </Card>
  );
}
```

### Nesting

Each hand-made box inside another sits one level deeper, so corners step down one radius per level and stop at `sm`. Each box shows the radius `useSurfaceRadius()` returned for where it sits.

```tsx
import { Card, Space, Surface, Text, useSurfaceRadius } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState, type ReactNode } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  box: {
    border: `1px solid ${theme.color.border.default}`,
    padding: theme.space.lg,
  },
}));

const LevelBox = ({ name, children }: { name: string; children?: ReactNode }) => {
  const styles = useStyle();
  const borderRadius = useSurfaceRadius();
  const [taps, setTaps] = useState(0);
  return (
    <div className={styles.box} style={{ borderRadius }}>
      <Surface>
        <Space direction="vertical" gap="sm">
          <Space>
            <Button onClick={() => setTaps((n) => n + 1)}>{name}</Button>
            <Text tone="muted">
              Radius {borderRadius}, taps: {taps}
            </Text>
          </Space>
          {children}
        </Space>
      </Surface>
    </div>
  );
};

export default function Nesting() {
  return (
    <Card title="Card">
      <LevelBox name="Box">
        <LevelBox name="Box in box">
          <LevelBox name="Box in box in box" />
        </LevelBox>
      </LevelBox>
    </Card>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The hand-made box's contents, not the box itself. They sit one level deeper than the surface around it, so a Button or Select inside takes the next corner radius down. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.5.0** (2026-11-24): Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- **0.5.0** (2026-11-24): New `Surface` and `useSurfaceRadius` (component) for hand-made boxes that hold library controls: `Surface` marks its children one level deeper, and `useSurfaceRadius()` returns the radius token for the current depth.

<!-- /generated:changelog -->
