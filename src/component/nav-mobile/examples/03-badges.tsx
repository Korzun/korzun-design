/** Badges
 * A tab's `badge` shows on its icon, and the `collapsed` item's `badge` shows
 * only while its side is a circle. An empty `items` makes a side a circle for
 * good.
 * @viewport mobile
 */
import { Card, Space, NavMobile, Page, Text, type NavItem } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { BookIcon, HomeIcon, ListCheckIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Badges() {
  const [pending, setPending] = useState(3);
  const items: NavItem[] = [
    { to: '/library', label: 'Library', Icon: BookIcon, active: true },
    { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false, badge: pending },
    { to: '/request', label: 'Request', Icon: ListCheckIcon, active: false, badge: 'dot' },
  ];
  return (
    <>
      <Page bottomNav>
        <Card title="Navigation">
          <Space direction="vertical">
            <Space>
              <Button onClick={() => setPending((n) => n + 1)}>Add a fix</Button>
              <Button onClick={() => setPending(0)}>Clear fixes</Button>
            </Space>
            <Text tone="muted">Pending fixes: {pending}</Text>
          </Space>
        </Card>
      </Page>
      <NavMobile
        main={{
          items,
          collapsed: { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false },
        }}
        settings={{
          items: [],
          collapsed: {
            to: '/settings',
            label: 'Settings',
            Icon: SettingsIcon,
            active: false,
            badge: 'dot',
          },
        }}
        expanded="main"
      />
    </>
  );
}
