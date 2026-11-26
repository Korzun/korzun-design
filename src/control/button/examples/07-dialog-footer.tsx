/** Confirm dialog footer
 * A `text` Cancel beside a `primary danger` action. `loading` shows the spinner
 * and blocks a second click while the deletion runs; `canDismiss={!deleting}`
 * keeps the dialog open until it finishes. Inside a Dialog the corners step down
 * by themselves: no `radius` prop.
 */
import { Button, Dialog } from '@korzun/design/control';
import { useState } from 'react';

export default function DialogFooter() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const close = () => {
    setDeleting(false);
    setOpen(false);
  };
  const confirm = () => {
    setDeleting(true);
    setTimeout(close, 1000);
  };
  return (
    <>
      <Button danger onClick={() => setOpen(true)}>
        Delete book
      </Button>
      <Dialog
        open={open}
        onClose={close}
        canDismiss={!deleting}
        title="Delete this book?"
        footer={
          <>
            <Button type="text" disabled={deleting} onClick={close}>
              Cancel
            </Button>
            <Button type="primary" danger loading={deleting} onClick={confirm}>
              Delete
            </Button>
          </>
        }
      >
        It is removed from every device. This cannot be undone.
      </Dialog>
    </>
  );
}
