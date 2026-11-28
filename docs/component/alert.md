---
title: Alert
description: A tinted box for a status message in the page flow, with an optional title, icon and action.
category: Feedback
---
# Alert

<!-- generated:import -->

`import { Alert, type AlertProps, type AlertTone } from '@korzun/design/component'`

<!-- /generated:import -->

A tinted, bordered box for a status message that sits in the page flow: a tone,
an optional title, body text, an optional icon and an optional action. The
tone's `theme.color.chip[tone]` colours the background, border, title and icon;
the body text uses the normal text colour so a sentence stays readable.

Use something else for: inline field or form failure text (`ErrorMessage`), or a
single status word in a row (`Chip`). An Alert is for a message with weight that
may carry an action.

## Usage

### Choosing a tone

- `warning`: needs attention (overdue, about to expire).
- `danger`: something failed.
- `success`: something finished.
- `info`: neutral news.

`warning` and `danger` render `role="alert"` and are announced the moment they
mount; `success` and `info` render `role="status"` and are announced politely.

### Behaviour

- Corners follow surface depth (see [corners](../corners.md)): 16px on a Page,
  8px in a Card. With no provider the Alert counts as depth 0.
- Its contents, including `action`, sit one level deeper, so a Button in the
  action is already one step smaller than the Alert. Do not pass `radius`.
- There is no default icon per tone; pass `Icon` when you want one.
- Spacing and font sizes come from theme tokens; there is no `style` prop.

## Do / don't

- Do pick the tone by meaning, not by colour.
- Do put the one recovery action in `action`.
- Don't use it for field errors; use `ErrorMessage`.
- Don't mount a `danger` or `warning` Alert for static, always-visible copy:
  it is announced as an alert when it appears.

<!-- generated:examples -->

## Examples

### Basic

A `tone`, a short `title` and a sentence of body text. Pick the tone by
meaning: `warning` needs attention.

```tsx
import { Alert } from '@korzun/design/component';

export default function Basic() {
  return (
    <Alert tone="warning" title="Frame is overdue">
      No check-in for 2h 14m.
    </Alert>
  );
}
```

### Danger

Something failed. `Icon` takes an icon component and draws it before the title
in the tone's colour; no tone has a default icon. `danger` and `warning` are
announced as `role="alert"`, so mount them when the problem happens.

```tsx
import { Alert } from '@korzun/design/component';
import { AlertOctagonIcon } from '@korzun/design/icon';

export default function Danger() {
  return (
    <Alert tone="danger" title="Upload failed" Icon={AlertOctagonIcon}>
      The file is larger than 20 MB.
    </Alert>
  );
}
```

### Success

Something finished. `success` and `info` are polite (`role="status"`).

```tsx
import { Alert } from '@korzun/design/component';
import { CheckIcon } from '@korzun/design/icon';

export default function Success() {
  return (
    <Alert tone="success" title="Library synced" Icon={CheckIcon}>
      42 books are up to date on this device.
    </Alert>
  );
}
```

### Info

Neutral news. `title` is optional: a body alone is fine for a single sentence.

```tsx
import { Alert } from '@korzun/design/component';

export default function Info() {
  return <Alert tone="info">Reading progress syncs when this device is online.</Alert>;
}
```

### With an action, inside a card

`action` holds the one recovery step, usually a Button, on the right; it wraps
under the text when narrow. Inside a Card the Alert's corners and its Button's
corners step down by themselves, so pass no `radius`.

```tsx
import { Alert, Card, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function WithAction() {
  const [overdue, setOverdue] = useState(true);
  return (
    <Card title="Kitchen frame">
      {overdue ? (
        <Alert
          tone="warning"
          title="Frame is overdue"
          action={<Button onClick={() => setOverdue(false)}>Retry</Button>}
        >
          No check-in for 2h 14m.
        </Alert>
      ) : (
        <Text tone="muted">Checked in just now.</Text>
      )}
    </Card>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | Body text. |
| `action` | `ReactNode` |  | Content on the right, usually a Button; wraps under the text when narrow. |
| `className` | `string` |  | Extra class, added last on the root. Override with `'&&'` specificity, never `!important`. |
| `Icon` | `ComponentType<IconProps>` |  | Icon shown before the title, in the tone's text colour. There is no default icon per tone. |
| `title` | `ReactNode` |  | Short semibold heading above the body. |
| `tone` (required) | `'warning' \| 'danger' \| 'success' \| 'info'` |  | Colour family. `warning` and `danger` are announced (`role="alert"`); `success` and `info` are polite (`role="status"`). |

### Types

```ts
type AlertTone = 'warning' | 'danger' | 'success' | 'info';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.chip.danger.bg` | `rgba(255, 77, 79, 0.08)` | `rgba(255, 77, 79, 0.16)` |
| `theme.color.chip.danger.border` | `rgba(255, 77, 79, 0.22)` | `rgba(255, 77, 79, 0.3)` |
| `theme.color.chip.danger.text` | `#D9373e` | `#FF8E8E` |
| `theme.color.chip.info.bg` | `rgba(23, 119, 255, 0.08)` | `rgba(54, 150, 254, 0.18)` |
| `theme.color.chip.info.border` | `rgba(23, 119, 255, 0.24)` | `rgba(54, 150, 254, 0.36)` |
| `theme.color.chip.info.text` | `#0758d9` | `#87BAFF` |
| `theme.color.chip.success.bg` | `rgba(22, 163, 74, 0.08)` | `rgba(34, 197, 94, 0.16)` |
| `theme.color.chip.success.border` | `rgba(22, 163, 74, 0.22)` | `rgba(34, 197, 94, 0.3)` |
| `theme.color.chip.success.text` | `#15803d` | `#86EFAC` |
| `theme.color.chip.warning.bg` | `rgba(234,179,8,0.16)` | `rgba(234,179,8,0.20)` |
| `theme.color.chip.warning.border` | `rgba(202,138,4,0.40)` | `rgba(234,179,8,0.42)` |
| `theme.color.chip.warning.text` | `#854d0e` | `#FDE047` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.fontWeight.semibold` | `600` | `600` |
| `theme.lineHeight.body` | `1.3` | `1.3` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.5.0** (2026-11-24): Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- **0.5.0** (2026-11-24): New `Alert` (component): a tinted box with a `tone` (`warning`, `danger`, `success`, `info`), optional `title`, `Icon` and `action`, and body text. `danger` and `warning` get `role="alert"`, `success` and `info` get `role="status"`.

<!-- /generated:changelog -->
