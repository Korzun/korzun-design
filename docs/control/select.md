---
title: Select
description: A single-value dropdown with type-to-search, an optional "Add: …" entry for new values, a clear button, and a loading state.
category: Inputs
---
# Select

<!-- generated:import -->

`import { Select, type SelectOption, type SelectProps } from '@korzun/design/control'`

<!-- /generated:import -->

A single-value dropdown with type-to-search (on by default), an optional "Add:
…" entry for new values, a clear button, and a loading state. The dropdown is a
`Popover`, so it escapes clipping cards. Its list is drawn like a `Menu`: a
4px inset pad, `sm`-rounded 14px options, the `cardStack` shadow, `bg.hover` on
hover and `brand.light` on the keyboard-highlighted option.

Use something else for: 2–5 options that fit in one row (`SegmentedControl`),
several values (`ChipsInput`), on/off (`Switch`).

## Usage

### Choosing a surface

Follow [corners](../corners.md):

- Usually omit it: the default follows where the select sits. Directly on a
  `Page` it is `'page'`; in a card or dialog (and outside any surface) it is
  `'card'`; two or more surfaces deep it is `'inset'`.
- `'card'`: `radius.md`, no shadow.
- `'page'`: `radius.lg` + `shadow.cardStack`, like a card.
- `'inset'`: `radius.sm`, no shadow, for a select nested inside an inset box.
- Pass `surface` only to override the depth.

### Forms

There is no hidden input carrying `value`: native `FormData` will not contain
the selection (only the search text while open). Keep `value` in state and
submit that. The `<label>` targets the search box, so it is not the closed
trigger's accessible name; the trigger announces the selected label or
placeholder.

### Keyboard

Closed: Enter, Space or ArrowDown open it. Open: ArrowUp/ArrowDown move (and
wrap), Enter selects, Escape or Tab close. The highlight starts on the first
option, not the current value.

### Inside a dialog

It works inside a `Dialog` or a modal `<dialog>`: the list opens inside the
open dialog (see [popover](popover.md)).

### Styling

No `className`.

## Do / don't

- Do pass `clearable={false}` when an empty value is invalid.
- Don't pass `surface="page"` inside a card; let the depth decide.

<!-- generated:examples -->

## Examples

### Basic

A controlled single-value picker. Opening it swaps the trigger for a search
box; `onChange` receives the option's value, not an event, and the ✕ clears it.
Select has no `open` prop, so this demo clicks the trigger once on mount to
start open.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useEffect, useRef, useState } from 'react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Fig', 'Grape', 'Mango', 'Pear'];

export default function Basic() {
  const [fruit, setFruit] = useState<string | undefined>('Banana');
  const box = useRef<HTMLDivElement>(null);
  // Opens the list once on mount (the ref survives Strict Mode's second effect run).
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    box.current?.querySelector<HTMLElement>('[role="button"]')?.click();
  }, []);
  return (
    <Stack>
      <div ref={box}>
        <Select name="fruit" label="Fruit" value={fruit} options={FRUITS} onChange={setFruit} />
      </div>
      <Text tone="muted">Chosen: {fruit ?? 'nothing'}</Text>
    </Stack>
  );
}
```

### Surfaces

The corners and elevation follow where the select sits, so none of these
passes `surface`: `'page'` directly on a `Page` (16px, with a shadow),
`'card'` in a `Card` (8px, flat), `'inset'` in a `Card` inside a `Card` (4px, flat).

```tsx
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Fig'];

