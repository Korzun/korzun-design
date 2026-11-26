/** Alignment
 * `align` sets the horizontal (cross-axis) placement. The default `stretch` makes
 * every child full width; use `start` so buttons and tags keep their own width.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

const aligns = ['stretch', 'start', 'center', 'end'] as const;

export default function Align() {
  return (
    <Stack gap="lg">
      {aligns.map((align) => (
        <Stack key={align} gap="xs" align={align}>
          <Text size="sm" tone="muted">
            align=&quot;{align}&quot;
          </Text>
          <Button>Add a book</Button>
        </Stack>
      ))}
    </Stack>
  );
}
