/** Weights
 * `weight` sets the font weight, whatever the level.
 */
import { Heading, Stack } from '@korzun/design/component';

const weights = ['regular', 'medium', 'semibold', 'bold', 'extrabold'] as const;

export default function Weights() {
  return (
    <Stack gap="sm">
      {weights.map((weight) => (
        <Heading key={weight} level={3} weight={weight}>
          {`weight="${weight}"`}
        </Heading>
      ))}
    </Stack>
  );
}
