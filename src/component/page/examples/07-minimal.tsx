/** Minimal
 * `type="minimal"` drops the page's width, margin, padding, gap and header row,
 * for a sign-in or splash screen. You lay it out yourself.
 */
import { Space, Page, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Minimal() {
  const [name, setName] = useState<string | undefined>('');
  const [signedIn, setSignedIn] = useState(false);
  return (
    <Page type="minimal">
      <Space direction="vertical">
        <TextInput name="username" label="Username" value={name} onChange={setName} />
        <Space>
          <Button type="primary" onClick={() => setSignedIn(true)}>
            Sign in
          </Button>
        </Space>
        {signedIn && <Text tone="muted">Signed in as {name || 'nobody'}</Text>}
      </Space>
    </Page>
  );
}
