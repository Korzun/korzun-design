/** Collapsible
 * `isCollapsible` turns the header into a toggle. A collapsible card starts collapsed, so the first
 * one is closed; pass `defaultCollapsed={false}` to start open, as the second one does. The
 * footer's destructive action is only reachable while the card is open.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Collapsible() {
  const [removed, setRemoved] = useState<string | undefined>();
  return (
    <Space direction="vertical">
      <Card isCollapsible title="ada" subTitle="Starts collapsed">
        <Text>ada@example.com</Text>
      </Card>
      <Card
        isCollapsible
        defaultCollapsed={false}
        title="grace"
        subTitle="Starts open"
        footer={
          <Button type="link" danger onClick={() => setRemoved('grace')}>
            Delete user
          </Button>
        }
      >
        <Text>grace@example.com</Text>
      </Card>
      <Text tone="muted">Deleted: {removed ?? 'nobody'}</Text>
    </Space>
  );
}
