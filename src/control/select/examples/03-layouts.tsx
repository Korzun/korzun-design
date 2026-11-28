/** Layouts
 * `horizontal` puts the label and trigger in one card-header row, `vertical`
 * stacks the label above the trigger in that row, and `inline` is just the
 * trigger with the label beside it.
 */
import { Space, Text } from '@korzun/design/component';
import { Select } from '@korzun/design/control';
import { useState } from 'react';

const SIZES = ['Small', 'Medium', 'Large'];

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Small');
  const [vertical, setVertical] = useState<string | undefined>('Medium');
  const [inline, setInline] = useState<string | undefined>('Large');
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
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
      </Space>
      <Space direction="vertical" gap="xs">
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
      </Space>
      <Space direction="vertical" gap="xs">
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
      </Space>
    </Space>
  );
}
