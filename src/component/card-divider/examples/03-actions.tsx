/** Actions
 * `actions` puts controls on the line, on the right by default: use link Buttons, the line is one
 * text line tall. `actionsAlign` moves them; when it equals `align` the label and the actions
 * share one group, label first.
 */
import { Card, CardDivider, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Actions() {
  const [pending, setPending] = useState(['Middlemarch', 'Persuasion']);
  const [archived, setArchived] = useState(0);
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
          Pending
        </CardDivider>
        <Text>{pending.length > 0 ? pending.join(', ') : 'Nothing pending'}</Text>
        <CardDivider
          align="right"
          actionsAlign="right"
          actions={
            <Button type="link" onClick={() => setArchived((n) => n + 1)}>
              Archive
            </Button>
          }
        >
          Same side, label first
        </CardDivider>
        <Text tone="muted">Archived: {archived}</Text>
      </Stack>
    </Card>
  );
}
