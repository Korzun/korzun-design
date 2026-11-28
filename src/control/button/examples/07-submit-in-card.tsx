/** Submit button in a card footer
 * `submit` renders a native submit button; `form` points it at a form elsewhere
 * in the card. `onClick` is ignored on a submit button, so handle the form's
 * `action`. Inside a Card the corners step down by themselves: no `radius` prop.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function SubmitInCard() {
  const [name, setName] = useState<string | undefined>('Ada');
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <Card
      title="Profile"
      footer={
        <Button type="primary" submit form="profile-form">
          Save
        </Button>
      }
    >
      <form id="profile-form" action={(data) => setSaved(String(data.get('name') ?? ''))}>
        <Space direction="vertical">
          <TextInput name="name" label="Name" value={name} onChange={setName} />
          {saved !== null && <Text tone="success">Saved as {saved}</Text>}
        </Space>
      </form>
    </Card>
  );
}
