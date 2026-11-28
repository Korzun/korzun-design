---
title: Button
description: A clickable action with a visual variant, optional icons, and a loading state.
category: Actions
---
# Button

<!-- generated:import -->

```ts
import {
  Button,
  type ButtonProps,
  type ButtonRadiusValue,
  type ButtonTypeValue,
} from '@korzun/design/control';
```

<!-- /generated:import -->

A clickable action with a visual variant, optional icons, and a loading state.
Renders a `<div role="button">` (keyboard: Enter and Space, which it
preventDefaults, so Space does not scroll the page) unless `submit` is
set, in which case it renders a native `<button type="submit">`.

Use something else for: navigating back (`BackButton`), page-level actions in
the header (`PageActionsBar`, `PageActionsMenu`), sticky footer actions
(`PageFooterActions`), picking one of several options (`SegmentedControl`).

Every button but `link` is 32px tall: it pins its own line-height, so a
parent's (a Modal's 1.3) does not stretch it, and an icon-only button matches
a text one. Keyboard focus (`:focus-visible`) on `text` and `link` draws a solid
`border.focus` ring, since they have no border or fill of their own.

## Usage

### Choosing a variant

- `primary`: the one main action of a card, modal, or page (Save, Confirm).
- `default`: secondary actions; bordered.
- `text`: Cancel in a modal footer.
- `link`: inline row actions (Remove, Load more). It has no padding, so `radius`
  doesn't matter for it.
- `dashed`: an "add a row" affordance (as in `FieldList`).
- Add `danger` for destructive actions (Delete, Log out), on `primary` in a
  confirm or on `default` otherwise.

### Corners

The radius follows where the button sits (16px on a page, 8px in a `Card` or
`Modal`, 4px in a `Popover` or nested Card), so pass no `radius`; see
[corners](../corners.md). Pass it only to override.

### Submitting a form

`submit` renders a native submit button and `onClick` is then ignored: handle
the form's `action` or `onSubmit`. For a button outside its form (a `Card`
footer), pass the form's id as `form`. While the form action is pending the
button shows its spinner by itself.

## Do / don't

- Don't set `radius` to match the surface; it follows depth. Pass it only to
  override.
- Do give repeated row actions a distinguishing `ariaLabel` ("Remove Kindle").
- Don't pass `type="submit"`: it is not a valid variant. Use `submit`.
- Don't pass `onClick` to a submit button and expect it to run.
- Don't pass an element to `prefix`/`suffix` (`prefix={<SearchIcon />}`); pass
  the component.
- Don't wrap Button in a `<button>` or `<a>`: it is already interactive.

<!-- generated:examples -->

## Examples

### Basic

One `primary` action for the main step and a `default` button beside it.
`onClick` takes no arguments: the button passes no event.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [saves, setSaves] = useState(0);
  return (
    <Stack align="start">
      <Inline>
        <Button onClick={() => setSaves(0)}>Reset</Button>
        <Button type="primary" onClick={() => setSaves((n) => n + 1)}>
          Save
        </Button>
      </Inline>
      <Text tone="muted">Saves: {saves}</Text>
    </Stack>
  );
}
```

### Variants

`type` picks the look, not the HTML attribute. `primary` is the one main action,
`default` a secondary one, `text` a Cancel in a modal footer, `link` an inline
row action, and `dashed` an "add a row" affordance.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Variants() {
  const [pressed, setPressed] = useState('nothing yet');
  return (
    <Stack align="start">
      <Inline wrap>
        <Button type="primary" onClick={() => setPressed('Primary')}>
          Primary
        </Button>
        <Button onClick={() => setPressed('Default')}>Default</Button>
        <Button type="text" onClick={() => setPressed('Text')}>
          Text
        </Button>
        <Button type="link" onClick={() => setPressed('Link')}>
          Link
        </Button>
        <Button type="dashed" onClick={() => setPressed('Dashed')}>
          Dashed
        </Button>
      </Inline>
      <Text tone="muted">Pressed: {pressed}</Text>
    </Stack>
  );
}
```

### Danger and success

