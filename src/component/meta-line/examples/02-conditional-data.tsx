/** Conditional data
 * Pass optional data as `cond && value`: `false` is skipped and leaves no separator. When every item is skipped nothing renders, so the line leaves no gap behind.
 */
import { Space, MetaLine, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function ConditionalData() {
  const [hasSeries, setHasSeries] = useState(true);
  const [hasProgress, setHasProgress] = useState(true);
  return (
    <Space direction="vertical" gap="md">
      <Space>
        <Button onClick={() => setHasSeries((on) => !on)}>
          {hasSeries ? 'Remove series' : 'Add series'}
        </Button>
        <Button onClick={() => setHasProgress((on) => !on)}>
          {hasProgress ? 'Remove progress' : 'Add progress'}
        </Button>
      </Space>
      <Space direction="vertical" gap="xs">
        <Text weight="semibold">Dune Messiah</Text>
        <Text as="div" size="sm" tone="faint">
          <MetaLine separator="·" items={[hasSeries && 'Dune #2', hasProgress && '42%']} />
        </Text>
      </Space>
    </Space>
  );
}
