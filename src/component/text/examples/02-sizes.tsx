/** Sizes
 * `size` takes a key of the theme's `fontSize` scale.
 */
import { Stack, Text } from '@korzun/design/component';

const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export default function Sizes() {
  return (
    <Stack gap="xs">
      {sizes.map((size) => (
        <Text key={size} as="div" size={size}>
          {`size="${size}"`}
        </Text>
      ))}
    </Stack>
  );
}
