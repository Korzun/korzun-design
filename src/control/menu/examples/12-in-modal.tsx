/** In a Modal
 * A Menu inside a Modal opens into the dialog, so it shows above the dialog's
 * backdrop. Escape closes the menu first and the Modal on the next press.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Modal, Menu } from '@korzun/design/control';
import { useState } from 'react';

export default function InDialog() {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState('nothing yet');
  return (
    <Space direction="vertical" align="start">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Edit book">
        <Space direction="vertical" align="start">
          <Menu
            trigger={(p) => <Button {...p}>Actions</Button>}
            items={[
              { label: 'Rename', onClick: () => setChosen('Rename') },
              { label: 'Duplicate', onClick: () => setChosen('Duplicate') },
              { label: 'Delete', danger: true, onClick: () => setChosen('Delete') },
            ]}
          />
          <Text tone="muted">Chosen: {chosen}</Text>
        </Space>
      </Modal>
    </Space>
  );
}
