/** Outside a Card
 * Anywhere but directly in a Card or Modal body (on the page, in a CardRow, a hand-made
 * `Surface` box or a Popover) the line spans its container. In a Card body it reaches the
 * borders; `bleed={false}` keeps it inside the padding there.
 */
import { Card, CardRow, Divider, Stack, Text } from '@korzun/design/component';

export default function Anywhere() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          On the page: spans the column
        </Text>
        <Divider>Devices</Divider>
        <Text>Kitchen frame, Hallway frame</Text>
      </Stack>
      <Card title="Notifications">
        <Stack>
          <Text size="sm" tone="muted">
            In the Card body: meets the borders
          </Text>
          <Divider />
          <Text size="sm" tone="muted">
            {'bleed={false}: inside the padding'}
          </Text>
          <Divider bleed={false} />
          <CardRow>
            <Stack gap="xs">
              <Text size="sm" tone="muted">
                In a CardRow: spans the row
              </Text>
              <Divider />
              <Text>Keep notifications for 30 days.</Text>
            </Stack>
          </CardRow>
        </Stack>
      </Card>
    </Stack>
  );
}
