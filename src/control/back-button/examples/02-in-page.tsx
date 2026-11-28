/** In a page
 * Usually you do not render it yourself: pass `back` to `Page`, which puts the
 * button in its sticky controls row on mobile, beside the page's actions menu
 * (`headerActions`).
 * @viewport mobile
 */
import { Card, Page, Space, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function InPage() {
  const [status, setStatus] = useState('Unread');
  return (
    <Page
      back="/library"
      headerActions={[
        { label: 'Mark as read', onClick: () => setStatus('Read'), primary: true },
        { label: 'Mark as unread', onClick: () => setStatus('Unread') },
      ]}
    >
      <Card title="Dune">
        <Space direction="vertical">
          <Text>Frank Herbert, 1965.</Text>
          <Text tone="muted">Status: {status}</Text>
        </Space>
      </Card>
    </Page>
  );
}
