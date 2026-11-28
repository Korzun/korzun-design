/** Preview */
import { Card, Text } from '@korzun/design/component';
import { useMinimizeOnScroll } from '@korzun/design/hooks';

export default function Preview() {
  const { minimized } = useMinimizeOnScroll({ resetKey: 'preview' });
  return (
    <Card title="Bottom bar">
      <Text>
        <code>minimized</code> is {String(minimized)}
      </Text>
    </Card>
  );
}
