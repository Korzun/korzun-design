/** Form in a card
 * The `horizontal` layout is made for a `Card` body. Fields report their
 * validity through `onValidChange`, so Save stays disabled while any is
 * invalid.
 */
import { Card, Stack } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function FormInCard() {
  const [name, setName] = useState<string | undefined>('Ada Lovelace');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState<Record<string, boolean>>({});
  const invalid = Object.values(valid).some((ok) => !ok);
  return (
    <Card
      title="Account"
      footer={
        <Button type="primary" disabled={invalid}>
          Save
        </Button>
      }
    >
      <Stack>
        <TextInput
          name="name"
          label="Name"
          maxLength={64}
          validate={(v) => v.length <= 64 && v.trim().length > 0}
          onValidChange={(field, ok) => setValid((s) => ({ ...s, [field]: ok }))}
          value={name}
          onChange={setName}
        />
        <TextInput
          name="new-password"
          label="New"
          password
          autoComplete="new-password"
          value={password}
          onChange={(v) => setPassword(v ?? '')}
        />
      </Stack>
    </Card>
  );
}
