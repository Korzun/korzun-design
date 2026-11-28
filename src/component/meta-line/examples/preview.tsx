/** Preview */
import { MetaLine, Text } from '@korzun/design/component';

export default function Preview() {
  return (
    <Text as="div" tone="faint">
      <MetaLine items={['Frank Herbert', 'Dune #3', '42%']} />
    </Text>
  );
}
