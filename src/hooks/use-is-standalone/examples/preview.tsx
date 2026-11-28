/** Preview */
import { Card, Text } from '@korzun/design/component';
import { useIsStandalone } from '@korzun/design/hooks';

export default function Preview() {
  const standalone = useIsStandalone();
  return (
    <Card title="Installed app">
      <Text>
        <code>useIsStandalone()</code> is {String(standalone)}
      </Text>
    </Card>
  );
}
