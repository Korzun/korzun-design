/** Basic
 * A book row's secondary line: author, series and progress, separated by middots. Wrap it in `Text` to set the size and tone the items inherit.
 */
import { MetaLine, Stack, Text } from '@korzun/design/component';

export default function Basic() {
  return (
    <Stack gap="xs">
      <Text weight="semibold">Children of Dune</Text>
      <Text as="div" size="sm" tone="faint">
        <MetaLine items={['Frank Herbert', 'Dune #3', '42%']} />
      </Text>
    </Stack>
  );
}
