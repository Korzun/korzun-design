/** Reporting an outcome
 * A component reports the result of a mutation with the function `useToast` returns. The field also turns red while the password is too short, so the toast is never the only copy of an error the user must fix.
 */
import { Card, Inline, Stack } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useToast } from '@korzun/design/toast';
import { useState } from 'react';

export default function FormOutcome() {
  const showToast = useToast();
  const [password, setPassword] = useState('');
  const save = () => {
    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    showToast('Password changed', 'success');
    setPassword('');
  };
  return (
    <Card title="Change password">
      <Stack gap="md">
        <TextInput
          name="password"
          label="New password"
          password
          value={password}
          onChange={(next) => setPassword(next ?? '')}
          validate={(next) => next.length === 0 || next.length >= 8}
        />
        <Inline>
          <Button type="primary" onClick={save}>
            Save
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
}