export default function Surfaces() {
  const [onPage, setOnPage] = useState<string | undefined>('Apple');
  const [inCard, setInCard] = useState<string | undefined>('Banana');
  const [nested, setNested] = useState<string | undefined>('Cherry');
  return (
    <Page type="minimal">
      <Stack gap="xl">
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            On a Page: 'page'
          </Text>
          <Select name="on-page" value={onPage} options={FRUITS} onChange={setOnPage} />
        </Stack>
        <Card title="In a Card">
          <Stack gap="xl">
            <Stack gap="xs">
              <Text size="sm" tone="muted">
                In a Card: 'card'
              </Text>
              <Select name="in-card" value={inCard} options={FRUITS} onChange={setInCard} />
            </Stack>
            <Card title="In a Card in a Card">
              <Stack gap="xs">
                <Text size="sm" tone="muted">
                  In a Card in a Card: 'inset'
                </Text>
                <Select name="nested" value={nested} options={FRUITS} onChange={setNested} />
              </Stack>
            </Card>
          </Stack>
        </Card>
      </Stack>
    </Page>
  );
}
```

### Layouts

`horizontal` puts the label and trigger in one card-header row, `vertical`
stacks the label above the trigger in that row, and `inline` is just the
trigger with the label beside it.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const SIZES = ['Small', 'Medium', 'Large'];

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Small');
  const [vertical, setVertical] = useState<string | undefined>('Medium');
  const [inline, setInline] = useState<string | undefined>('Large');
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <Select
          name="horizontal"
          layout="horizontal"
          label="Size"
          value={horizontal}
          options={SIZES}
          onChange={setHorizontal}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="vertical"
        </Text>
        <Select
          name="vertical"
          layout="vertical"
          label="Size"
          value={vertical}
          options={SIZES}
          onChange={setVertical}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          layout="inline"
        </Text>
        <Select
          name="inline"
          layout="inline"
          label="Size"
          value={inline}
          options={SIZES}
          onChange={setInline}
        />
      </Stack>
    </Stack>
  );
}
```

### Creating a value

`allowCreate` adds an "Add: …" entry when what you type matches no label
exactly. Choosing it passes the trimmed text to `onChange`, and the typed value
then shows as the raw string because it is not in `options`.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const SERIES = ['Discworld', 'The Expanse', 'Earthsea'];

export default function AllowCreate() {
  const [series, setSeries] = useState<string | undefined>();
  return (
    <Stack>
      <Select
        name="series"
        label="Series"
        layout="vertical"
        placeholder="Pick or type a series…"
        value={series}
        options={SERIES}
        allowCreate
        onChange={setSeries}
      />
      <Text tone="muted">Chosen: {series ?? 'nothing'}</Text>
    </Stack>
  );
}
```

### Plain list with descriptions

`searchable={false}` opens a plain list driven by the arrow keys. Options can
be plain strings or `{ label, value, description }` objects, mixed in one list.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

export default function PlainList() {
  const [fit, setFit] = useState<string | undefined>('contain');
  return (
    <Stack>
      <Select
        name="fit"
        label="Cover fit"
        value={fit}
        searchable={false}
        options={[
          { label: 'Contain', value: 'contain', description: 'Letterbox the cover' },
          { label: 'Cover', value: 'cover', description: 'Crop to fill the frame' },
          'stretch',
        ]}
        onChange={setFit}
      />
      <Text tone="muted">Value: {fit ?? 'nothing'}</Text>
    </Stack>
  );
}
```

### Clearable and required

A set value shows a ✕ that sends `undefined` to `onChange`. Pass
`clearable={false}` for a required field, so it can only change to another option:
Shelf can be cleared; Home shelf cannot.

```tsx
import { Stack } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const SHELVES = ['To read', 'Reading', 'Finished'];

export default function Clearable() {
  const [optional, setOptional] = useState<string | undefined>('Reading');
  const [required, setRequired] = useState<string | undefined>('To read');
  return (
    <Stack>
      <Select
        name="optional"
        label="Shelf"
        value={optional}
        options={SHELVES}
        onChange={setOptional}
      />
      <Select
        name="required"
        label="Home shelf"
        value={required}
        options={SHELVES}
        clearable={false}
        onChange={setRequired}
      />
    </Stack>
  );
}
```

### Loading and disabled

`loading` shows a spinner and "Loading…" in place of the value, and the select
can't open; turn it on while the options are on their way. `disabled` fades it,
hides the ✕ and blocks opening.

```tsx
import { Stack } from '@korzun/design/component';
import { Select, Switch } from '@korzun/design/control';
import { useState } from 'react';

const AUTHORS = ['Ursula K. Le Guin', 'Terry Pratchett', 'N. K. Jemisin'];

export default function LoadingAndDisabled() {
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<string | undefined>('Terry Pratchett');
  return (
    <Stack>
      <Switch name="loading" label="Loading" checked={loading} onChange={setLoading} />
      <Select
        name="author"
        label="Author"
        value={author}
        options={AUTHORS}
        loading={loading}
        onChange={setAuthor}
      />
      <Select name="locked" label="Disabled" value="N. K. Jemisin" options={AUTHORS} disabled />
    </Stack>
  );
}
```

### In a card form

A `Select` with no label sits directly on the `Page` and labelled ones in the
`Card`. Fit is a required plain list; Series takes new values with
`allowCreate` and shows `loading` while its options arrive. The selections are
state, so submit `value`: native form data never carries it.

