/** Layouts
 * `horizontal` puts the label and field on one shaded row, `vertical` stacks
 * the label above the field on that row, and `inline` paints nothing around the
 * pair.
 */
import { Space, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Layouts() {
  const [horizontal, setHorizontal] = useState<string | undefined>('Dune');
  const [vertical, setVertical] = useState<string | undefined>('Middlemarch');
  const [inline, setInline] = useState<string | undefined>('Emma');
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
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
      </Space>
      <Space direction="vertical" gap="xs">
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
      </Space>
      <Space direction="vertical" gap="xs">
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
      </Space>
    </Space>
  );
}
