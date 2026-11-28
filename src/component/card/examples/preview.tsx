/** Preview */
import { Card, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

export default function Preview() {
  return (
    <Card
      title="Device name"
      subTitle="Shown on the frame"
      footer={<Button type="primary">Save</Button>}
    >
      <Text>Kitchen frame</Text>
    </Card>
  );
}
