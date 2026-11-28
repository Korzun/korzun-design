/** Layouts
 * `horizontal` puts the label and field on one shaded row, `vertical` stacks
 * the label above the field on that row, and `inline` paints nothing around the
 * pair.
 */
import { Space, Text } from '@korzun/design/component';
import { NumberInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<number | undefined>(412);
  const [vertical, setVertical] = useState<number | undefined>(880);
  const [inline, setInline] = useState<number | undefined>(160);
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <NumberInput
          name="horizontal"
          layout="horizontal"
          label="Pages"
          value={horizontal}
          onChange={setHorizontal}
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="vertical"
        </Text>
        <NumberInput
          name="vertical"
          layout="vertical"
          label="Pages"
          value={vertical}
          onChange={setVertical}
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="inline"
        </Text>
        <NumberInput
          name="inline"
          layout="inline"
          label="Pages"
          value={inline}
          onChange={setInline}
        />
      </Space>
    </Space>
  );
}
