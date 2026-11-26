/** Labelled
 * A label names the section below the line. `align` places it: `left` and `right` hug that edge
 * with a short stub of line past it, `center` leaves equal line on both sides.
 */
import { Card, CardDivider, Stack, Text } from '@korzun/design/component';

export default function Labelled() {
  return (
    <Card title="Notifications">
      <Stack>
        <Text>Email me when a book is ready.</Text>
        <CardDivider>Devices (left)</CardDivider>
        <Text>Kitchen frame, Hallway frame</Text>
        <CardDivider align="center">Validation (center)</CardDivider>
        <Text>Check files for errors on upload.</Text>
        <CardDivider align="right">History (right)</CardDivider>
        <Text>Keep notifications for 30 days.</Text>
      </Stack>
    </Card>
  );
}
