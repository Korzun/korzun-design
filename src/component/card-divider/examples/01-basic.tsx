/** Basic
 * A plain rule between a form's fields and its submit button. It is full-bleed: it cancels the
 * Card body's padding, so the line meets the Card's borders.
 */
import { Card, CardDivider, Inline, Stack, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [title, setTitle] = useState<string | undefined>('Middlemarch');
  const [requested, setRequested] = useState<string | undefined>();
  return (
    <Card title="New request">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setRequested(title);
        }}
      >
        <Stack>
          <TextInput name="title" label="Title" value={title} onChange={setTitle} />
          <CardDivider />
          <Inline>
            <Button type="primary" submit>
              Request
            </Button>
          </Inline>
          <Text tone="muted">Requested: {requested ?? 'nothing yet'}</Text>
        </Stack>
      </form>
    </Card>
  );
}
