---
title: ErrorMessage
description: A failure message the user must notice, announced to screen readers and rendered nothing when empty.
category: Feedback
---
# ErrorMessage

<!-- generated:import -->

`import { ErrorMessage, type ErrorMessageProps } from '@korzun/design/component'`

<!-- /generated:import -->

A failure message the user must notice. It renders a `<p role="alert">` in the
danger colour at `fontSize.sm`, with no margin or padding, so screen readers
announce it when it appears.

Use something else for: static red copy that is always on screen
(`<Text tone="danger">`, which uses the darker chip red and no `role`), or a
boxed message with a tone and an action (`Alert`).

## Usage

### Behaviour

- Empty renders nothing, not an empty alert. Leave it mounted and pass the
  error (or `undefined`) as children; an alert region that appears with text
  is announced.
- `0` is not empty and renders.
- Space it from the field above with `Space` `gap`; it has no margin.
- Every other HTML attribute (`id`, `aria-*`, `data-*`, event handlers) passes
  through, and may override `role`.

### Linking it to a field

Give the message an `id` and set `aria-describedby` on a native control to
that `id`, so assistive tech reads the error with the field:

```tsx
<Space direction="vertical" gap="sm">
  <input id="title" aria-describedby="title-error" aria-invalid={!!error} />
  <ErrorMessage id="title-error">{error}</ErrorMessage>
</Space>
```

`TextInput` takes no `id` or `aria-*` props, so it cannot be linked this way;
place the message below it.

### Styling

There is no `style` prop. Override with `className` at `'&&'` specificity,
never `!important`.

## Do / don't

- Do keep it mounted and pass `error` as children.
- Do link it to a native field with `id` and `aria-describedby`.
- Don't use it for permanent red copy; use `<Text tone="danger">`.
- Don't add margins to it; use `Space`.

<!-- generated:examples -->

## Examples

### Basic

Keep it mounted and pass the error as `children`: it is announced when text
appears and renders nothing when `children` is `undefined`.

```tsx
import { ErrorMessage, Space } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [error, setError] = useState<string | undefined>('Could not save the book.');
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <Button onClick={() => setError('Could not save the book.')}>Show error</Button>
        <Button onClick={() => setError(undefined)}>Clear error</Button>
      </Space>
      <ErrorMessage>{error}</ErrorMessage>
    </Space>
  );
}
```

### Under a field

Space it from the field above with `Space` `gap`; it has no margin. The
message shows while the title is empty and goes away once one is typed.

```tsx
import { Card, ErrorMessage, Space } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function UnderAField() {
  const [title, setTitle] = useState<string | undefined>(undefined);
  return (
    <Card title="New book">
      <Space direction="vertical" gap="sm">
        <TextInput name="title" label="Title" value={title} onChange={setTitle} />
        <ErrorMessage>{title ? undefined : 'Title is required.'}</ErrorMessage>
      </Space>
    </Card>
  );
}
```

### The rendered element

`as` picks the element: `p`, `div` or `span`. Each one keeps `role="alert"`.

```tsx
import { ErrorMessage, Space, Text } from '@korzun/design/component';

export default function As() {
  return (
    <Space direction="vertical" gap="md">
      <Space direction="vertical" gap="xs">
        <Text tone="muted" size="sm">
          {'as="p"'}
        </Text>
        <ErrorMessage as="p">Could not save the book.</ErrorMessage>
      </Space>
      <Space direction="vertical" gap="xs">
        <Text tone="muted" size="sm">
          {'as="div"'}
        </Text>
        <ErrorMessage as="div">Could not save the book.</ErrorMessage>
      </Space>
      <Space direction="vertical" gap="xs">
        <Text tone="muted" size="sm">
          {'as="span"'}
        </Text>
        <ErrorMessage as="span">Could not save the book.</ErrorMessage>
      </Space>
    </Space>
  );
}
```

### What counts as empty

`undefined`, `null`, `false` and `''` render nothing, not an empty alert.
`0` is not empty and renders.

```tsx
import { ErrorMessage, Space, Text } from '@korzun/design/component';

export default function EmptyChildren() {
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <Text tone="muted" size="sm">
          undefined:
        </Text>
        <ErrorMessage>{undefined}</ErrorMessage>
      </Space>
      <Space>
        <Text tone="muted" size="sm">
          null:
        </Text>
        <ErrorMessage>{null}</ErrorMessage>
      </Space>
      <Space>
        <Text tone="muted" size="sm">
          false:
        </Text>
        <ErrorMessage>{false}</ErrorMessage>
      </Space>
      <Space>
        <Text tone="muted" size="sm">
          empty string:
        </Text>
        <ErrorMessage>{''}</ErrorMessage>
      </Space>
      <Space>
        <Text tone="muted" size="sm">
          0:
        </Text>
        <ErrorMessage>{0}</ErrorMessage>
      </Space>
    </Space>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The error text. `null`, `undefined`, `false` and `''` render nothing; `0` renders. |
| `as` | `'p' \| 'div' \| 'span'` | `'p'` | The element to render. |
| `className` | `string` |  | Extra class on the root. Override with `'&&'` specificity, never `!important`. |
| `ref` | `Ref<HTMLElement>` |  | Ref to the root element. |

Also accepts: `HTMLAttributes`.

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.3.0** (2026-11-22): New `ErrorMessage` (component): a `role="alert"` danger-coloured error line that renders nothing when empty.

<!-- /generated:changelog -->
