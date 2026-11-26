/** Preview */
import { Card, CardDivider, Stack, Text } from '@korzun/design/component';

export default function Preview() {
  return (
    <Card title="Notifications">
      <Stack>
        <Text>Email me when a book is ready.</Text>
        <CardDivider />
        <Text>Keep notifications for 30 days.</Text>
      </Stack>
    </Card>
  );
}
