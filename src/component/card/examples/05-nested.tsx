/** Nested cards
 * A Card inside a Card steps its corner down one level: `lg` on the page, `md` inside a Card,
 * `sm` one level deeper. Each Card's Button follows the same depth, so pass no `radius`. Nest
 * for a group that is itself a feature; to split one body into sections use `CardDivider`.
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

export default function Nested() {
  return (
    <Card title="On the page (16px)" footer={<Button>Button in this card</Button>}>
      <Stack>
        <Text>This Card sits on the page.</Text>
        <Card title="In a Card (8px)" footer={<Button>Button in this card</Button>}>
          <Stack>
            <Text>This Card is one level in.</Text>
            <Card title="Two levels in (4px)">
              <Text>Deeper Cards stay at the smallest step.</Text>
            </Card>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
}
