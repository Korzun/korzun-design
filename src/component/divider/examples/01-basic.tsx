/** Basic
 * A plain rule between a form's fields and its submit button. Directly in a Card body it cancels
 * the body's padding, so the line meets the Card's borders.
 */
import { Card, Divider, Space, Text } from '@korzun/design/component';
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
        <Space direction="vertical">
          <TextInput name="title" label="Title" value={title} onChange={setTitle} />
          <Divider />
          <Space>
            <Button type="primary" submit>
              Request
            </Button>
          </Space>
          <Text tone="muted">Requested: {requested ?? 'nothing yet'}</Text>
        </Space>
      </form>
    </Card>
  );
}
