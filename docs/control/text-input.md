---
title: TextInput
description: A single-line text or password field with a label, validation, and a character counter near `maxLength`.
category: Inputs
---
# TextInput

<!-- generated:import -->

`import { TextInput, type TextInputAction, type TextInputProps } from '@korzun/design/control'`

<!-- /generated:import -->

A single-line text (or password) field with an optional label, optional
validation, and a character counter that appears near `maxLength`. The default
`horizontal` layout puts the label and field on one shaded row, which is how
form fields look inside a `Card`.

Use something else for: multi-line text (`TextArea`), numbers (`NumberInput`),
picking from a list (`Select`), a list of tags (`ChipsInput`), dates
(`DateTimeInput`).

## Usage

### Controlled-ish

The field keeps its own text. It re-syncs from `value` only when the `value`
prop changes. While `validate` fails, the field shows the invalid text but
`onChange` is not called, so your state keeps the last valid value. Track
`onValidChange` to block submit.

### What it has no prop for

No `className`, no `disabled`, no `id`.

## Do / don't

- Do keep the default `horizontal` layout for fields in a `Card` body; use
  `vertical` when the label is long or the field is wide.
- Do coalesce `undefined` (`v ?? ''`) if your state is a plain string.
- Do give an `action` an `ariaLabel`; the icon alone has no name.
- Do set `ariaLabel` on a field with no visible `label`.

<!-- generated:examples -->

## Examples

### Basic

A controlled field. `onChange` receives the string, not an event, and
`undefined` once the field is emptied.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [name, setName] = useState<string | undefined>('Ada');
  return (
    <Stack>
      <TextInput name="name" label="Name" value={name} onChange={setName} />
      <Text tone="muted">Value: {name === undefined ? 'undefined' : `“${name}”`}</Text>
    </Stack>
  );
}
```

### Layouts

`horizontal` puts the label and field on one shaded row, `vertical` stacks
the label above the field on that row, and `inline` paints nothing around the
pair.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Dune');
  const [vertical, setVertical] = useState<string | undefined>('Middlemarch');
  const [inline, setInline] = useState<string | undefined>('Emma');
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <TextInput
          name="horizontal"
          layout="horizontal"
          label="Title"
          value={horizontal}
          onChange={setHorizontal}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="vertical"
        </Text>
        <TextInput
          name="vertical"
          layout="vertical"
          label="Title"
          value={vertical}
          onChange={setVertical}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="inline"
        </Text>
        <TextInput
          name="inline"
          layout="inline"
          label="Title"
          value={inline}
          onChange={setInline}
        />
      </Stack>
    </Stack>
  );
}
```

### Validation

`validate` receives the raw text on each keystroke. While it returns `false`
the label and border turn red, `onChange` is not called (the saved value stays
at the last valid text) and `onValidChange` fires once when validity flips.
The demo opens with an over-long title typed in, so it starts invalid; shorten it to
ten characters or fewer.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useEffect, useRef, useState } from 'react';

// Types `text` into the field once on mount, as a user would, so the demo opens
// in the state that text produces (the ref survives Strict Mode's second run).
function useTypeOnMount(text: string) {
  const box = useRef<HTMLDivElement>(null);
  const typed = useRef(false);
  useEffect(() => {
    const field = box.current?.querySelector('input');
    if (typed.current || !field) return;
    typed.current = true;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(field, text);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }, [text]);
  return box;
}

