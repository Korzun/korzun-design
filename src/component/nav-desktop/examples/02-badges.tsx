/** Badges
 * A positive `badge` number draws a red count on the icon's corner and `0` draws
 * nothing, so a count can be passed as it is. `'dot'` draws a red dot.
 */
import { Inline, NavDesktop, Stack, type NavItem } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { BookIcon, SettingsIcon, UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Badges() {
  const [pending, setPending] = useState(3);
  const items: NavItem[] = [
    { to: '/library', label: 'Library', Icon: BookIcon, active: true },
    { to: '/upload', label: 'Upload', Icon: UploadIcon, active: false, badge: pending },
    { to: '/settings', label: 'Settings', Icon: SettingsIcon, active: false, badge: 'dot' },
  ];
  return (
    <Stack>
      <NavDesktop items={items} />
      <Inline>
        <Button onClick={() => setPending((n) => n + 1)}>Add a fix</Button>
        <Button onClick={() => setPending(0)}>Clear fixes</Button>
      </Inline>
    </Stack>
  );
}
