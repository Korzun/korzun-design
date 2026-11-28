/** Basic
 * A title, a body and a footer with a `text` Cancel and a `primary` Save. `open` is
 * controlled and `onClose` takes no arguments: it runs for Escape and a click on the
 * backdrop, and closes nothing by itself, so it sets `open` to `false`. This demo
 * starts open; Review fixes opens it again.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Modal } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [open, setOpen] = useState(true);
  const [saves, setSaves] = useState(0);
  const save = () => {
    setSaves((n) => n + 1);
    setOpen(false);
  };
  return (
    <Space direction="vertical" align="start">
      <Button onClick={() => setOpen(true)}>Review fixes</Button>
      <Text tone="muted">Saved: {saves}</Text>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Fixes waiting"
        footer={
          <>
            <Button type="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={save}>
              Save
            </Button>
          </>
        }
      >
        Three metadata fixes are waiting for review.
      </Modal>
    </Space>
  );
}
