/** Preview */
import { MetaLine, Space, Text } from '@korzun/design/component';

export default function Preview() {
  return (
    <Space direction="vertical" gap="sm">
      <Text as="div" tone="faint">
        <MetaLine separator="·" items={['Frank Herbert', 'Dune #3', '42%']} />
      </Text>
      <Text as="div" size="sm">
        <MetaLine
          items={[
            { label: 'format', value: 'EPUB' },
            { label: 'size', value: '2.1 MB' },
          ]}
        />
      </Text>
    </Space>
  );
}
