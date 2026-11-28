/** Preview */
import { Stack } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Preview() {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  return (
    <Stack align="start">
      <Switch
        name="notifications"
        label="Notifications"
        checked={notifications}
        onChange={setNotifications}
      />
      <Switch name="autoSync" label="Auto sync" checked={autoSync} onChange={setAutoSync} />
    </Stack>
  );
}
