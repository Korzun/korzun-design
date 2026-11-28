---
title: Icons
description: Inline SVG icon components that take the surrounding text colour, with the shared IconProps.
category: Foundations
---
# Icons

<!-- generated:import -->

```ts
import {
  AdjustmentsHorizontalIcon,
  AlertOctagonIcon,
  BookIcon,
  BooksIcon,
  CheckIcon,
  ChevronCircleIcon,
  ChevronIcon,
  CircleXIcon,
  ClockIcon,
  DeviceIcon,
  HandLoveYouIcon,
  HandOkIcon,
  HandPeaceIcon,
  HandsClapIcon,
  HomeIcon,
  InfoCircleIcon,
  KeyIcon,
  ListCheckIcon,
  MoreIcon,
  RowRemoveIcon,
  SearchIcon,
  SettingsIcon,
  SpinnerIcon,
  ThumbDownIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
  XIcon,
  defaultFilledIconProps,
  defaultStrokeIconProps,
  type IconProps,
} from '@korzun/design/icon';
```

<!-- /generated:import -->

Inline SVG icon components, mostly from [Tabler](https://tabler.io/icons) on a
24×24 view box. Each one paints in `currentColor`, so it takes the text colour
of wherever it sits, in both themes, including hover and selected states.

Use something else for: a determinate progress mark (`ProgressCircle`), a
loading state on a button (`Button`'s `loading`, which draws the spinner for
you).

## Usage

### Props

Every icon takes the same `IconProps`, listed below. `defaultStrokeIconProps`
and `defaultFilledIconProps` are exported for building your own icon with the
same defaults.

### Sizing and colour

- Size with `width`/`height` props (`<HomeIcon width={14} height={14} />`), or
  with `height: '1em', width: '1em'` in a class so it scales with the text (this
  is what `Button` does for `prefix`/`suffix`).
- Colour by setting `color` on the icon or any ancestor. Don't pass `stroke` or
  `fill` colours; they bypass the theme.

### Passing icons to other components

Components take the icon **component**, never an element:

```tsx
<Button prefix={SearchIcon}>Search</Button>                 // ComponentType<IconProps>
<ConfirmModal icon={AlertOctagonIcon} danger … />
const item: NavItem = { to: '/', label: 'Home', Icon: HomeIcon, active };
options={[{ value: 'grid', label: 'Grid', Icon: BooksIcon }]} // SegmentedControl
```

### Kinds of icon

Every icon is listed in the table below, and the docs site also shows them as a grid. Each is one of three kinds.

- **Stroke** icons draw outlines and take `stroke` and `strokeWidth`.
- **Filled** icons (`AlertOctagonIcon`, `CheckIcon`, `CircleXIcon`,
  `InfoCircleIcon`) ignore `stroke` and `strokeWidth`.
- **Emoji** icons (`HandLoveYouIcon`, `HandOkIcon`, `HandPeaceIcon`,
  `HandsClapIcon`, `ThumbDownIcon`) draw the platform's colour-emoji glyph as an
  alpha mask over `currentColor`, so they recolour like the others but their
  exact shape depends on the OS emoji font. They ignore `fill`, `stroke` and
  `strokeWidth`.

Two to know: `ChevronIcon` points right, so rotate it via `className` for other
directions. `SpinnerIcon` is a quarter arc that **does not spin by itself**; use
`Spinner` (component) for a ready-made loader, not a hand-built `SpinnerIcon`:

```tsx
<Spinner label="Loading books" />
```

### Every icon

| Export | Kind | Depicts |
|---|---|---|
| `AdjustmentsHorizontalIcon` | stroke | Three horizontal sliders (general settings, filters). |
| `AlertOctagonIcon` | filled | Octagon with `!` (danger/warning; confirm modals). |
| `BookIcon` | stroke | A single book (Tabler `book-2`). |
| `BooksIcon` | stroke | Books standing on a shelf. |
| `CheckIcon` | filled | A check mark (success). |
| `ChevronCircleIcon` | stroke | Right chevron in a circle (Card's collapse toggle). |
| `ChevronIcon` | stroke | Right-pointing chevron; rotate it via `className` for other directions. |
| `CircleXIcon` | filled | X in a filled circle (clear, error). |
| `ClockIcon` | stroke | Clock face (time, pending). |
| `DeviceIcon` | stroke | A tablet / e-reader (Tabler `device-tablet`). |
| `HandLoveYouIcon` | emoji | 🤟 silhouette (rating 5, "Love"). |
| `HandOkIcon` | emoji | 👌 silhouette (rating 2, "Okay"). |
| `HandPeaceIcon` | emoji | ✌️ silhouette (rating 3, "Nice"). |
| `HandsClapIcon` | emoji | 👏 silhouette (rating 4, "Great"). |
| `HomeIcon` | stroke | A house. |
| `InfoCircleIcon` | filled | `i` in a filled circle (info). |
| `KeyIcon` | stroke | A key (passwords, credentials). |
| `ListCheckIcon` | stroke | Checklist (requests, tasks). |
| `MoreIcon` | stroke | Three horizontal dots (overflow menu). |
| `RowRemoveIcon` | stroke | A table row with an X under it (remove row). |
| `SearchIcon` | stroke | Magnifying glass. |
| `SettingsIcon` | stroke | Gear. |
| `SpinnerIcon` | stroke | A quarter arc. **Does not spin by itself**; use `Spinner` (component) for a ready-made loader. |
| `ThumbDownIcon` | emoji | 👎 silhouette (rating 1, "Bad"). |
| `UploadIcon` | stroke | Arrow up out of a tray. |
| `UserIcon` | stroke | One person. |
| `UsersIcon` | stroke | Two people. |
| `XIcon` | stroke | An X (close, dismiss, error toast). |

## Do / don't

- Do pass `aria-hidden` when the icon sits next to a text label.
- Do give a standalone meaningful icon `role` and `aria-label`.
- Don't pass `<Icon />` elements where a component is expected.
- Don't import from icon file paths; only `@korzun/design/icon` is exported.

<!-- generated:examples -->

## Examples

### Basic

An icon next to a text label is decorative, so it takes `aria-hidden`. A standalone icon that carries meaning takes `role="img"` and an `aria-label`. The button flips the state, and both icons follow it.

```tsx
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { AlertOctagonIcon, CheckIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Basic() {
  const [valid, setValid] = useState(true);
  const Icon = valid ? CheckIcon : AlertOctagonIcon;
  return (
    <Space direction="vertical" gap="md" align="start">
      <Text size="sm" tone="muted">
        Decorative, beside a label
      </Text>
      <Space gap="xs">
        <Icon width={15} height={15} aria-hidden />
        <Text>{valid ? 'Book is valid' : 'Book has problems'}</Text>
      </Space>
      <Text size="sm" tone="muted">
        Standalone, named for screen readers
      </Text>
      <Icon width={24} height={24} role="img" aria-label={valid ? 'Valid' : 'Has problems'} />
      <Space>
        <Button onClick={() => setValid(!valid)}>
          {valid ? 'Mark as broken' : 'Mark as valid'}
        </Button>
      </Space>
    </Space>
  );
}
```

### Size and colour

Size an icon with `width` and `height`, or give it `1em` in a class so it scales with the text around it. Colour comes from `color` on the icon or any ancestor; pass no `stroke` or `fill` colour.

```tsx
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { HomeIcon, SearchIcon, SettingsIcon } from '@korzun/design/icon';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  scaled: { height: '1em', width: '1em' },
  brand: { color: theme.color.brand.default },
  danger: { color: theme.color.danger.default },
}));

const sizes = [16, 24, 32] as const;

export default function SizeAndColour() {
  const styles = useStyle();
  const [danger, setDanger] = useState(false);
  return (
    <Space direction="vertical" gap="lg" align="start">
      <Space gap="lg">
        {sizes.map((size) => (
          <Space direction="vertical" key={size} gap="xs" align="center">
            <HomeIcon width={size} height={size} aria-hidden />
            <Text size="sm" tone="muted">
              {size}px
            </Text>
          </Space>
        ))}
      </Space>
      <Space gap="xs">
        <SearchIcon className={styles.scaled} aria-hidden />
        <Text size="lg">Scales with this text</Text>
      </Space>
      <Space gap="xs" className={danger ? styles.danger : styles.brand}>
        <SettingsIcon aria-hidden />
        <Text>{danger ? 'Colour set to danger' : 'Colour set to brand'}</Text>
      </Space>
      <Space>
        <Button onClick={() => setDanger(!danger)}>Switch colour</Button>
      </Space>
    </Space>
  );
}
```

### Stroke width and icon kinds

`strokeWidth` thickens a stroke icon. Filled icons such as `CheckIcon` and the emoji icons such as `HandOkIcon` ignore it. The button steps the width.

```tsx
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { CheckIcon, HandOkIcon, SearchIcon } from '@korzun/design/icon';
import { useState } from 'react';

const widths = [1, 2, 3] as const;

export default function Stroke() {
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  return (
    <Space direction="vertical" gap="lg" align="start">
      <Space gap="xl">
        <Space direction="vertical" gap="xs" align="center">
          <SearchIcon width={32} height={32} strokeWidth={strokeWidth} aria-hidden />
          <Text size="sm" tone="muted">
            Stroke
          </Text>
        </Space>
        <Space direction="vertical" gap="xs" align="center">
          <CheckIcon width={32} height={32} strokeWidth={strokeWidth} aria-hidden />
          <Text size="sm" tone="muted">
            Filled
          </Text>
        </Space>
        <Space direction="vertical" gap="xs" align="center">
          <HandOkIcon width={32} height={32} strokeWidth={strokeWidth} aria-hidden />
          <Text size="sm" tone="muted">
            Emoji
          </Text>
        </Space>
      </Space>
      <Space>
        {widths.map((width) => (
          <Button
            key={width}
            type={strokeWidth === width ? 'primary' : 'default'}
            onClick={() => setStrokeWidth(width)}
          >
            {`strokeWidth ${width}`}
          </Button>
        ))}
      </Space>
    </Space>
  );
}
```

### Passing icons to components

Components take the icon component, never an element: `prefix={SearchIcon}`, not `prefix={<SearchIcon />}`. A Button sizes the icon to its text itself.

```tsx
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ChevronIcon, SearchIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function InComponents() {
  const [searches, setSearches] = useState(0);
  const [pages, setPages] = useState(1);
  return (
    <Space direction="vertical" gap="md" align="start">
      <Space>
        <Button prefix={SearchIcon} onClick={() => setSearches((n) => n + 1)}>
          Search
        </Button>
        <Button suffix={ChevronIcon} onClick={() => setPages((n) => n + 1)}>
          Next page
        </Button>
      </Space>
      <Text tone="muted">
        Searches: {searches}, page {pages}
      </Text>
    </Space>
  );
}
```

<!-- /generated:examples -->

<!-- generated:props -->

## Props

Props shared by every icon component.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-hidden` | `boolean \| 'true' \| 'false'` |  | Pass it for a decorative icon next to a text label. It is not set unless you pass it. |
| `aria-label` | `string` |  | Accessible name for a meaningful standalone icon; pair it with `role="img"`. |
| `className` | `string` | `''` | Class on the `<svg>`, for size, colour (`color: …`) or animation. |
| `fill` | `string` |  | Unset, it follows the icon: unfilled for a stroke icon, the text colour for a filled one. Ignored by `SpinnerIcon` and the emoji icons. A colour passed here bypasses the theme. |
| `height` | `number` | `24` | Height in pixels. Set it together with `width`. A `className` with CSS `width` and `height` overrides both. |
| `role` | `string` |  | `'img'` for a meaningful standalone icon, `'status'` for a loading spinner. |
| `stroke` | `string` | `'currentColor'` | Stroke colour, for stroke icons only. A colour passed here bypasses the theme. |
| `strokeWidth` | `number` | `2` | Stroke width, for stroke icons only; filled and emoji icons ignore it. |
| `width` | `number` | `24` | Width in pixels. Set it together with `height`. A `className` with CSS `width` and `height` overrides both. |

<!-- /generated:props -->

<!-- generated:tokens -->

## Tokens

This module has no styles of its own.

<!-- /generated:tokens -->

<!-- generated:changelog -->

## Changelog

No changes yet.

<!-- /generated:changelog -->
