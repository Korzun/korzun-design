/** Optional entries
 * Every entry renders, even one with no value, so build the array without the entries you do not have. Here “Last sync” is added only once there is a value.
 */
import { Inline, MetadataList, Stack } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function OptionalEntries() {
  const [lastSync, setLastSync] = useState<string | undefined>(undefined);
  return (
    <Stack gap="md">
      <Inline>
        <Button onClick={() => setLastSync(lastSync ? undefined : '12 March 2026')}>
          {lastSync ? 'Forget sync' : 'Sync now'}
        </Button>
      </Inline>
      <MetadataList
        metadata={[
          { title: 'Slug', value: 'my-kindle' },
          ...(lastSync ? [{ title: 'Last sync', value: lastSync }] : []),
        ]}
      />
    </Stack>
  );
}
