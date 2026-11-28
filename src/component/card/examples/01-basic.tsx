/** Basic
 * A feature on a screen: `title`, a `subTitle`, a `headerAction`, a form in the body and its
 * submit button in the `footer`. The footer button reaches the form by `form` id, so it submits it.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [name, setName] = useState<string | undefined>('Kitchen frame');
  const [saved, setSaved] = useState('Kitchen frame');
  return (
    <Card
      title="Device name"
      subTitle="Shown on the frame"
      headerAction={
        <Button type="link" onClick={() => setName('Kitchen frame')}>
          Reset
        </Button>
      }
      footer={
        <Button type="primary" submit form="device-name">
          Save
        </Button>
      }
    >
      <form
        id="device-name"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(name ?? '');
        }}
      >
        <Space direction="vertical">
          <TextInput name="name" label="Name" value={name} onChange={setName} />
          <Text tone="muted">Saved name: {saved}</Text>
        </Space>
      </form>
    </Card>
  );
}
