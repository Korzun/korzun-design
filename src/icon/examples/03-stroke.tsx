/** Stroke width and icon kinds
 * `strokeWidth` thickens a stroke icon. Filled icons such as `CheckIcon` and the emoji icons such as `HandOkIcon` ignore it. The button steps the width.
 */
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
