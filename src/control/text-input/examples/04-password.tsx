/** Password
 * `password` renders `type="password"`; `autoComplete="new-password"` tells the
 * browser to offer a generated one rather than a saved one.
 */
import { Space, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Password() {
  const [password, setPassword] = useState('');
  return (
    <Space direction="vertical">
      <TextInput
        name="new-password"
        label="New"
        password
        autoComplete="new-password"
        value={password}
        onChange={(v) => setPassword(v ?? '')}
      />
      <Text tone="muted">Length: {password.length}</Text>
    </Space>
  );
}
