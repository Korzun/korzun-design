---
title: Switch
description: An on/off toggle with an optional label and description, a full-row layout for forms, and a loading state for saves in flight.
category: Inputs
---
# Switch

<!-- generated:import -->

`import { Switch, type SwitchProps, type SwitchRadiusValue } from '@korzun/design/control'`

<!-- /generated:import -->

An on/off toggle (`role="switch"`) with an optional label and description, a
full-row `horizontal` layout for forms, and a `loading` state for saves in
flight. Controlled: you own `checked`.

Use something else for: one of several options (`SegmentedControl`, `Select`),
an action that happens on click (`Button`).

## Usage

### Behaviour

No `className`. Keyboard: Enter and Space toggle. Clicks and those keys stop
propagation, so a switch inside a clickable card row won't trigger the row.

### Choosing a radius

See [corners](../corners.md).

- In a shaded row (`layout="horizontal"`, or inside any field row): omit it
  (`inset`, a track one radius step squarer than the row: 4px in a Card's 8px
  row, 8px in a Page's 16px row).
- In a `Card` header (`headerAction`), or anywhere with no nearby corner to
  echo: `radius="pill"`.

## Do / don't

- Do pass `loading` while the save runs instead of `disabled`; `disabled` means
  "you may not change this".
- Do give a label-less switch an `ariaLabel`; `name` is a machine key.
- Don't expect a switch to submit with a `<form>`; send `checked` from state.
- Don't put an interactive element in `description` of a `horizontal` switch:
  clicking it toggles the switch.

<!-- generated:examples -->

## Examples

### Basic

A controlled switch with a visible `label`. `onChange` receives the new
value, not an event; Enter and Space toggle it from the keyboard.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [checked, setChecked] = useState(true);
  return (
    <Stack>
      <Switch name="notifications" label="Notifications" checked={checked} onChange={setChecked} />
      <Text tone="muted">Notifications: {checked ? 'on' : 'off'}</Text>
    </Stack>
  );
}
```

### Layouts

`default` puts the track and the label inline. `horizontal` is a full-width
shaded row with the label and `description` on the left and the track on the
right, and the whole row toggles. In both, the `description` is helper text
linked by `aria-describedby`.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [inline, setInline] = useState(true);
  const [row, setRow] = useState(false);
  return (
    <Stack>
      <Text tone="muted">layout default</Text>
      <Switch
        name="sync"
        label="Sync over Wi-Fi only"
        description="Large downloads wait for a Wi-Fi connection."
        checked={inline}
        onChange={setInline}
      />
      <Text tone="muted">layout horizontal</Text>
      <Switch
        name="grayscale"
        label="Grayscale"
        layout="horizontal"
        description="Convert covers to grayscale for monochrome screens."
        checked={row}
        onChange={setRow}
      />
    </Stack>
  );
}
```

### Radius

`inset` is the track corner for a switch in a shaded row: concentric with the
row's own corner. `pill` is the capsule for a switch with no nearby corner to
echo.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Radius() {
  const [inset, setInset] = useState(true);
  const [pill, setPill] = useState(true);
  return (
    <Stack>
      <Text tone="muted">radius inset, in a shaded row</Text>
      <Switch
        name="inset"
        label="Inset track"
        layout="horizontal"
        radius="inset"
        checked={inset}
        onChange={setInset}
      />
      <Text tone="muted">radius pill, no corner nearby</Text>
      <Switch name="pill" label="Pill track" radius="pill" checked={pill} onChange={setPill} />
    </Stack>
  );
}
```

### In a Card

A setting row in the body takes the default `inset` track. A switch in the
header, with no nearby corner, takes `radius="pill"`; with no visible label it
needs an `ariaLabel`.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function InACard() {
  const [isSeries, setIsSeries] = useState(false);
  const [bwCover, setBwCover] = useState(true);
  return (
    <Card
      title="Series"
      headerAction={
        <Switch
          name="isSeries"
          ariaLabel="Part of a series"
          radius="pill"
          checked={isSeries}
          onChange={setIsSeries}
        />
      }
    >
      <Stack>
        <Switch
          name="bwCover"
          label="Grayscale"
          layout="horizontal"
          description="Convert the cover to grayscale for monochrome screens."
          checked={bwCover}
          onChange={setBwCover}
        />
        <Text tone="muted">Part of a series: {isSeries ? 'yes' : 'no'}</Text>
      </Stack>
    </Card>
  );
}
```

