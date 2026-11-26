/** Basic
 * Cancel and Save on the trailing side. Give exactly one item `emphasis` so
 * the main action reads as primary. `onClick` takes no arguments.
 */
import { Stack, Text } from '@korzun/design/component';
import { PageFooterActions } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Stack>
      <PageFooterActions
        items={[
          { label: 'Cancel', onClick: () => setLast('Cancel') },
          { label: 'Save', onClick: () => setLast('Save'), emphasis: true },
        ]}
      />
      <Text tone="muted">Last pressed: {last}</Text>
    </Stack>
  );
}
