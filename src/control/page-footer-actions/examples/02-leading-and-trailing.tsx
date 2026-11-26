/** Leading and trailing
 * `align: 'leading'` puts an item on the left, so a destructive action sits
 * away from Save; `danger` gives it the red treatment.
 */
import { Stack, Text } from '@korzun/design/component';
import { PageFooterActions } from '@korzun/design/control';
import { useState } from 'react';

export default function LeadingAndTrailing() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Stack>
      <PageFooterActions
        items={[
          { label: 'Delete', onClick: () => setLast('Delete'), danger: true, align: 'leading' },
          { label: 'Cancel', onClick: () => setLast('Cancel') },
          { label: 'Save', onClick: () => setLast('Save'), emphasis: true },
        ]}
      />
      <Text tone="muted">Last pressed: {last}</Text>
    </Stack>
  );
}