### Loading and disabled

`loading` marks a save in flight: clicks are ignored and the thumb turns into
a spinner after a short delay, while the switch keeps its colour. `disabled`
fades the whole control and means "you may not change this". The button holds
the save open; the count shows that clicks during it do nothing.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function LoadingAndDisabled() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState(false);
  const [saving, setSaving] = useState(true);
  const [changes, setChanges] = useState(0);
  return (
    <Stack>
      <Switch
        name="push-device"
        label="This device"
        checked={subscribed}
        loading={saving}
        onChange={(next) => {
          setSubscribed(next);
          setChanges((n) => n + 1);
        }}
      />
      <Inline>
        <Button onClick={() => setSaving((s) => !s)}>
          {saving ? 'Finish save' : 'Start save'}
        </Button>
        <Text tone="muted">Changes made: {changes}</Text>
      </Inline>
      <Switch
        name="push-email"
        label="Email (not available)"
        disabled
        checked={email}
        onChange={setEmail}
      />
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` |  | Accessible name for a switch with no visible `label`, because something outside it already carries the name (a grid's row and column headers). It wins over `label`. Without either, `name` is announced. |
| `checked` (required) | `boolean` |  | Controlled on/off state. |
| `description` | `ReactNode` |  | Helper text under the label, linked by `aria-describedby`. |
| `disabled` | `boolean` | `false` | Fades the switch to 40% and removes it from the tab order. |
| `label` | `string` |  | Visible label and accessible name (`ariaLabel` wins over it). |
| `layout` | `'default' \| 'horizontal'` | `'default'` | `'default'`: track then label, inline. `'horizontal'`: a full-width shaded row (`bg.cardHeader`, corners by surface depth) with label and description on the left and the track on the right; the whole row toggles, description included. |
| `loading` | `boolean` | `false` | A save driven by this switch is in flight. Clicks are ignored at once and `aria-busy` is set; the thumb becomes a spinner only after 150ms, so fast saves do not flash. The switch keeps its colour and shows the position it is saving. |
| `name` (required) | `string` |  | Not a form field (no hidden input); only the last-resort accessible name. |
| `onChange` (required) | `(checked: boolean) => void` |  | Receives the new value, not an event. Not called while `disabled` or `loading`. |
| `radius` | `'inset' \| 'pill'` | `'inset'` | The corner shape of the track. Leave it for a switch in a shaded row (`layout="horizontal"` or a field row), where the track is concentric with the row; `'pill'` suits a Card header or any spot with no nearby corner. See [Choosing a radius](#choosing-a-radius). |

### Types

```ts
/** Corner shape of a Switch track. */
type SwitchRadiusValue = 'inset' | 'pill';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.input` | `#FFFFFF` | `#1A1B1E` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.brand.outline` | `#91CAFF` | `rgba(54, 150, 254, 0.45)` |
| `theme.color.text.description` | `#585863` | `#A8ADB6` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.radius.circle` | `50%` | `50%` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.pill` | `999px` | `999px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.focusRing` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.row` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.spinner` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.6.0** (2026-11-26): Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.5.2 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px.
- **0.0.6** (2026-11-21): New `theme.recipe.row`: the shaded field row (`bg.cardHeader`, `radius.md`, padding `md lg md sm`), for custom rows beside form fields. `Switch`'s horizontal layout now uses it and looks the same.

<!-- /generated:changelog -->
