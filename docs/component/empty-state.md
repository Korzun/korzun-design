---
title: EmptyState
description: The centred "nothing here" block a page shows in place of a list, also used for loading and error states.
category: Feedback
---
# EmptyState

<!-- generated:import -->

`import { EmptyState, type EmptyStateProps } from '@korzun/design/component'`

<!-- /generated:import -->

The centred "nothing here" block a screen shows in place of a list: a title
line and an optional faint second line, with generous vertical padding
(`4rem`). Also used for a list's loading and error states.

Use something else for: an empty message *inside* a `Card` (a plain
left-aligned line of card content reads right there), transient feedback
(`useToast`).

## Usage

### Choosing a title and second line

Keep `title` short and say what is not here. Put the explanation or next step
in `children`. Only `undefined` omits the second line; `null` renders an empty
one.

### Styling

No `className`. It renders plain `div`s with no `role`; it is not a live
region.

## Do / don't

- Do use it directly on the page background, as a sibling of the Cards.
- Do keep `title` short; put the explanation or next step in `children`.
- Don't set `danger` for "no results"; that is not an error.
- Don't pass `null` as `children` expecting no second line: only `undefined`
  omits it (`null` renders an empty second line).

<!-- generated:examples -->

## Examples

### Basic

A short `title` says what is not here; `children` is the optional second
line with the next step.

```tsx
import { EmptyState } from '@korzun/design/component';

export default function Basic() {
  return <EmptyState title="No requests yet">Fill in the form above to ask for a book.</EmptyState>;
}
```

### Title only

With no `children` there is no second line: a list's loading state needs
only the title.

```tsx
import { EmptyState } from '@korzun/design/component';

export default function TitleOnly() {
  return <EmptyState title="Loading…" />;
}
```

### Danger

`danger` tints the title red. Use it for a load failure, never for an
honestly empty list.

```tsx
import { EmptyState } from '@korzun/design/component';

export default function Danger() {
  return (
    <EmptyState title="Error loading requests" danger>
      Check your connection and reload the page.
    </EmptyState>
  );
}
```

### A list's states on the page

Directly on the page background, as a sibling of the Cards: loading, a
load failure with `danger`, an empty list, and the rows once there are any.
The buttons switch the state.

```tsx
import { Card, EmptyState, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

type State = 'loading' | 'error' | 'empty' | 'loaded';

const states: State[] = ['loading', 'error', 'empty', 'loaded'];

export default function ListStates() {
  const [state, setState] = useState<State>('empty');

  let list;
  if (state === 'loading') {
    list = <EmptyState title="Loading…" />;
  } else if (state === 'error') {
    list = <EmptyState title="Error loading requests" danger />;
  } else if (state === 'empty') {
    list = (
      <EmptyState title="No requests yet">Fill in the form above to ask for a book.</EmptyState>
    );
  } else {
    list = (
      <Card>
        <Text>Middlemarch by George Eliot</Text>
      </Card>
    );
  }

  return (
    <Space direction="vertical">
      <Space wrap>
        {states.map((s) => (
          <Button key={s} type={s === state ? 'primary' : 'default'} onClick={() => setState(s)}>
            {s}
          </Button>
        ))}
      </Space>
      <Card title="New request">
        <Text tone="muted">Title and author go here.</Text>
      </Card>
      {list}
    </Space>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The optional second line: what to do about it, or why it is empty. Only `undefined` omits it; `null` renders an empty line. |
| `danger` | `boolean` | `false` | Tints the title red. For a load failure, not for an honestly empty list. |
| `title` (required) | `string` |  | The one line that says what is not here. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.fontSize.lg` | `1rem` | `1rem` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.fontWeight.semibold` | `600` | `600` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.xxl` | `1rem` | `1rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