```tsx
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { Button, Select } from '@korzun/design/control';
import { useEffect, useState } from 'react';

const LIBRARIES = ['Home library', 'Work library'];

export default function FormInCard() {
  const [library, setLibrary] = useState<string | undefined>();
  const [fit, setFit] = useState<string | undefined>('contain');
  const [series, setSeries] = useState<string | undefined>();
  const [seriesNames, setSeriesNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSeriesNames(['Discworld', 'The Expanse']);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Page type="minimal">
      <Stack>
        <Select
          name="library"
          placeholder="Select library…"
          value={library}
          options={LIBRARIES}
          onChange={setLibrary}
        />
        <Card
          title="Cover"
          footer={
            <Button
              type="primary"
              onClick={() => setSaved(`${fit ?? ''} / ${series ?? 'no series'}`)}
            >
              Save
            </Button>
          }
        >
          <Stack>
            <Select
              name="coverFit"
              label="Fit"
              value={fit}
              options={[
                { label: 'Contain', value: 'contain', description: 'Letterbox the cover' },
                { label: 'Cover', value: 'cover' },
              ]}
              searchable={false}
              clearable={false}
              onChange={setFit}
            />
            <Select
              name="seriesName"
              label="Series"
              value={series}
              options={seriesNames}
              loading={loading}
              allowCreate
              onChange={setSeries}
            />
            {saved !== null && <Text tone="success">Saved: {saved}</Text>}
          </Stack>
        </Card>
      </Stack>
    </Page>
  );
}
```

### In a dialog

The list opens inside the open dialog, so a `Select` works in a modal. Escape
closes the list first and a second Escape closes the dialog.

