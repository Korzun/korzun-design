/** On the page and in a Card
 * A row's corner follows where it sits: `lg` (16px) on the page, `md` (8px) inside a Card. The
 * content inside a row steps down one level too.
 */
import { Card, CardRow, Stack, Text } from '@korzun/design/component';

export default function Depth() {
  return (
    <Stack>
      <CardRow>
        <Text>On the page (16px)</Text>
      </CardRow>
      <Card title="Card">
        <CardRow>
          <Text>In a Card (8px)</Text>
        </CardRow>
      </Card>
    </Stack>
  );
}
