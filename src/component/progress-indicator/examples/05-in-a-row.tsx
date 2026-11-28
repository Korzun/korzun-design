/** In a row
 * A small indicator beside a title in a list row. It prints its own label, so the row adds no "42%" next to it, and `ariaLabel` names the book.
 */
import { Card, Space, ProgressIndicator, Text } from '@korzun/design/component';

export default function InARow() {
  return (
    <Card title="Reading">
      <Space direction="vertical" gap="sm">
        <Space justify="between">
          <Text weight="semibold">Middlemarch</Text>
          <ProgressIndicator value={0.42} ariaLabel="Reading progress for Middlemarch" size={14} />
        </Space>
        <Space justify="between">
          <Text weight="semibold">Persuasion</Text>
          <ProgressIndicator value={1} ariaLabel="Reading progress for Persuasion" size={14} />
        </Space>
      </Space>
    </Card>
  );
}
