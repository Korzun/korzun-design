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
        <CardDivider>align left</CardDivider>
        <Text>Devices</Text>
        <CardDivider align="center">align center</CardDivider>
        <Text>Validation</Text>
        <CardDivider align="right">align right</CardDivider>
        <Text>History</Text>
      </Stack>
    </Card>
  );
}
