/** Actions
 * `actions` puts controls on the line: use link Buttons, the line is one text line tall.
 * `actionsAlign` places them on the `left`, `center` or `right`. When it equals `align` the label
 * and the actions share one group, label first.
 */
import { Card, CardDivider, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Actions() {
  const [pending, setPending] = useState(['Middlemarch', 'Persuasion']);
  const [last, setLast] = useState('nothing yet');
  return (
    <Card title="Requests">
      <Stack>
        <CardDivider
          actions={
            <Button type="link" onClick={() => setPending([])}>
              Clear all
            </Button>
          }
        >
          Pending (actions right)
        </CardDivider>
        <Text>{pending.length > 0 ? pending.join(', ') : 'Nothing pending'}</Text>
        <CardDivider
          align="center"
          actionsAlign="left"
          actions={
            <Button type="link" onClick={() => setLast('Archive')}>
              Archive
            </Button>
          }
        >
          Label center, actions left
        </CardDivider>
        <CardDivider
          actionsAlign="center"
          actions={
            <Button type="link" onClick={() => setLast('Export')}>
              Export
            </Button>
          }
        >
          Label left, actions center
        </CardDivider>
        <CardDivider
          align="right"
          actionsAlign="right"
          actions={
            <Button type="link" onClick={() => setLast('Share')}>
              Share
            </Button>
          }
        >
          Same side, label first
        </CardDivider>
        <Text tone="muted">Last action: {last}</Text>
      </Stack>
    </Card>
  );
}
