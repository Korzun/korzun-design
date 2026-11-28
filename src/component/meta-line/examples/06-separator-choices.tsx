/** Separator choices
 * `separator` takes any one character, drawn between items by CSS. Pairs take a separator too.
 */
import { MetaLine, Space, Text } from '@korzun/design/component';

const data = ['Frank Herbert', 'Dune #3', '42%'];

export default function SeparatorChoices() {
  return (
    <Text as="div" size="sm" tone="muted">
      <Space direction="vertical" gap="sm">
        <MetaLine separator="·" items={data} />
        <MetaLine separator="|" items={data} />
        <MetaLine separator="/" items={data} />
        <MetaLine
          separator="·"
          items={[
            { label: 'format', value: 'EPUB' },
            { label: 'size', value: '2.1 MB' },
          ]}
        />
      </Space>
    </Text>
  );
}
