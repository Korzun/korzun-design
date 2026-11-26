/** Weights
 * `weight` takes a key of the theme's `fontWeight` scale.
 */
import { Stack, Text } from '@korzun/design/component';

const weights = ['regular', 'medium', 'semibold', 'bold', 'extrabold'] as const;

export default function Weights() {
  return (
    <Stack gap="xs">
      {weights.map((weight) => (
        <Text key={weight} as="div" weight={weight}>
          {`weight="${weight}"`}
        </Text>
      ))}
    </Stack>
  );
}
