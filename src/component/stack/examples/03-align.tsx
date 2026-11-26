/** Alignment
 * `align` sets the horizontal (cross-axis) placement. `stretch` makes every
 * child full width; use `start` so buttons and tags keep their own width.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const aligns = ['stretch', 'start', 'center', 'end'] as const;

export default function Align() {
  const [added, setAdded] = useState(0);
  return (
    <Stack gap="lg">
      {aligns.map((align) => (
        <Stack key={align} gap="xs" align={align}>
          <Text size="sm" tone="muted">
            {`align="${align}"`}
          </Text>
          <Button onClick={() => setAdded((n) => n + 1)}>Add a book</Button>
        </Stack>
      ))}
      <Text tone="muted">Books added: {added}</Text>
    </Stack>
  );
}
