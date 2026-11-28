/** Actions
 * `actions` puts controls on the line: use link Buttons, the line is one text line tall.
 * `actionsAlign` places them on the `left`, `center` or `right`. When it equals `align` the label
 * and the actions share one group, label first. Each divider is captioned with its props.
 */
import { Card, Divider, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Actions() {
  const [pending, setPending] = useState(['Middlemarch', 'Persuasion']);
  const [last, setLast] = useState('nothing yet');
  return (
    <Card title="Requests">
      <Space direction="vertical" gap="xl">
        <Space direction="vertical" gap="xs">
          <Text size="sm" tone="muted">
            Unset: label left, actions right
          </Text>
          <Divider
            actions={
              <Button type="link" onClick={() => setPending([])}>
                Clear all
              </Button>
            }
          >
            Pending
          </Divider>
          <Text>{pending.length > 0 ? pending.join(', ') : 'Nothing pending'}</Text>
        </Space>
        <Space direction="vertical" gap="xs">
          <Text size="sm" tone="muted">
            {'align="center" actionsAlign="left"'}
          </Text>
          <Divider
            align="center"
            actionsAlign="left"
            actions={
              <Button type="link" onClick={() => setLast('Archive')}>
                Archive
              </Button>
            }
          >
            Finished
          </Divider>
        </Space>
        <Space direction="vertical" gap="xs">
          <Text size="sm" tone="muted">
            {'align="right" actionsAlign="right": one group, label first'}
          </Text>
          <Divider
            align="right"
            actionsAlign="right"
            actions={
              <Button type="link" onClick={() => setLast('Share')}>
                Share
              </Button>
            }
          >
            Shared
          </Divider>
        </Space>
        <Text tone="muted">Last action: {last}</Text>
      </Space>
    </Card>
  );
}
