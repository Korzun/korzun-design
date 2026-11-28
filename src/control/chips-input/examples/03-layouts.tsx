/** Layouts
 * `block` is the bare box and shows no label, even when `label` is set.
 * `horizontal` and `vertical` add the label on a header row, like the other
 * fields in a form.
 */
import { Space, Text } from '@korzun/design/component';
import { ChipsInput } from '@korzun/design/control';
import { useState } from 'react';

const TAGS = ['Fiction', 'Memoir', 'Reference'];

export default function Layouts() {
  const [block, setBlock] = useState(['Fiction']);
  const [horizontal, setHorizontal] = useState(['Memoir']);
  const [vertical, setVertical] = useState(['Reference']);
  return (
    <Space direction="vertical" gap="xl">
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="block"
        </Text>
        <ChipsInput label="Tags" value={block} suggestions={TAGS} onChange={setBlock} />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="horizontal"
        </Text>
        <ChipsInput
          label="Tags"
          layout="horizontal"
          value={horizontal}
          suggestions={TAGS}
          onChange={setHorizontal}
        />
      </Space>
      <Space direction="vertical" gap="xs">
        <Text size="sm" tone="muted">
          layout="vertical"
        </Text>
        <ChipsInput
          label="Tags"
          layout="vertical"
          value={vertical}
          suggestions={TAGS}
          onChange={setVertical}
        />
      </Space>
    </Space>
  );
}
