/** Form in a card
 * A short note in the `horizontal` layout, and a long description that
 * grows as the user types, with its label above and a `maxLength` the server
 * enforces.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { Button, TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function FormInCard() {
  const [note, setNote] = useState<string | undefined>('Signed copy.');
  const [description, setDescription] = useState<string | undefined>(
    'A retired lighthouse keeper starts receiving letters from the sea.'
  );
  const [saved, setSaved] = useState(0);
  return (
    <Card
      title="Book details"
      footer={
        <Button type="primary" onClick={() => setSaved((n) => n + 1)}>
          Save
        </Button>
      }
    >
      <Space direction="vertical">
        <TextArea name="note" label="Note" value={note} onChange={setNote} />
        <TextArea
          name="description"
          layout="vertical"
          label="Description"
          autoResize
          maxLength={3000}
          value={description}
          onChange={setDescription}
        />
        <Text tone="muted">Saved {saved} times</Text>
      </Space>
    </Card>
  );
}
