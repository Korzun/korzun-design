/** Basic
 * A screen is a `Page` holding one `Card` per feature as direct children. The
 * header row stays reserved above the first card even with no actions, so every
 * page starts its content at the same height.
 */
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [loggedOut, setLoggedOut] = useState(false);
  return (
    <Page documentTitle="Settings">
      <Card title="Device password">
        <Text>Locks this device after five minutes away.</Text>
      </Card>
      <Card title="Change password">
        <Text>Choose a new password for your account.</Text>
      </Card>
      <Stack align="start">
        <Button danger onClick={() => setLoggedOut(true)}>
          Log out
        </Button>
        {loggedOut && <Text tone="muted">Logged out</Text>}
      </Stack>
    </Page>
  );
}