```tsx
import { Stack, Text } from '@korzun/design/component';
import { Button, Dialog, Select } from '@korzun/design/control';
import { useState } from 'react';

const SHELVES = ['To read', 'Reading', 'Finished'];

export default function InDialog() {
  const [open, setOpen] = useState(false);
  const [shelf, setShelf] = useState<string | undefined>('To read');
  return (
    <Stack align="start">
      <Button onClick={() => setOpen(true)}>Move book</Button>
      <Text tone="muted">Shelf: {shelf ?? 'none'}</Text>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Move to shelf"
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <Select name="shelf" label="Shelf" value={shelf} options={SHELVES} onChange={setShelf} />
      </Dialog>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `allowCreate` | `boolean` | `false` | With a search query that matches no label exactly, offers an "Add: *query*" option. |
| `clearable` | `boolean` | `true` | Shows a ✕ when a value is set. Pass `false` for required fields. |
| `disabled` | `boolean` | `false` | Faded to 50%; can't open; no clear button. |
| `label` | `string` |  | Visible label. It targets the search box, so it is not the closed trigger's accessible name; see [Forms](#forms). |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | `'horizontal'` and `'vertical'` paint a `bg.cardHeader` row; `'inline'` does not. |
| `loading` | `boolean` | `false` | Shows a spinner and "Loading…"; can't open. |
| `name` (required) | `string` |  | Only lands on the search box while it is open: form data never carries the selection. See [Forms](#forms). |
| `onChange` | `(value: string \| undefined) => void` | `() => {}` | Receives the option's `value`, `undefined` from the clear button, or the trimmed typed text from "Add:". Not an event. |
| `options` (required) | [SelectOption](#types)`[]` |  | Strings or `{ label, value, description? }` objects, mixed freely. |
| `placeholder` | `string` | `'Select…'` | Shown when nothing is selected. |
| `searchable` | `boolean` | `true` | Opening swaps the trigger for a search box. `false` gives a plain list, arrow keys only. |
| `surface` | `'card' \| 'page' \| 'inset'` |  | Unset, it follows the surface depth: `'page'` directly on a `Page`, `'card'` in a card, a dialog or outside any surface, `'inset'` two or more surfaces deep. Set, it overrides that and sets the corner radius and the elevation together; see [Choosing a surface](#choosing-a-surface). |
| `value` (required) | `string \| undefined` |  | Controlled selection. A value not in `options` displays as the raw string. |

### Types

```ts
/** A `Select` option: a plain string (label and value alike), or `{ label, value, description? }`. */
type SelectOption = string | {
    label: string;
    value: string;
    description?: string;
};
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.breakpoint.mobile` | `@media (max-width: 640px)` | `@media (max-width: 640px)` |
| `theme.color.bg.card` | `#FCFCFC` | `#1A1B1E` |
| `theme.color.bg.cardHeader` | `#EEEEEE` | `#232427` |
| `theme.color.bg.hover` | `rgba(0, 0, 0, 0.07)` | `rgba(255, 255, 255, 0.12)` |
| `theme.color.bg.selected` | `#dbeafe` | `rgba(23, 119, 255, 0.24)` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.border.focus` | `#0758d9` | `#3696fe` |
| `theme.color.border.light` | `#e5e7eb` | `#333439` |
| `theme.color.border.strong` | `#DDDDDD` | `#48494F` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.brand.light` | `#EFF6FF` | `rgba(23, 119, 255, 0.2)` |
| `theme.color.text.faint` | `#9ca3af` | `#6E7480` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontFamily.body` | `system-ui, sans-serif` | `system-ui, sans-serif` |
| `theme.fontSize.md` | `0.875rem` | `0.875rem` |
| `theme.fontSize.sm` | `0.75rem` | `0.75rem` |
| `theme.fontWeight.semibold` | `600` | `600` |
| `theme.layout.controlHeight` | `2.0625rem` | `2.0625rem` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.input` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.label` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.spinner` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.shadow.cardStack` | `0px 2px 0px rgba(217, 217, 217, 0.2)` | `0px 2px 0px rgba(0, 0, 0, 0.4)` |
| `theme.space.lg` | `0.625rem` | `0.625rem` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.sm` | `0.375rem` | `0.375rem` |
| `theme.space.xs` | `0.25rem` | `0.25rem` |
| `theme.space.xxs` | `0.125rem` | `0.125rem` |
| `theme.transition.fast` | `0.1s ease-in` | `0.1s ease-in` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): The option list matches `Menu`: a 4px inset pad, 4px-rounded options with a 2px gap, 14px text (was 12.8px), the flat `cardStack` shadow (was `hoverLift`) and `bg.hover` on hover (was `bg.cardHeader`). The keyboard highlight is unchanged.
- **0.7.0** (2026-11-26): Dark `color.border.light` is `#333439` (was `#2B2C30`, 1.10:1 on `bg.page` and 1.23:1 on `bg.card`, so hairline rules all but vanished); it is now 1.24:1 and 1.39:1, at or above light mode's step. A loading `Select`'s border in dark is a shade lighter. Light is unchanged.
- **0.5.0** (2026-11-24): Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- **0.5.0** (2026-11-24): **Visible changes:**
  - Buttons in a Card default to 8px (they were 16px unless `radius="card"` was set), and Buttons in a Dialog body are 8px.
  - Selects directly on a Page get the page look (16px and the card shadow); in a Card or Dialog they stay 8px. This includes Selects in your own boxes on a Page (a `useModalDialog` modal, a `recipe.card.shell` or `recipe.row` box), because depth cannot see hand-drawn boxes: wrap their contents in `Surface`, or pass `surface="card"`.
  - Without a Page, a bare `Card` counts as depth 0: its Buttons go from 16px to 8px, a Card nested in it steps down, and a `CardRow` in it is 8px.
  - A Card nested in a Card or Dialog steps down (8px, then 4px), and so do its Buttons and Selects; `size="small"` keeps its extra 1px.
  - `CardRow` is 16px on a Page and 8px inside a Card (it was always 16px).
  - Buttons and Selects inside a Popover or Menu are 4px.
- **0.5.0** (2026-11-24): `Select` `surface` gains `'inset'` (`radius.sm`, no shadow), used two or more levels deep.
- **0.3.0** (2026-11-22): `Popover` renders inside an open `<dialog>` that contains its anchor, so `Select` and `ChipsInput` work in modals.
- **0.1.0** (2026-11-21): `Popover`:
  - `side` (`bottom`/`top`) and `align` (`start`/`center`/`end`).
  - Flips when the preferred side has no room.
  - Stays inside the viewport horizontally, unless `matchWidth` (then it lines up with the anchor exactly).
  - On the top side it is anchored by its bottom edge, and it re-measures when its content resizes (`ResizeObserver`), so it stays attached as content grows or shrinks.
  - The provisional first render is transparent rather than hidden, so an `autoFocus` child takes focus.
  - Exposes `data-side`.
  - Escape calls `onClose` unless already handled, without closing a surrounding dialog.
  - Defaults keep the same position when there is room below; `Select` and `ChipsInput` now open upward near the bottom of the viewport.

<!-- /generated:changelog -->
