---
title: Divider
description: A horizontal rule that splits content into sections, optionally labelled and with actions; in a Card or Modal body it reaches the edges.
category: Layout
---
# Divider

<!-- generated:import -->

`import { Divider, type DividerAlign, type DividerProps } from '@korzun/design/component'`

<!-- /generated:import -->

A horizontal rule that splits content into sections, optionally with a label
("Devices", "Validation") and/or actions sitting on the line. Directly inside a
`Card` or `Modal` body it cancels the body's padding, so the line meets the
box's edges; anywhere else it spans its container. Renders `role="separator"`.

Use something else for: separating whole features (use separate `Card`s),
separating menu items (`PageActionItem.separatorBefore`).

## Usage

### Styling

No `className`.

### Surprising behaviour

- **The bleed only reaches the nearest body.** A divider bleeds when the Card
  or Modal body is the nearest box around it. Inside a `CardRow`, `Alert`,
  `Surface` or nested `Card` it spans that box instead. `bleed={false}` opts
  out in a body; `bleed` does nothing outside one.
- **A padded wrapper defeats it.** In a Card body but inside your own padded
  `div`, the divider still cancels the Card's padding, not yours. Wrap the
  box's contents in `Surface`, or pass `bleed={false}`.
- It always reserves one label line of height, labelled or not, so swapping a
  plain divider for a labelled one does not shift the layout.
- The label does not wrap (`white-space: nowrap`); keep it to a word or two.

## Do / don't

- Do put it straight in a Card body, or in a `Space` there, not in a padded
  `div`.
- Do use `type="link"` Buttons or small `Tag`s as `actions`; the line is one
  text line tall.
- Don't use it for the gap between Cards on a page; `Page` already spaces them.

<!-- generated:examples -->

## Examples

### Basic

A plain rule between a form's fields and its submit button. Directly in a Card body it cancels
the body's padding, so the line meets the Card's borders.

```tsx
import { Card, Divider, Space, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [title, setTitle] = useState<string | undefined>('Middlemarch');
  const [requested, setRequested] = useState<string | undefined>();
  return (
    <Card title="New request">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setRequested(title);
        }}
      >
        <Space direction="vertical">
          <TextInput name="title" label="Title" value={title} onChange={setTitle} />
          <Divider />
          <Space>
            <Button type="primary" submit>
              Request
            </Button>
          </Space>
          <Text tone="muted">Requested: {requested ?? 'nothing yet'}</Text>
        </Space>
      </form>
    </Card>
  );
}
```

### Labelled

A label names the section below the line. `align` places it: `left` and `right` hug that edge
with a short stub of line past it, `center` leaves equal line on both sides.

```tsx
import { Card, Divider, Space, Text } from '@korzun/design/component';

export default function Labelled() {
  return (
    <Card title="Notifications">
      <Space direction="vertical">
        <Text>Email me when a book is ready.</Text>
        <Divider>Devices (left)</Divider>
        <Text>Kitchen frame, Hallway frame</Text>
        <Divider align="center">Validation (center)</Divider>
        <Text>Check files for errors on upload.</Text>
        <Divider align="right">History (right)</Divider>
        <Text>Keep notifications for 30 days.</Text>
      </Space>
    </Card>
  );
}
```

### Actions

`actions` puts controls on the line: use link Buttons, the line is one text line tall.
`actionsAlign` places them on the `left`, `center` or `right`. When it equals `align` the label
and the actions share one group, label first. Each divider is captioned with its props.

