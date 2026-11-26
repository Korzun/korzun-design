/** Stroke width and icon kinds
 * `strokeWidth` thickens a stroke icon. Filled icons such as `CheckIcon` and the emoji icons such as `HandOkIcon` ignore it. The button steps the width.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { CheckIcon, HandOkIcon, SearchIcon } from '@korzun/design/icon';
import { useState } from 'react';

const widths = [1, 2, 3] as const;

export default function Stroke() {
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  return (
    <Stack gap="lg" align="start">
      <Inline gap="xl">
        <Stack gap="xs" align="center">
          <SearchIcon width={32} height={32} strokeWidth={strokeWidth} aria-hidden />
          <Text size="sm" tone="muted">
            Stroke
          </Text>
        </Stack>
        <Stack gap="xs" align="center">
          <CheckIcon width={32} height={32} strokeWidth={strokeWidth} aria-hidden />
          <Text size="sm" tone="muted">
            Filled
          </Text>
        </Stack>
        <Stack gap="xs" align="center">
          <HandOkIcon width={32} height={32} strokeWidth={strokeWidth} aria-hidden />
          <Text size="sm" tone="muted">
            Emoji
          </Text>
        </Stack>
      </Inline>
      <Inline>
        {widths.map((width) => (
          <Button
            key={width}
            type={strokeWidth === width ? 'primary' : 'default'}
            onClick={() => setStrokeWidth(width)}
          >
            {`strokeWidth ${width}`}
          </Button>
        ))}
      </Inline>
    </Stack>
  );
}
