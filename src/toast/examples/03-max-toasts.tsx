/** Limiting the stack
 * `maxToasts` caps how many toasts show at once: when a new one would exceed it, the oldest starts to leave. It goes on the app's one root `ToastProvider`; here the cap is two, so the third click pushes the first toast out.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ToastProvider, useToast } from '@korzun/design/toast';
import { useState } from 'react';

const Sender = () => {
  const showToast = useToast();
  const [sent, setSent] = useState(0);
  return (
    <Space direction="vertical" gap="md">
      <Space>
        <Button
          onClick={() => {
            showToast(`Message ${sent + 1} sent`, 'success');
            setSent(sent + 1);
          }}
        >
          Send message
        </Button>
      </Space>
      <Text tone="muted">Sent: {sent}</Text>
    </Space>
  );
};

export default function MaxToasts() {
  return (
    <ToastProvider maxToasts={2}>
      <Sender />
    </ToastProvider>
  );
}