```tsx
import { Card, Divider, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Actions() {
  const [pending, setPending] = useState(['Middlemarch', 'Persuasion']);
  const [last, setLast] = useState('nothing yet');
  return (
    <Card title="Requests">
      <Space direction="vertical" gap="xl">
        <Space direction="vertical" gap="xs">
          <Text size="sm" tone="muted">
            Unset: label left, actions right
          </Text>
          <Divider
            actions={
              <Button type="link" onClick={() => setPending([])}>
                Clear all
              </Button>
            }
          >
            Pending
          </Divider>
          <Text>{pending.length > 0 ? pending.join(', ') : 'Nothing pending'}</Text>
        </Space>
        <Space direction="vertical" gap="xs">
          <Text size="sm" tone="muted">
            {'align="center" actionsAlign="left"'}
          </Text>
          <Divider
            align="center"
            actionsAlign="left"
            actions={
              <Button type="link" onClick={() => setLast('Archive')}>
                Archive
              </Button>
            }
          >
            Finished
          </Divider>
        </Space>
        <Space direction="vertical" gap="xs">
          <Text size="sm" tone="muted">
            {'align="right" actionsAlign="right": one group, label first'}
          </Text>
          <Divider
            align="right"
            actionsAlign="right"
            actions={
              <Button type="link" onClick={() => setLast('Share')}>
                Share
              </Button>
            }
          >
            Shared
          </Divider>
        </Space>
        <Text tone="muted">Last action: {last}</Text>
      </Space>
    </Card>
  );
}
```

### Outside a Card

Anywhere but directly in a Card or Modal body (on the page, in a CardRow, a hand-made
`Surface` box or a Popover) the line spans its container. In a Card body it reaches the
borders; `bleed={false}` keeps it inside the padding there.

```tsx
import { Card, CardRow, Divider, Space, Text } from '@korzun/design/component';

export default function Anywhere() {
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          On the page: spans the column
        </Text>
        <Divider>Devices</Divider>
        <Text>Kitchen frame, Hallway frame</Text>
      </Space>
      <Card title="Notifications">
        <Space direction="vertical">
          <Text size="sm" tone="muted">
            In the Card body: meets the borders
          </Text>
          <Divider />
          <Text size="sm" tone="muted">
            {'bleed={false}: inside the padding'}
          </Text>
          <Divider bleed={false} />
          <CardRow>
            <Space direction="vertical" gap="xs">
              <Text size="sm" tone="muted">
                In a CardRow: spans the row
              </Text>
              <Divider />
              <Text>Keep notifications for 30 days.</Text>
            </Space>
          </CardRow>
        </Space>
      </Card>
    </Space>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | Optional label, one word or two: it does not wrap. Without a label and without actions the divider is a plain full-width line. `null`, `undefined` and `false` count as absent. |
| `actions` | `ReactNode` |  | Optional controls rendered on the line (e.g. a bulk-action button); keep them one text line tall. `null`, `undefined` and `false` count as absent. |
| `actionsAlign` | `'left' \| 'center' \| 'right'` | `'right'` | Where the actions sit. When it equals `align`, label and actions share one group, label first. |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Where the label sits. `'left'` and `'right'` hug that edge with a short stub of line poking past; `'center'` leaves equal line on both sides. |
| `bleed` | `boolean` |  | Reach the edges of the Card or Modal body the divider sits in, cancelling the body's padding. Defaults to `true` directly inside a Card or Modal body and `false` anywhere else, where the line spans its container. `true` does nothing outside a Card or Modal. |

### Types

```ts
/** Where a divider's label or actions sit on the line. */
type DividerAlign = 'left' | 'center' | 'right';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.border.strong` | `#DDDDDD` | `#48494F` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.lineHeight.body` | `1.3` | `1.3` |
| `theme.space.md` | `0.5rem` | `0.5rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): `CardDivider` is now `Divider` and works anywhere: directly in a Card or Dialog body it reaches the edges as before (cancelling `space.xl` in a large Card, 1px in a small one, `space.xxl` in a Dialog, where it used to overhang everything but a large Card), and on the page, in a `CardRow`, `Alert`, `Surface` or nested Card it spans its container. The new `bleed` prop overrides that. **Breaking:** the old names `CardDivider`, `CardDividerProps` and `CardDividerAlign` are removed; import `Divider`, `DividerProps` and `DividerAlign`.

<!-- /generated:changelog -->
