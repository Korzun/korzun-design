/** Tones
 * `primary` to `description` step down in emphasis. `danger` and `success`
 * colour inline error and confirmation text.
 */
import { Stack, Text } from '@korzun/design/component';

const tones = [
  'primary',
  'secondary',
  'muted',
  'faint',
  'description',
  'danger',
  'success',
] as const;

export default function Tones() {
  return (
    <Stack gap="xs">
      {tones.map((tone) => (
        <Text key={tone} as="div" tone={tone}>
          {`tone="${tone}"`}
        </Text>
      ))}
    </Stack>
  );
}
