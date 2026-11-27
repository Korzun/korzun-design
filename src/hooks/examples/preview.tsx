/** Preview */
import { Card, Text } from '@korzun/design/component';
import { isStandalone } from '@korzun/design/hooks';

export default function Preview() {
  return (
    <Card title="Installed app">
      <Text>
        <code>isStandalone()</code> is {String(isStandalone())}
      </Text>
    </Card>
  );
}
