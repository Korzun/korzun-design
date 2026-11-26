/** Tones
 * `tone` sets the text colour. `danger` and `success` are for inline error
 * and confirmation text.
 */
import { Heading, Stack } from '@korzun/design/component';

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
    <Stack gap="sm">
      {tones.map((tone) => (
        <Heading key={tone} level={3} tone={tone}>
          {`tone="${tone}"`}
        </Heading>
      ))}
    </Stack>
  );
}
