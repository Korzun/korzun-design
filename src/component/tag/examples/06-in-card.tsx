/** In a card
 * Compact `sm` chips in rows inside a `Card`. A kind of thing keeps its own tone; a state with no meaning to signal is `neutral`.
 */
import { Card, Inline, Stack, Tag, Text } from '@korzun/design/component';

export default function InCard() {
  return (
    <Card title="Metadata fixes">
      <Stack gap="sm">
        <Inline wrap gap="xs">
          <Text>Middlemarch</Text>
          <Tag size="sm" tone="author">
            George Eliot
          </Tag>
          <Tag size="sm">Fiction</Tag>
          <Tag size="sm">Classic</Tag>
        </Inline>
        <Inline gap="xs">
          <Text>Access</Text>
          <Tag size="sm" tone="neutral">
            Read only
          </Tag>
        </Inline>
      </Stack>
    </Card>
  );
}
