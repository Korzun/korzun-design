/** Labelled
 * A label names the section below the line. `align` places it: `left` and `right` hug that edge
 * with a short stub of line past it, `center` leaves equal line on both sides.
 */
import { Card, Divider, Stack, Text } from '@korzun/design/component';

export default function Labelled() {
  return (
    <Card title="Notifications">
      <Stack>
        <Text>Email me when a book is ready.</Text>
        <Divider>Devices (left)</Divider>
        <Text>Kitchen frame, Hallway frame</Text>
        <Divider align="center">Validation (center)</Divider>
        <Text>Check files for errors on upload.</Text>
        <Divider align="right">History (right)</Divider>
        <Text>Keep notifications for 30 days.</Text>
      </Stack>
    </Card>
  );
}
