/** Document title
 * `documentTitle` sets the browser tab's title when the page renders and
 * whenever it changes. It is not restored on unmount, so omit it when the app
 * manages titles itself.
 */
import { Card, Page, Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function DocumentTitle() {
  const [title, setTitle] = useState<string | undefined>('Library');
  return (
    <Page documentTitle={title}>
      <Card title="Tab title">
        <Stack>
          <TextInput name="title" label="Title" value={title} onChange={setTitle} />
          <Text tone="muted">Tab title: {title}</Text>
        </Stack>
      </Card>
    </Page>
  );
}
