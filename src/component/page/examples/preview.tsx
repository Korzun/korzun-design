/** Preview */
import { Card, Page, Text } from '@korzun/design/component';

export default function Preview() {
  return (
    <Page>
      <Card title="Device password" />
      <Card title="Change password">
        <Text>Choose a new password.</Text>
      </Card>
    </Page>
  );
}