export default function Validation() {
  const [title, setTitle] = useState<string | undefined>('Dune');
  const [valid, setValid] = useState(true);
  const box = useTypeOnMount('Dune Messiah');
  return (
    <Stack>
      <div ref={box}>
        <TextInput
          name="title"
          layout="vertical"
          label="Title (up to 10)"
          value={title}
          onChange={setTitle}
          validate={(text) => text.length <= 10}
          onValidChange={(_name, ok) => setValid(ok)}
        />
      </div>
      <Text tone={valid ? 'success' : 'danger'}>{valid ? 'Valid' : 'Invalid'}</Text>
      <Text tone="muted">Saved value: {title === undefined ? 'undefined' : `“${title}”`}</Text>
    </Stack>
  );
}
```

### Password

`password` renders `type="password"`; `autoComplete="new-password"` tells the
browser to offer a generated one rather than a saved one.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Password() {
  const [password, setPassword] = useState('');
  return (
    <Stack>
      <TextInput
        name="new-password"
        label="New"
        password
        autoComplete="new-password"
        value={password}
        onChange={(v) => setPassword(v ?? '')}
      />
      <Text tone="muted">Length: {password.length}</Text>
    </Stack>
  );
}
```

### Character counter

`maxLength` limits the text natively. The `n/max` counter appears once the field is
within the last 10% of the limit (at least 10 characters) and turns red at the limit.
The first field is near its limit, the second is at it.

```tsx
import { Stack } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function CharacterCounter() {
  const [near, setNear] = useState<string | undefined>('Short story collection, volume two');
  const [full, setFull] = useState<string | undefined>('Exactly thirty characters long');
  return (
    <Stack>
      <TextInput
        name="near"
        layout="vertical"
        label="Near the limit"
        maxLength={40}
        value={near}
        onChange={setNear}
      />
      <TextInput
        name="full"
        layout="vertical"
        label="At the limit"
        maxLength={30}
        value={full}
        onChange={setFull}
      />
    </Stack>
  );
}
```

### Placeholder and key handling

`placeholder` shows while the field is empty. `onKeyDown` is passed through and,
unlike `onChange`, receives the event. `autoCapitalize="none"` keeps
mobile keyboards from capitalising the first letter.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function PlaceholderAndKeys() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <Stack>
      <TextInput
        name="username"
        layout="inline"
        label="Username"
        placeholder="Type, then press Enter"
        autoCapitalize="none"
        autoComplete="username"
        value={username}
        onChange={setUsername}
        onKeyDown={(event) => {
          if (event.key === 'Enter') setSubmitted(username ?? '');
        }}
      />
      <Text tone="muted">Submitted: {submitted === null ? 'nothing yet' : `“${submitted}”`}</Text>
    </Stack>
  );
}
```

### Form in a card

The `horizontal` layout is made for a `Card` body. Fields report their
validity through `onValidChange`, so Save stays disabled while any is
invalid.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function FormInCard() {
  const [name, setName] = useState<string | undefined>('Ada Lovelace');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const invalid = Object.values(valid).some((ok) => !ok);
  return (
    <Card
      title="Account"
      footer={
        <Button type="primary" disabled={invalid} onClick={() => setSaved(name ?? '')}>
          Save
        </Button>
      }
    >
      <Stack>
        <TextInput
          name="name"
          label="Name"
          maxLength={64}
          validate={(v) => v.length <= 64 && v.trim().length > 0}
          onValidChange={(field, ok) => setValid((s) => ({ ...s, [field]: ok }))}
          value={name}
          onChange={setName}
        />
        <TextInput
          name="new-password"
          label="New"
          password
          autoComplete="new-password"
          value={password}
          onChange={(v) => setPassword(v ?? '')}
        />
        {saved !== null && <Text tone="success">Saved: {saved}</Text>}
      </Stack>
    </Card>
  );
}
```

### Action

