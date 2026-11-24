# Surface

`import { Surface, useSurfaceRadius, type SurfaceProps } from '@korzun/design/component'`

Marks a hand-made box as one more level of nesting. Every library control
inside it (`Button`, `Select`, `Card`, `CardRow`, ...) takes its corner radius
from how deep it sits, following the one-radius-step-per-level rule in
`docs/corners.md`. `Page` marks its whole area as depth 0, `Card` and `Dialog`
mark theirs one deeper, and `Surface` adds one more level for a box you draw
yourself.

Wrap the box's contents, not the box: the box itself takes the surrounding depth.

Use `Surface` when you build your own bordered or filled box that contains
library controls. Do not use it around a library `Card`, `CardRow` or `Dialog`;
they already count themselves.

## Props

| Prop       | Type        | Default | Notes                                                          |
| ---------- | ----------- | ------- | -------------------------------------------------------------- |
| `children` | `ReactNode` |         | Content that sits one level deeper than the surface around it. |

`Surface` renders no element of its own, so it has no `className`.

## `useSurfaceRadius()`

Returns the radius string (a theme `radius` token) for the current depth. Call
it in the component that draws the box, outside its own `Surface`: the box
then gets the radius for where it sits, and `Surface` steps the controls inside
it one level deeper.

## Depth table

| Depth | Radius                       | Where                                    |
| ----- | ---------------------------- | ---------------------------------------- |
| 0     | `radius.lg`                  | on the page background                   |
| 1     | `radius.md`                  | inside a Card or Dialog                  |
| 2+    | `radius.sm`                  | inside a surface inside a Card or Dialog |
| none  | each component's own default | no Page or Dialog above it               |

Depth never goes below `sm`; deeper nesting stays at `sm`.

## Examples

```tsx
const InsetBox = ({ children }: { children: ReactNode }) => {
  const borderRadius = useSurfaceRadius();
  return (
    <div style={{ borderRadius, border: '1px solid currentColor' }}>
      <Surface>{children}</Surface>
    </div>
  );
};

<Card title="Settings">
  <InsetBox>
    <Button>Save</Button>
  </InsetBox>
</Card>;
```

## Do / don't

- Do wrap the contents of a hand-made box that holds library controls in `Surface`.
- Do take the box's own radius from `useSurfaceRadius()`, never a literal.
- Don't wrap library `Card`, `CardRow` or `Dialog` in `Surface`.
