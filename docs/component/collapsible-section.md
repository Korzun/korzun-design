---
title: CollapsibleSection
description: A disclosure section with no card chrome: a muted header with a chevron, optional count and actions, and children shown only while open.
category: Layout
---
# CollapsibleSection

<!-- generated:import -->

`import { CollapsibleSection, type CollapsibleSectionProps } from '@korzun/design/component'`

<!-- /generated:import -->

A disclosure section with no card chrome: an uppercase, muted header row with a
text chevron (▶ / ▼), an optional count-style subtitle, optional trailing
actions, and children shown only while open. The header is a
`role="button"` (`tabIndex=0`, Enter/Space).

Use something else for: a collapsible feature on a screen (`Card` with
`isCollapsible`, which also hides its footer while collapsed).

## Usage

### Controlled and uncontrolled

Omit `open` and the section keeps its own state, always starting closed; there
is no `defaultOpen`. Pass `open` and flip your own state in `onOpenToggle`,
which receives no value.

When controlled, `open` wins but the internal state still flips on every
click; if you later stop passing `open`, the section shows that stale internal
state.

### Actions

- Actions are rendered inside the header button, but clicks and key presses
  inside an action stay with it: any action (a `Button`, a native `<button>`, a
  link, a `Chip` with `onClick`) works without toggling the section, and Enter or
  Space on it activates the action, not the header.
- Actions in the array need their own `key`s (they are rendered as a bare
  array).

### Accessibility

The header has no `aria-expanded`.

### Styling

No `className`.

## Do / don't

- Do pass `actions` as an array of keyed elements.
- Don't use it as a screen's top-level feature container; that is `Card`.

<!-- generated:examples -->

## Examples

### Basic

Without `open` the section keeps its own state and starts closed. `subTitle`
is faint text after the title, such as a count; the header toggles on click,
Enter or Space.

```tsx
import { CollapsibleSection, Space, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <CollapsibleSection title="Archived" subTitle="3 items">
      <Space direction="vertical" gap="xs">
        <Text>Middlemarch</Text>
        <Text>Bleak House</Text>
        <Text>Persuasion</Text>
      </Space>
    </CollapsibleSection>
  );
}
```

### Controlled

Pass `open` and flip your own state in `onOpenToggle`, which receives no
value. The button outside the section sets the same state.

```tsx
import { CollapsibleSection, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Controlled() {
  const [open, setOpen] = useState(true);
  return (
    <Space direction="vertical">
      <Space>
        <Button onClick={() => setOpen((o) => !o)}>
          {open ? 'Collapse' : 'Expand'} from outside
        </Button>
      </Space>
      <Text tone="muted">Open: {open ? 'yes' : 'no'}</Text>
      <CollapsibleSection title="Advanced" open={open} onOpenToggle={() => setOpen((o) => !o)}>
        <Text>Extra settings go here.</Text>
      </CollapsibleSection>
    </Space>
  );
}
```

### Actions

`actions` is an array of keyed elements shown at the header's right end. Clicks
and key presses inside an action stay with it, so Add does not toggle the
section.

```tsx
import { CollapsibleSection, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Actions() {
  const [open, setOpen] = useState(true);
  const [count, setCount] = useState(2);
  return (
    <CollapsibleSection
      title="Reading list"
      subTitle={`${count} books`}
      open={open}
      onOpenToggle={() => setOpen((o) => !o)}
      actions={[
        <Button key="add" type="text" onClick={() => setCount((n) => n + 1)}>
          Add
        </Button>,
      ]}
    >
      <Space direction="vertical" gap="xs">
        {Array.from({ length: count }, (_, i) => (
          <Text key={i}>Book {i + 1}</Text>
        ))}
      </Space>
    </CollapsibleSection>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | Shown only while open; unmounted when closed. |
| `actions` | `ReactNode[]` | `[]` | Rendered at the header's right end, as an array of keyed elements. Clicks and keys inside an action never reach the header, so an action never toggles the section. |
| `onOpenToggle` | `() => void` | `() => {}` | Called on every header click/Enter/Space. Receives no value: flip your own state. |
| `open` | `boolean` |  | Controlled open state. Omit for uncontrolled, which starts closed (there is no `defaultOpen`). |
| `subTitle` | `string` |  | Faint text after the title, e.g. a count ("3 items"). |
| `title` (required) | `string` |  | Header label, rendered uppercase via CSS. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.fontSize.xs` | `0.7rem` | `0.7rem` |
| `theme.fontWeight.semibold` | `600` | `600` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.5.2** (2026-11-26): Clicks and Enter/Space inside an action no longer reach the header, so no action toggles the section and a native button or link keeps its key press. Actions sit in a `display: contents` wrapper, so the layout is unchanged.

<!-- /generated:changelog -->
