/** Reporting an outcome
 * A form submitted from the Card footer reports its result with the function `useToast` returns. A failed save also puts the message in an `ErrorMessage` beside the field, so the toast is never the only copy of an error the user must fix.
 */
import { Card, ErrorMessage, Space } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { useToast } from '@korzun/design/toast';
import { useState } from 'react';

export default function FormOutcome() {
  const showToast = useToast();
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const save = () => {
    if (!valid || password.length < 8) {
      const message = 'Password must be at least 8 characters';
      setError(message);
      showToast(message, 'error');
      return;
    }
    setError(undefined);
    showToast('Password changed', 'success');
    setPassword('');
  };
  return (
    <Card
      title="Change password"
      footer={
        <Button type="primary" submit form="change-password">
          Save
        </Button>
      }
    >
      <form
        id="change-password"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <Space direction="vertical" gap="md">
          <TextInput
            name="password"
            label="New password"
            password
            value={password}
            onChange={(next) => setPassword(next ?? '')}
            onValidChange={(_name, ok) => setValid(ok)}
            validate={(next) => next.length >= 8}
          />
          <ErrorMessage>{error}</ErrorMessage>
        </Space>
      </form>
    </Card>
  );
}
