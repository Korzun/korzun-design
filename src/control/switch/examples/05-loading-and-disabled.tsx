/** Loading and disabled
 * `loading` marks a save in flight: clicks are ignored and the thumb turns into
 * a loading mark after a short delay (a squared ring on the default `inset` radius,
 * a round spinner on `pill`), while the switch keeps its colour. `disabled`
 * fades the whole control and means "you may not change this". The button holds
 * the save open; the count shows that clicks during it do nothing.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function LoadingAndDisabled() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState(false);
  const [saving, setSaving] = useState(true);
  const [changes, setChanges] = useState(0);
  return (
    <Space direction="vertical">
      <Switch
        name="push-device"
        label="This device"
        checked={subscribed}
        loading={saving}
        onChange={(next) => {
          setSubscribed(next);
          setChanges((n) => n + 1);
        }}
      />
      <Switch
        name="push-device-pill"
        label="This device (pill)"
        radius="pill"
        checked={subscribed}
        loading={saving}
        onChange={setSubscribed}
      />
      <Space>
        <Button onClick={() => setSaving((s) => !s)}>
          {saving ? 'Finish save' : 'Start save'}
        </Button>
      </Space>
      <Text tone="muted">Changes made: {changes}</Text>
      <Switch
        name="push-email"
        label="Email (not available)"
        disabled
        checked={email}
        onChange={setEmail}
      />
    </Space>
  );
}
