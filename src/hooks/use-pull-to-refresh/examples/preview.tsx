/** Preview */
import { Card, Text } from '@korzun/design/component';
import { usePullToRefresh } from '@korzun/design/hooks';

export default function Preview() {
  const { phase } = usePullToRefresh(async () => {});
  return (
    <Card title="Pull to refresh">
      <Text>
        <code>phase</code> is {phase}
      </Text>
    </Card>
  );
}
