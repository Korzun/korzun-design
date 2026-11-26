/** In a card
 * A small, muted `h2` inside a `Card`: the level stays 2 for the outline,
 * `size`, `weight` and `tone` shrink the look.
 */
import { Card, Heading, Stack, Text } from '@korzun/design/component';

export default function InACard() {
  return (
    <Card>
      <Stack gap="xs">
        <Heading level={2} size="sm" weight="medium" tone="muted">
          Details
        </Heading>
        <Text>Middlemarch, George Eliot, 1871.</Text>
      </Stack>
    </Card>
  );
}
