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
- Don't pass an `action`; render a separate `Button` beside the field instead.
- Don't rely on clicking the label to focus the field; it isn't associated.

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
import { Stack } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Horizontal');
  const [vertical, setVertical] = useState<string | undefined>('Vertical');
  const [inline, setInline] = useState<string | undefined>('Inline');
  return (
    <Stack>
      <TextInput
        name="horizontal"
        layout="horizontal"
        label="Horizontal"
        value={horizontal}
        onChange={setHorizontal}
      />
      <TextInput
        name="vertical"
        layout="vertical"
        label="Vertical"
        value={vertical}
        onChange={setVertical}
      />
      <TextInput name="inline" layout="inline" label="Inline" value={inline} onChange={setInline} />
    </Stack>
  );
}
```

### Validation

`validate` receives the raw text on each keystroke. While it returns `false`
the label and border turn red, `onChange` is not called (the saved value stays
at the last valid text) and `onValidChange` fires once when validity flips.
Type past ten characters to see it.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Validation() {
  const [title, setTitle] = useState<string | undefined>('Dune');
  const [valid, setValid] = useState(true);
  return (
    <Stack>
      <TextInput
        name="title"
        layout="vertical"
        label="Title (up to 10)"
        value={title}
        onChange={setTitle}
        validate={(text) => text.length <= 10}
        onValidChange={(_name, ok) => setValid(ok)}
      />
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

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `action` | [TextInputAction](#textinputaction) |  | Broken, do not use: the icon button is drawn but its `action` callback is never wired up. |
| `autoCapitalize` | `'none' \| 'sentences' \| 'words' \| 'characters'` |  | Passed through to the input. |
| `autoComplete` | `HTMLInputAutoCompleteAttribute \| undefined` |  | Passed through to the input. |
| `label` | `string` |  | Visible label. Not linked to the input (no `htmlFor`). |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `horizontal` and `vertical` paint a shaded card-header row with `md` corners; `inline` paints nothing. |
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

Trailing icon button of a `TextInput`. Broken: `action` is never called.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `action` (required) | `() => void` |  | Never wired up: clicking the icon does nothing. |
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
| `theme.radius.md` | `8px` | `8px` |
| `theme.recipe.input` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxxxxl` | `2rem` | `2rem` |
| `theme.zIndex.base` | `1` | `1` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
