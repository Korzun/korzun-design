/** Form row
 * Among other fields in a `Card`, set `layout="horizontal"` and `dense` so the
 * label shows and the height matches a `TextInput`. `allowCustom={false}`
 * restricts it to known users, `chipColor="user"` matches how users are tagged
 * elsewhere, and `placeholder` and `disabled` follow the loading state. `name`
 * is set on the text input only: form data gets the half-typed text, so submit
 * the chips from state.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { Button, ChipsInput, TextInput } from '@korzun/design/control';
import { useState } from 'react';

const USERS = ['Ada', 'Grace', 'Linus', 'Margaret'];

export default function FormRow() {
  const [title, setTitle] = useState<string | undefined>('Reading group');
  const [users, setUsers] = useState(['Ada']);
  const [loading, setLoading] = useState(true);
  return (
    <Card
      title="Share"
      footer={
        <Button type="text" onClick={() => setLoading((l) => !l)}>
          {loading ? 'Finish loading' : 'Reload users'}
        </Button>
      }
    >
      <Space direction="vertical">
        <ChipsInput
          name="users"
          label="Users"
          layout="horizontal"
          dense
          value={users}
          suggestions={USERS}
          onChange={setUsers}
          allowCustom={false}
          chipColor="user"
          disabled={loading}
          placeholder={loading ? 'Loading…' : 'Add users…'}
        />
        <TextInput
          name="title"
          label="Title"
          layout="horizontal"
          value={title}
          onChange={setTitle}
        />
        <Text tone="muted">Shared with: {users.join(', ') || 'nobody'}</Text>
      </Space>
    </Card>
  );
}
