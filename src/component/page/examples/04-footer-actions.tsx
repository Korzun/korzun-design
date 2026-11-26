/** Footer actions
 * `footerActions` renders a `PageFooterActions` row after the children. It is
 * not sticky: it sits below the last card. Cancel and Save here, with Delete on
 * the leading side.
 */
import { Card, Page, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function FooterActions() {
  const [last, setLast] = useState('nothing yet');
  return (
    <Page
      footerActions={[
        { label: 'Delete', onClick: () => setLast('Delete'), danger: true, align: 'leading' },
        { label: 'Cancel', onClick: () => setLast('Cancel') },
        { label: 'Save', onClick: () => setLast('Save'), emphasis: true },
      ]}
    >
      <Card title="Details">
        <Text>Last pressed: {last}</Text>
      </Card>
    </Page>
  );
}
