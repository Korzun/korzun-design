/** Minimal
 * `type="minimal"` drops the page's width, margin, padding, gap and header row,
 * for a sign-in or splash screen. You lay it out yourself.
 */
import { Inline, Page, Stack, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Minimal() {
  const [name, setName] = useState<string | undefined>('');
  const [signedIn, setSignedIn] = useState(false);
  return (
    <Page type="minimal">
      <Stack>
        <TextInput name="username" label="Username" value={name} onChange={setName} />
        <Inline>
          <Button type="primary" onClick={() => setSignedIn(true)}>
            Sign in
          </Button>
        </Inline>
        {signedIn && <Text tone="muted">Signed in as {name || 'nobody'}</Text>}
      </Stack>
    </Page>
  );
}