Add `danger` to a destructive action: on `primary` when it confirms the
deletion, on `default` otherwise. `success` is the green treatment. The two
cannot both be set; TypeScript rejects it.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function DangerAndSuccess() {
  const [pressed, setPressed] = useState('nothing yet');
  return (
    <Stack align="start">
      <Inline wrap>
        <Button danger onClick={() => setPressed('Log out')}>
          Log out
        </Button>
        <Button type="primary" danger onClick={() => setPressed('Delete book')}>
          Delete book
        </Button>
        <Button type="primary" success onClick={() => setPressed('Mark as read')}>
          Mark as read
        </Button>
      </Inline>
      <Text tone="muted">Pressed: {pressed}</Text>
    </Stack>
  );
}
```

### Icons

`prefix` and `suffix` take an icon component (`prefix={SearchIcon}`), not an
element. An icon-only button needs an `ariaLabel` so it has an accessible name.

```tsx
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ChevronIcon, SearchIcon, SettingsIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Icons() {
  const [pressed, setPressed] = useState('nothing yet');
  return (
    <Stack align="start">
      <Inline wrap>
        <Button prefix={SearchIcon} onClick={() => setPressed('Search')}>
          Search
        </Button>
        <Button type="primary" suffix={ChevronIcon} onClick={() => setPressed('Next')}>
          Next
        </Button>
        <Button prefix={SettingsIcon} ariaLabel="Settings" onClick={() => setPressed('Settings')} />
      </Inline>
      <Text tone="muted">Pressed: {pressed}</Text>
    </Stack>
  );
}
```

### Loading and disabled

`loading` swaps the icons for a spinner and blocks clicks; `disabled` greys the
button out. Both take the button out of the tab order.

```tsx
import { Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function LoadingAndDisabled() {
  const [uploading, setUploading] = useState(false);
  return (
    <Inline wrap>
      <Button
        type="primary"
        prefix={UploadIcon}
        loading={uploading}
        onClick={() => setUploading(true)}
      >
        {uploading ? 'Uploading' : 'Upload'}
      </Button>
      <Button type="text" disabled={!uploading} onClick={() => setUploading(false)}>
        Cancel upload
      </Button>
      <Button disabled onClick={() => setUploading(true)}>
        Disabled
      </Button>
    </Inline>
  );
}
```

### Submit button in a card footer

`submit` renders a native submit button; `form` points it at a form elsewhere
in the card. `onClick` is ignored on a submit button, so handle the form's
`action`. Inside a Card the corners step down by themselves: no `radius` prop.

```tsx
import { Card, Stack, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function SubmitInCard() {
  const [name, setName] = useState<string | undefined>('Ada');
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <Card
      title="Profile"
      footer={
        <Button type="primary" submit form="profile-form">
          Save
        </Button>
      }
    >
      <form id="profile-form" action={(data) => setSaved(String(data.get('name') ?? ''))}>
        <Stack>
          <TextInput name="name" label="Name" value={name} onChange={setName} />
          {saved !== null && <Text tone="success">Saved as {saved}</Text>}
        </Stack>
      </form>
    </Card>
  );
}
```

### Confirm dialog footer

A `text` Cancel beside a `primary danger` action. `loading` shows the spinner
and blocks a second click while the deletion runs; `canDismiss={!deleting}`
keeps the dialog open until it finishes. Inside a Modal the corners step down
by themselves: no `radius` prop.

```tsx
import { Stack } from '@korzun/design/component';
import { Button, Modal } from '@korzun/design/control';
import { useState } from 'react';

export default function DialogFooter() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const close = () => {
    setDeleting(false);
    setOpen(false);
  };
  const confirm = () => {
    setDeleting(true);
    setTimeout(close, 1000);
  };
  return (
    <Stack align="start">
      <Button danger onClick={() => setOpen(true)}>
        Delete book
      </Button>
      <Modal
        open={open}
        onClose={close}
        canDismiss={!deleting}
        title="Delete this book?"
        footer={
          <>
            <Button type="text" disabled={deleting} onClick={close}>
              Cancel
            </Button>
            <Button type="primary" danger loading={deleting} onClick={confirm}>
              Delete
            </Button>
          </>
        }
      >
        It is removed from every device. This cannot be undone.
      </Modal>
    </Stack>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The label. |
| `ariaControls` | `string` |  | For a disclosure button: the id of the element it controls. |
| `ariaExpanded` | `boolean` |  | For a disclosure button: whether the element it controls is expanded. |
| `ariaHasPopup` | `'menu' \| 'listbox' \| 'dialog' \| boolean` |  | Announces that the button opens a popup of this kind (`'menu'` for a menu trigger). Rendered in both modes. |
| `ariaLabel` | `string` |  | Accessible name when the visible children are not distinguishing enough on their own — several "Remove" buttons in a list, each belonging to a different row. |
| `className` | `string` |  | Extra class; win specificity with `'&&'` in your sheet, never `!important`. |
| `danger` | `boolean` | `false` | Red treatment for destructive actions. Mutually exclusive with `success` (setting both is a type error). |
| `disabled` | `boolean` | `false` | Greys the button out and blocks clicks. |
| `form` | `string` |  | Id of the `<form>` to submit, for a `submit` button outside its form (e.g. in a `Card` footer). |
| `loading` | `boolean` | `false` | Shows a spinner in place of the icons and blocks clicks. |
| `onClick` | `() => void` | `() => {}` | Click and Enter/Space handler. **Ignored when `submit` is set**; the form submits instead. Receives no event. Not called while `disabled` or `loading`. |
| `prefix` | `ComponentType<IconProps>` |  | Icon component shown before the label (`prefix={SearchIcon}`), not an element. |
| `radius` | `'background' \| 'card' \| 'inset' \| 'modal'` |  | Unset, it follows surface depth: 16px on a page or outside any surface, 8px in a Card or Modal, 4px in a Popover or nested Card. Set, it names the surface the button sits on, which sets its corner radius. Pass it only to override; see [corners](../corners.md). |
| `ref` | `Ref<HTMLElement>` |  | Ref to the root element (the `<div role="button">`, or the `<button>` in submit mode), e.g. to `.focus()` it. A plain prop; no `forwardRef`. |
| `submit` | `boolean` | `false` | Render a native `<button type="submit">`. Also shows the spinner while the enclosing form action is pending (`useFormStatus`). `onClick` is then ignored. |
| `success` | `boolean` | `false` | Green treatment. Mutually exclusive with `danger` (setting both is a type error). |
| `suffix` | `ComponentType<IconProps>` |  | Icon component shown after the label (`suffix={ChevronIcon}`), not an element. |
| `tabIndex` | `number` | `0` | In div mode the button is keyboard-focusable by default; an explicit value wins, except it is forced to `-1` while `disabled` or `loading`. Submit mode passes it through to the native `<button>`, which is focusable anyway. |
| `title` | `string` |  | Native tooltip; passed through. |
| `type` | `'default' \| 'primary' \| 'text' \| 'link' \| 'dashed'` | `'default'` | **Visual variant**, not the HTML `type`. Use `submit` for a submit button. |

### Types

```ts
type ButtonRadiusValue = 'background' | 'card' | 'inset' | 'modal';
type ButtonTypeValue = 'default' | 'primary' | 'text' | 'link' | 'dashed';
```

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

| Token | Light | Dark |
| --- | --- | --- |
| `theme.color.bg.hover` | `rgba(0, 0, 0, 0.07)` | `rgba(255, 255, 255, 0.12)` |
| `theme.color.bg.input` | `#FFFFFF` | `#1A1B1E` |
| `theme.color.bg.success` | `#f0fdf4` | `rgba(34, 197, 94, 0.14)` |
| `theme.color.border.default` | `#D9D9D9` | `#3A3B40` |
| `theme.color.border.focus` | `#0758d9` | `#3696fe` |
| `theme.color.border.loading` | `#e6e6e6` | `#34353A` |
| `theme.color.border.success` | `#bbf7d0` | `rgba(34, 197, 94, 0.4)` |
| `theme.color.brand.active` | `#0758d9` | `#91CAFF` |
| `theme.color.brand.default` | `#1777FF` | `#3696fe` |
| `theme.color.brand.hover` | `#3696fe` | `#87BAFF` |
| `theme.color.brand.linkHover` | `#87BAFF` | `#91CAFF` |
| `theme.color.brand.loading` | `#73A6FF` | `#3E5A8A` |
| `theme.color.brand.loadingActive` | `#6893e7` | `#33507F` |
| `theme.color.brand.loadingHover` | `#87BAFF` | `#1D4ED8` |
| `theme.color.brand.outline` | `#91CAFF` | `rgba(54, 150, 254, 0.45)` |
| `theme.color.danger.active` | `#D9373e` | `#D9373e` |
| `theme.color.danger.default` | `#FF4D4F` | `#FF4D4F` |
| `theme.color.danger.hover` | `#ff7874` | `#FF8E8E` |
| `theme.color.danger.light` | `#fff1f0` | `rgba(255, 77, 79, 0.18)` |
| `theme.color.danger.loading` | `#FF8E8E` | `#FF8E8E` |
| `theme.color.danger.loadingActive` | `#e98182` | `#D9373e` |
| `theme.color.danger.loadingHover` | `#FFA8A6` | `#e98182` |
| `theme.color.danger.outline` | `rgba(255, 120, 116, 0.5)` | `rgba(255, 120, 116, 0.5)` |
| `theme.color.success` | `#16a34a` | `#22C55E` |
| `theme.color.text.muted` | `#6E6E6E` | `#9CA1AB` |
| `theme.color.text.onPrimary` | `#FFFFFF` | `#FFFFFF` |
| `theme.color.text.primary` | `#111` | `#F5F5F7` |
| `theme.fontFamily.body` | `system-ui, sans-serif` | `system-ui, sans-serif` |
| `theme.radius.lg` | `16px` | `16px` |
| `theme.radius.md` | `8px` | `8px` |
| `theme.radius.sm` | `4px` | `4px` |
| `theme.recipe.focusRing` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.recipe.spinner` | [recipe](../tokens.md#recipe) | [recipe](../tokens.md#recipe) |
| `theme.shadow.brandStack` | `0px 2px 0px rgba(23, 119, 255, 0.2)` | `0px 2px 0px rgba(0, 0, 0, 0.4)` |
| `theme.shadow.cardStack` | `0px 2px 0px rgba(217, 217, 217, 0.2)` | `0px 2px 0px rgba(0, 0, 0, 0.4)` |
| `theme.shadow.dangerStack` | `0px 2px 0px rgba(255, 77, 79, 0.1)` | `0px 2px 0px rgba(0, 0, 0, 0.4)` |
| `theme.space.md` | `0.5rem` | `0.5rem` |
| `theme.space.xxl` | `1rem` | `1rem` |

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

- **0.7.0** (2026-11-26): `text` and `link` buttons show a solid 2px `border.focus` ring on keyboard focus (`:focus-visible`); before they showed nothing. Mouse clicks still leave no ring.
- **0.7.0** (2026-11-26): Height no longer follows an inherited line-height: Buttons in a Dialog footer are 32px, not 35px, and an icon-only Button is 32px (was 31px, sitting 1px low) beside text Buttons. The label's line-height is pinned to 14px; `link` stays text-sized.
- **0.5.0** (2026-11-24): Surface depth: corners are concentric site-wide with no radius props. `Page` provides depth 0, `Dialog` 1, and `Card`, `CardRow` and `Alert` each provide one level deeper than where they sit; `Popover` (so `Menu` and the `Select` list) provides a fixed 2. Depth 0 is `radius.lg`, 1 is `md`, 2 and deeper is `sm`. `Button`, `Select`, `Card`, `CardRow` and `Alert` follow it; an explicit `Button radius` or `Select surface` still wins. With no `Page`, `Dialog`, `Card`, `CardRow`, `Alert` or `Surface` above it, a component keeps its 0.4.0 look; a bare `Card` (no `Page`) still counts as depth 0 and gives its contents depth 1, so its Buttons and nested Cards change as below.
- **0.5.0** (2026-11-24): **Visible changes:**
  - Buttons in a Card default to 8px (they were 16px unless `radius="card"` was set), and Buttons in a Dialog body are 8px.
  - Selects directly on a Page get the page look (16px and the card shadow); in a Card or Dialog they stay 8px. This includes Selects in your own boxes on a Page (a `useModalDialog` modal, a `recipe.card.shell` or `recipe.row` box), because depth cannot see hand-drawn boxes: wrap their contents in `Surface`, or pass `surface="card"`.
  - Without a Page, a bare `Card` counts as depth 0: its Buttons go from 16px to 8px, a Card nested in it steps down, and a `CardRow` in it is 8px.
  - A Card nested in a Card or Dialog steps down (8px, then 4px), and so do its Buttons and Selects; `size="small"` keeps its extra 1px.
  - `CardRow` is 16px on a Page and 8px inside a Card (it was always 16px).
  - Buttons and Selects inside a Popover or Menu are 4px.
- **0.5.0** (2026-11-24): The internal `ButtonRadiusContext` is removed; Dialog footer Buttons are unchanged (8px).
- **0.4.0** (2026-11-23): `Button` takes a `ref` and `ariaHasPopup`. Its interactive `<div role="button">` now defaults to `tabIndex={0}` so it is reachable by keyboard (`-1` when disabled or loading; an explicit `tabIndex` wins). Its keydown now calls `preventDefault()` on Enter and Space, so Space no longer scrolls the page and Enter opening a menu does not also activate its first item.
- **0.3.0** (2026-11-22): Buttons in a `Dialog` footer default to `radius="modal"`; an explicit `radius` still wins. The radius applies to the footer only (a Dialog nested in a footer is unaffected), and `footer={false}`, `''` and `null` render no footer bar.

<!-- /generated:changelog -->
