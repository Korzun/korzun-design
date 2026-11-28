/** Without a footer
 * With no `footer` no action bar is drawn. The dialog is dismissed with Escape or a
 * click on the backdrop, both of which call `onClose`.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Dialog } from '@korzun/design/control';
import { useState } from 'react';

export default function NoFooter() {
  const [open, setOpen] = useState(false);
  const [dismissals, setDismissals] = useState(0);
  const dismiss = () => {
    setDismissals((n) => n + 1);
    setOpen(false);
  };
  return (
    <Stack align="start">
      <Button onClick={() => setOpen(true)}>Show notice</Button>
      <Text tone="muted">Dismissed: {dismissals}</Text>
      <Dialog open={open} onClose={dismiss} title="Sync finished">
        Press Escape or click outside the dialog to close it.
      </Dialog>
    </Stack>
  );
}
