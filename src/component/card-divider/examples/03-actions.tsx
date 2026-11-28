/** Actions
 * `actions` puts controls on the line: use link Buttons, the line is one text line tall.
 * `actionsAlign` places them on the `left`, `center` or `right`. When it equals `align` the label
 * and the actions share one group, label first. Each divider is captioned with its props.
 */
import { Card, CardDivider, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Actions() {
  const [pending, setPending] = useState(['Middlemarch', 'Persuasion']);
  const [last, setLast] = useState('nothing yet');
  return (
    <Card title="Requests">
      <Stack gap="xl">
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            Unset: label left, actions right
          </Text>
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
        </Stack>
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            {'align="center" actionsAlign="left"'}
          </Text>
          <CardDivider
            align="center"
            actionsAlign="left"
            actions={
              <Button type="link" onClick={() => setLast('Archive')}>
                Archive
              </Button>
            }
          >
            Finished
          </CardDivider>
        </Stack>
        <Stack gap="xs">
          <Text size="sm" tone="muted">
            {'align="right" actionsAlign="right": one group, label first'}
          </Text>
          <CardDivider
            align="right"
            actionsAlign="right"
            actions={
              <Button type="link" onClick={() => setLast('Share')}>
                Share
              </Button>
            }
          >
            Shared
          </CardDivider>
        </Stack>
        <Text tone="muted">Last action: {last}</Text>
      </Stack>
    </Card>
  );
}