`action` puts an icon button inside the field's right end. Give it an
`ariaLabel`, since the icon alone has no name. Here it clears the search.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { CircleXIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Action() {
  const [query, setQuery] = useState<string | undefined>('Earthsea');
  return (
    <Stack>
      <TextInput
        name="query"
        label="Search"
        value={query}
        onChange={setQuery}
        action={{ icon: CircleXIcon, ariaLabel: 'Clear search', action: () => setQuery(undefined) }}
      />
      <Text tone="muted">Query: {query === undefined ? 'none' : `“${query}”`}</Text>
    </Stack>
  );
}
```

### Without a label

A field with no visible `label` takes `ariaLabel`, so assistive tech can
still name it. With a `label`, the label names the field instead.

```tsx
import { Inline, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function WithoutLabel() {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  return (
    <Inline>
      <TextInput
        name="filter"
        layout="inline"
        ariaLabel="Filter books"
        placeholder="Filter books"
        value={filter}
        onChange={setFilter}
      />
      <Text tone="muted">Filter: {filter === undefined ? 'none' : `“${filter}”`}</Text>
    </Inline>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `action` | [TextInputAction](#textinputaction) |  | An icon button inside the field's right end, such as clear or reveal. |
| `ariaLabel` | `string` |  | Accessible name of the input when there is no visible `label`. With a `label`, the label names it and this is ignored. |
| `autoCapitalize` | `'none' \| 'sentences' \| 'words' \| 'characters'` |  | Passed through to the input. |
| `autoComplete` | `HTMLInputAutoCompleteAttribute \| undefined` |  | Passed through to the input. |
| `label` | `string` |  | Visible label, linked to the input so it names it. |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal` and `vertical` paint a shaded card-header row with corners that follow surface depth ([corners](../corners.md)); `inline` paints nothing. |
| `maxLength` | `number` |  | Native limit, plus an `n/max` counter once within `max(10% of max, 10)` characters; the counter turns red at the limit. |
| `name` (required) | `string` |  | The input's `name` (form data) and the key passed to `onValidChange`. |
| `onChange` | `(newValue: string \| undefined) => void` | `() => {}` | Receives the string, or `undefined` when emptied; not an event. Not called while `validate` fails. |
| `onKeyDown` | `(event: KeyboardEvent<HTMLInputElement>) => void` |  | Passed through; unlike `onChange`, this one receives the event. |
| `onValidChange` | `(fieldName: string, newValid: boolean) => void` | `() => {}` | Called with `name` and the new validity; fires only when validity flips. |
| `password` | `boolean` | `false` | Renders `type="password"`. |
| `placeholder` | `string` |  | Placeholder text for the input. |
| `validate` | `(newValue: string) => boolean` | `() => true` | Receives the raw text on each keystroke; `false` turns label and border red. |
| `value` (required) | `string \| undefined` | `''` | Typed as required: pass it, even as `undefined` for empty. Re-syncs into the field only when the prop changes; see [Controlled-ish](#controlled-ish). |

### TextInputAction

Trailing icon button of a `TextInput`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `action` (required) | `() => void` |  | Called when the icon button is clicked. |
| `ariaLabel` | `string` |  | Accessible name of the icon button (`Clear search`); an icon alone has none. |
| `danger` | `boolean` |  | Red icon. |
| `icon` (required) | `ComponentType<IconProps>` |  | Icon component, not an element. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.cardHeader` | `#EEEEEE` | `#232427` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.fontSize.xxs` | `0.6rem` | `0.6rem` |
| `theme.layout.controlHeight` | `2.0625rem` | `2.0625rem` |
| `theme.lineHeight.tight` | `1` | `1` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.input` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xl` | `0.75rem` | `0.75rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxl` | `1rem` | `1rem` |
| `theme.space.xxxxxl` | `2rem` | `2rem` |
| `theme.zIndex.base` | `1` | `1` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.6.0 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px. A text field, `ChipsInput` box or field label directly on a Page also moves its text 16px in from the edge (8px elsewhere), the inset `Button` keeps, so it clears the deeper corner.
- **0.5.2** (2026-11-26): The visible `label` is linked to its field (`htmlFor` and a generated `id`), so it names the field and clicking it focuses the field. A new `ariaLabel` prop names a field that has no visible `label`; with a `label` it is ignored.
- **0.5.2** (2026-11-26): `action` works: clicking its icon button calls `action.action`. `TextInputAction` gains an optional `ariaLabel` naming that button.

<!-- /generated:changelog -->
