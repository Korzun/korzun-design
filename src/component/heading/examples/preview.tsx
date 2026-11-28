/** Preview */
import { Heading, Space } from '@korzun/design/component';

export default function Preview() {
  return (
    <Space direction="vertical" gap="sm">
      <Heading level={1}>Library</Heading>
      <Heading level={2}>Middlemarch</Heading>
      <Heading level={3}>Chapter one</Heading>
    </Space>
  );
}
