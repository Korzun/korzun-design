---
title: CardDivider
description: A horizontal rule that splits a Card body into sections, optionally labelled and with actions.
category: Layout
---
# CardDivider

<!-- generated:import -->

`import { CardDivider, type CardDividerAlign, type CardDividerProps } from '@korzun/design/component'`

<!-- /generated:import -->

A horizontal rule that splits one `Card` body into sections, optionally with a
label ("Devices", "Validation") and/or actions sitting on the line. It is
full-bleed: it cancels the card body's padding so the line meets the card
borders. Renders `role="separator"`.

Use something else for: separating whole features (use separate `Card`s),
separating menu items (`PageActionItem.separatorBefore`).

## Usage

### Styling

No `className`.

### Surprising behaviour

- **Assumes a `space.xl` parent padding.** The full-bleed is a fixed
  `margin: 0 -space.xl`, which matches a `size="large"` Card body. Inside
  `Card size="small"` (1px padding) or any other container it overhangs.
- It always reserves one label line of height, labelled or not, so swapping a
  plain divider for a labelled one does not shift the layout.
- The label does not wrap (`white-space: nowrap`); keep it to a word or two.

## Do / don't

- Do use it directly inside a large Card body, not wrapped in a padded `div`
  (the negative margin would then overshoot your wrapper instead).
- Do use `type="link"` Buttons or small `Tag`s as `actions`; the line is one
  text line tall.
- Don't use it for the gap between Cards on a page; `Page` already spaces them.

<!-- generated:examples -->

## Examples

### Basic

A plain rule between a form's fields and its submit button. It is full-bleed: it cancels the
Card body's padding, so the line meets the Card's borders.

```tsx
import { Card, CardDivider, Inline, Stack, Text } from '@korzun/design/component';
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
        <Stack>
          <TextInput name="title" label="Title" value={title} onChange={setTitle} />
          <CardDivider />
          <Inline>
            <Button type="primary" submit>
              Request
            </Button>
          </Inline>
          <Text tone="muted">Requested: {requested ?? 'nothing yet'}</Text>
        </Stack>
      </form>
    </Card>
  );
}
```

### Labelled

A label names the section below the line. `align` places it: `left` and `right` hug that edge
with a short stub of line past it, `center` leaves equal line on both sides.

```tsx
import { Card, CardDivider, Stack, Text } from '@korzun/design/component';

export default function Labelled() {
  return (
    <Card title="Notifications">
      <Stack>
        <Text>Email me when a book is ready.</Text>
        <CardDivider>Devices (left)</CardDivider>
        <Text>Kitchen frame, Hallway frame</Text>
        <CardDivider align="center">Validation (center)</CardDivider>
        <Text>Check files for errors on upload.</Text>
        <CardDivider align="right">History (right)</CardDivider>
        <Text>Keep notifications for 30 days.</Text>
      </Stack>
    </Card>
  );
}
```

### Actions

`actions` puts controls on the line: use link Buttons, the line is one text line tall.
`actionsAlign` places them on the `left`, `center` or `right`. When it equals `align` the label
and the actions share one group, label first. Each divider is captioned with its props.

```tsx
import { Card, CardDivider, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Actions() {
  const [pending, setPending] = useState(['Middlemarch', 'Persuasion']);
  const [last, setLast] = useState('nothing yet');
  return (
    <Card title="Requests">
      <Stack gap="xl">
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            Unset: label left, actions right
          </Text>
          <CardDivider
            actions={
              <Button type="link" onClick={() => setPending([])}>
                Clear all
              </Button>
            }
          >
            Pending
          </CardDivider>
          <Text>{pending.length > 0 ? pending.join(', ') : 'Nothing pending'}</Text>
        </Stack>
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            {'align="center" actionsAlign="left"'}
          </Text>
          <CardDivider
            align="center"
            actionsAlign="left"
            actions={
              <Button type="link" onClick={() => setLast('Archive')}>
                Archive
              </Button>
            }
          >
            Finished
          </CardDivider>
        </Stack>
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            {'align="right" actionsAlign="right": one group, label first'}
          </Text>
          <CardDivider
            align="right"
            actionsAlign="right"
            actions={
              <Button type="link" onClick={() => setLast('Share')}>
                Share
              </Button>
            }
          >
            Shared
          </CardDivider>
        </Stack>
        <Text tone="muted">Last action: {last}</Text>
      </Stack>
    </Card>
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

### Types

```ts
/** Where a divider's label or actions sit on the line. */
type CardDividerAlign = 'left' | 'center' | 'right';
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
| `theme.space.xl` | `0.75rem` | `0.75rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
