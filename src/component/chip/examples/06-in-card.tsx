/** In a card
 * Compact `sm` chips in rows inside a `Card`. A kind of thing keeps its own tone; a state with no meaning to signal is `neutral`.
 */
import { Card, Space, Chip, Text } from '@korzun/design/component';

export default function InCard() {
  return (
    <Card title="Metadata fixes">
      <Space direction="vertical" gap="sm">
        <Space wrap gap="xs">
          <Text>Middlemarch</Text>
          <Chip size="sm" tone="author">
            George Eliot
          </Chip>
          <Chip size="sm">Fiction</Chip>
          <Chip size="sm">Classic</Chip>
        </Space>
        <Space gap="xs">
          <Text>Access</Text>
          <Chip size="sm" tone="neutral">
            Read only
          </Chip>
        </Space>
      </Space>
    </Card>
  );
}
