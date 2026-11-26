/** Loading and disabled
 * `loading` marks a save in flight: clicks are ignored and the thumb turns into
 * a spinner after a short delay, while the switch keeps its colour. `disabled`
 * fades the whole control and means "you may not change this". The button holds
 * the save open; the count shows that clicks during it do nothing.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function LoadingAndDisabled() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState(false);
  const [saving, setSaving] = useState(true);
  const [changes, setChanges] = useState(0);
  return (
    <Stack>
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
      <Inline>
        <Button onClick={() => setSaving((s) => !s)}>
          {saving ? 'Finish save' : 'Start save'}
        </Button>
        <Text tone="muted">Changes made: {changes}</Text>
      </Inline>
      <Switch
        name="push-email"
        label="Email (not available)"
        disabled
        checked={email}
        onChange={setEmail}
      />
    </Stack>
  );
}
