/** Labelled pairs
 * A card describing one record: `{ label, value }` items with no `separator` are spaced by gaps, each label faint and capitalized by CSS (“cover size” shows as “Cover Size”). A value can be any node, such as a `Tag`. A pair whose value is `undefined` is skipped, so “Last sync” appears only once there is one.
 */
import { Card, MetaLine, Tag, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function LabelledPairs() {
  const [lastSync, setLastSync] = useState<string | undefined>(undefined);
  return (
    <Card
      title="Kindle Scribe"
      headerAction={
        <Button type="link" onClick={() => setLastSync(lastSync ? undefined : '12 March 2026')}>
          {lastSync ? 'Forget sync' : 'Sync now'}
        </Button>
      }
    >
      <Text as="div" size="sm">
        <MetaLine
          items={[
            { label: 'slug', value: 'my-kindle' },
            { label: 'cover size', value: '1860×2480' },
            { label: 'last sync', value: lastSync },
            {
              label: 'status',
              value: (
                <Tag size="sm" tone="success">
                  Active
                </Tag>
              ),
            },
          ]}
        />
      </Text>
    </Card>
  );
}
