/** In a Dialog
 * A Menu inside a Dialog opens into the dialog, so it shows above the dialog's
 * backdrop. Escape closes the menu first and the Dialog on the next press.
 */
import { Stack, Text } from '@korzun/design/component';
import { Button, Dialog, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function InDialog() {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Edit book">
        <Stack>
          <Menu
            trigger={(p) => <Button {...p}>Actions</Button>}
            items={[
              { label: 'Rename', onClick: () => setChosen('Rename') },
              { label: 'Duplicate', onClick: () => setChosen('Duplicate') },
              { label: 'Delete', danger: true, onClick: () => setChosen('Delete') },
            ]}
          />
          <Text tone="muted">Chosen: {chosen}</Text>
        </Stack>
      </Dialog>
    </>
  );
}
