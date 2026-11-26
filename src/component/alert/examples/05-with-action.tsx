/** With an action, inside a card
 * `action` holds the one recovery step, usually a Button, on the right; it wraps
 * under the text when narrow. Inside a Card the Alert's corners and its Button's
 * corners step down by themselves, so pass no `radius`.
 */
import { Alert, Card, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function WithAction() {
  const [overdue, setOverdue] = useState(true);
  return (
    <Card title="Kitchen frame">
      {overdue ? (
        <Alert
          tone="warning"
          title="Frame is overdue"
          action={<Button onClick={() => setOverdue(false)}>Retry</Button>}
        >
          No check-in for 2h 14m.
        </Alert>
      ) : (
        <Text tone="muted">Checked in just now.</Text>
      )}
    </Card>
  );
}
