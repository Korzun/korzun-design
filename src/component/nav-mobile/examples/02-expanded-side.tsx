/** Expanded side
 * `expanded` picks the side that is a capsule; the other side becomes a circle
 * linking to its `collapsed` destination. In an app you derive it from the route,
 * here the buttons stand in for it.
 * @viewport mobile
 */
import { Card, Space, NavMobile, Page, Text, type NavItem } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import {
  AdjustmentsHorizontalIcon,
  BookIcon,
  HomeIcon,
  ListCheckIcon,
  SettingsIcon,
  UploadIcon,
  UsersIcon,
} from '@korzun/design/icon';
import { useState } from 'react';

const main: NavItem[] = [
  { to: '/library', label: 'Library', Icon: BookIcon, active: true },
  { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false },
  { to: '/request', label: 'Request', Icon: ListCheckIcon, active: false },
];
const admin: NavItem[] = [
  { to: '/general', label: 'General', Icon: AdjustmentsHorizontalIcon, active: true },
  { to: '/users', label: 'Users', Icon: UsersIcon, active: false },
];

export default function ExpandedSide() {
  const [expanded, setExpanded] = useState<'main' | 'settings'>('main');
  return (
    <>
      <Page bottomNav>
        <Card title="Navigation">
          <Space direction="vertical">
            <Space>
              <Button onClick={() => setExpanded('main')}>Main</Button>
              <Button onClick={() => setExpanded('settings')}>Settings</Button>
            </Space>
            <Text tone="muted">Expanded: {expanded}</Text>
          </Space>
        </Card>
      </Page>
      <NavMobile
        main={{
          items: main,
          collapsed: { to: '/library', label: 'Back to library', Icon: HomeIcon, active: false },
        }}
        settings={{
          items: admin,
          collapsed: { to: '/general', label: 'Settings', Icon: SettingsIcon, active: false },
        }}
        expanded={expanded}
      />
    </>
  );
}
