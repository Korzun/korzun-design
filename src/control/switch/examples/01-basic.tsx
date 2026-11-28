/** Basic
 * A controlled switch with a visible `label`. `onChange` receives the new
 * value, not an event; Enter and Space toggle it from the keyboard.
 */
import { Space, Text } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [checked, setChecked] = useState(true);
  return (
    <Space direction="vertical">
      <Switch name="notifications" label="Notifications" checked={checked} onChange={setChecked} />
      <Text tone="muted">Notifications: {checked ? 'on' : 'off'}</Text>
    </Space>
  );
}
