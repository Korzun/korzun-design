/** Placeholder and key handling
 * `placeholder` shows while the field is empty. `onKeyDown` is passed through and,
 * unlike `onChange`, receives the event. `autoCapitalize="none"` keeps
 * mobile keyboards from capitalising the first letter.
 */
import { Space, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function PlaceholderAndKeys() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <Space direction="vertical">
      <TextInput
        name="username"
        layout="inline"
        label="Username"
        placeholder="Type, then press Enter"
        autoCapitalize="none"
        autoComplete="username"
        value={username}
        onChange={setUsername}
        onKeyDown={(event) => {
          if (event.key === 'Enter') setSubmitted(username ?? '');
        }}
      />
      <Text tone="muted">Submitted: {submitted === null ? 'nothing yet' : `“${submitted}”`}</Text>
    </Space>
  );
}
