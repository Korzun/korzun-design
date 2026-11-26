/** In a dialog
 * The list opens inside the open dialog, so a `Select` works in a modal. Escape
 * closes the list first and a second Escape closes the dialog.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Dialog, Select } from '@korzun/design/control';
import { useState } from 'react';

const SHELVES = ['To read', 'Reading', 'Finished'];

export default function InDialog() {
  const [open, setOpen] = useState(false);
  const [shelf, setShelf] = useState<string | undefined>('To read');
  return (
    <Stack align="start">
      <Button onClick={() => setOpen(true)}>Move book</Button>
      <Text tone="muted">Shelf: {shelf ?? 'none'}</Text>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Move to shelf"
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <Select name="shelf" label="Shelf" value={shelf} options={SHELVES} onChange={setShelf} />
      </Dialog>
    </Stack>
  );
}
