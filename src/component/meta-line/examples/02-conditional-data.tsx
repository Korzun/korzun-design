/** Conditional data
 * Pass optional data as `cond && value`: `false` is skipped and leaves no separator. When every item is skipped nothing renders, so the line leaves no gap behind.
 */
import { Inline, MetaLine, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function ConditionalData() {
  const [hasSeries, setHasSeries] = useState(true);
  const [hasProgress, setHasProgress] = useState(true);
  return (
    <Stack gap="md">
      <Inline>
        <Button onClick={() => setHasSeries((on) => !on)}>
          {hasSeries ? 'Remove series' : 'Add series'}
        </Button>
        <Button onClick={() => setHasProgress((on) => !on)}>
          {hasProgress ? 'Remove progress' : 'Add progress'}
        </Button>
      </Inline>
      <Stack gap="xs">
        <Text weight="semibold">Dune Messiah</Text>
        <Text as="div" size="sm" tone="faint">
          <MetaLine items={[hasSeries && 'Dune #2', hasProgress && '42%']} />
        </Text>
      </Stack>
    </Stack>
  );
}
