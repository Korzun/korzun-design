/** Destructive confirmation
 * `danger` turns Confirm red and tints the `icon`, which takes a component
 * (`icon={AlertOctagonIcon}`), not an element. While the deletion runs, `loading`
 * puts a spinner on Confirm, disables both buttons and ignores Escape and the
 * backdrop. `onConfirm` closes the modal itself once the work is done.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, ConfirmModal } from '@korzun/design/control';
import { AlertOctagonIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Danger() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const remove = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleted((n) => n + 1);
      setDeleting(false);
      setIsOpen(false);
    }, 1000);
  };
  return (
    <Stack>
      <Inline>
        <Button danger onClick={() => setIsOpen(true)}>
          Delete
        </Button>
        <Text tone="muted">Books deleted: {deleted}</Text>
      </Inline>
      <ConfirmModal
        isOpen={isOpen}
        title="Delete book?"
        confirmText="Delete"
        danger
        icon={AlertOctagonIcon}
        loading={deleting}
        onCancel={() => setIsOpen(false)}
        onConfirm={remove}
      >
        This can’t be undone.
      </ConfirmModal>
    </Stack>
  );
}
