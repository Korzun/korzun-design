---
title: DateTimeInput
description: A date with an optional time, edited through the browser's native pickers and stored as an ISO 8601 string.
category: Inputs
---
# DateTimeInput

<!-- generated:import -->

`import { DateTimeInput, type DateTimeInputProps } from '@korzun/design/control'`

<!-- /generated:import -->

A date with an optional time, edited through the browser's native date and time
pickers and stored as an ISO 8601 string. The time box stays disabled until
there is a date; clearing the date clears the time.

Use something else for: free text (`TextInput`), a year-only number
(`NumberInput`).

## Usage

### Behaviour

No `className`, no `disabled`, no `min` / `max`.

### Value format

| User has | `onChange` receives |
|---|---|
| no date | `undefined` |
| a date only | `'2023-06-06'` |
| date and time | `'2023-06-06T16:30:00Z'` |

- **The time is UTC, not local.** A stored `2015-08-04T22:30:00-05:00` displays
  as 2015-08-05, 03:30, and the user picks times in UTC too.
- Year and year-month values display as the 1st of the period (`1965` shows
  1965-01-01). Merely displaying doesn't rewrite them; editing does.
- An unreadable value (`'June 2023'`, `'2023-13-45'`) displays as empty.
- Native form data holds the date and the time as **two separate fields**
  (`name`, `nameTime`), not the composed value. Submit `value` from state.

## Do / don't

- Do keep the composed string from `onChange` in state and send that.
- Do tell users times are UTC if that matters for the field.
- Don't read `FormData.get(name)` expecting a timestamp; it is only the date part.

<!-- generated:examples -->

## Examples

### Basic

A date with an optional time. Both come from the browser's native pickers; the time
box stays disabled until there is a date. `onChange` receives the recomposed ISO string,
not an event, and `undefined` once the date is cleared.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { DateTimeInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Stack>
      <DateTimeInput name="publishDate" label="Publish date" value={value} onChange={setValue} />
      <Text tone="muted">Value: {value ?? 'undefined'}</Text>
    </Stack>
  );
}
```

### Layouts

`horizontal` and `vertical` paint a shaded row, with the label beside the inputs or
above them. `inline` paints no row, for a spot inside your own layout.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { DateTimeInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('2023-06-06T16:30:00Z');
  const [vertical, setVertical] = useState<string | undefined>('2023-06-06');
  const [inline, setInline] = useState<string | undefined>(undefined);
  return (
    <Stack>
      <Text tone="muted">layout horizontal</Text>
      <DateTimeInput
        name="horizontal"
        label="Published"
        layout="horizontal"
        value={horizontal}
        onChange={setHorizontal}
      />
      <Text tone="muted">layout vertical</Text>
      <DateTimeInput
        name="vertical"
        label="Published"
        layout="vertical"
        value={vertical}
        onChange={setVertical}
      />
      <Text tone="muted">layout inline</Text>
      <DateTimeInput
        name="inline"
        label="Published"
        layout="inline"
        value={inline}
        onChange={setInline}
      />
    </Stack>
  );
}
```

### Stored values

`value` is an ISO 8601 string as a server stores it, and the inputs re-sync when it
changes. A year or year-month shows as the 1st of the period, a timestamp shows in UTC
(22:30 at -05:00 is 03:30 the next day), and an unreadable string or `''` shows as empty.
Pick a sample, then edit the date to see what `onChange` sends back.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { DateTimeInput, SegmentedControl } from '@korzun/design/control';
import { useState } from 'react';

const SAMPLES = [
  { value: '2023', label: 'Year' },
  { value: '2023-06', label: 'Month' },
  { value: '2023-06-06', label: 'Day' },
  { value: '2015-08-04T22:30:00-05:00', label: 'Timestamp' },
  { value: 'June 2023', label: 'Unreadable' },
  { value: '', label: 'None' },
] as const;

export default function StoredValues() {
  const [value, setValue] = useState<string | undefined>('2023-06');
  return (
    <Stack>
      <SegmentedControl
        label="Stored value"
        options={SAMPLES}
        value={value ?? null}
        onChange={setValue}
      />
      <DateTimeInput name="stored" label="Publish date" value={value} onChange={setValue} />
      <Text tone="muted">Value: {value === undefined ? 'undefined' : `'${value}'`}</Text>
    </Stack>
  );
}
```

### In a Card

A form field beside the others in a Card. Keep the composed string from
`onChange` in state and send that: native form data holds the date and the time as
two separate fields (`publishDate`, `publishDateTime`).

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button, DateTimeInput, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function InACard() {
  const [title, setTitle] = useState<string | undefined>('Dune');
  const [publishDate, setPublishDate] = useState<string | undefined>('2023-06-06T16:30:00Z');
  const [sent, setSent] = useState<string | null>(null);
  return (
    <Card
      title="Publication"
      footer={
        <Button
          type="primary"
          onClick={() => setSent(`${title ?? ''}, ${publishDate ?? 'no date'}`)}
        >
          Save
        </Button>
      }
    >
      <Stack>
        <TextInput name="title" label="Title" value={title} onChange={setTitle} />
        <DateTimeInput
          name="publishDate"
          label="Publish date"
          value={publishDate}
          onChange={setPublishDate}
        />
        {sent !== null && <Text tone="success">Sent: {sent}</Text>}
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
| `label` | `string` |  | Linked to the date input; the time input is labelled `${label} time` (or `Time`). |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `'horizontal'` and `'vertical'` paint a shaded row (`bg.cardHeader`) with corners that follow surface depth ([corners](../corners.md)); `'inline'` paints none. |
| `name` (required) | `string` |  | The date input's `name`; the time input is `${name}Time`. Form data holds two fields, not the composed value. |
| `onChange` | `(newValue: string \| undefined) => void` | `() => {}` | Receives the recomposed ISO string (time in UTC), or `undefined` when the date is cleared; not an event. |
| `value` (required) | `string \| undefined` |  | An ISO 8601 date string as the server stores it: a bare date, a timestamp, or a lower-precision year / year-month. `undefined` and `''` both mean "no date". The inputs re-sync when this changes. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.cardHeader` | `#EEEEEE` | `#232427` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.layout.controlHeight` | `2.0625rem` | `2.0625rem` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.input` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.zIndex.base` | `1` | `1` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): Corners follow surface depth, like `Button` and `Select`: `lg` directly on a `Page`, `md` in a Card or Dialog (unchanged), `sm` two or more levels in (a nested Card, a `CardRow` or `Surface` in a Card, a Popover). A field's shaded row and the field in it take the same radius; `ChipsInput` chips and a horizontal `Switch`'s `inset` track are a step squarer than their box. With no surface above, each keeps its 0.6.0 look. **Visible changes:** fields and Tags placed directly on a Page get 16px corners, and Tags inside a `CardRow` in a Card get 4px.

<!-- /generated:changelog -->
