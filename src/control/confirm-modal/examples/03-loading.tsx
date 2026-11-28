/** Loading
 * `loading` puts a spinner on Confirm, disables both buttons and makes Escape and the
 * backdrop do nothing. The switch holds it on so you can try to dismiss the modal;
 * turn it off and Cancel, Escape and the backdrop work again.
 */
import { Stack } from '@korzun/design/component';
import { Button, ConfirmModal, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function Loading() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  return (
    <Stack align="start">
      <Button onClick={() => setIsOpen(true)}>Publish</Button>
      <ConfirmModal
        isOpen={isOpen}
        title="Publish changes?"
        confirmText="Publish"
        loading={loading}
        onCancel={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)}
      >
        <Stack>
          The request is in flight.
          <Switch name="loading" label="Loading" checked={loading} onChange={setLoading} />
        </Stack>
      </ConfirmModal>
    </Stack>
  );
}
