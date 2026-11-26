/** Basic
 * A title, a body and a footer with a `text` Cancel and a `primary` Save. `open` is
 * controlled and `onClose` takes no arguments: it runs for Escape and a click on the
 * backdrop, and closes nothing by itself, so it sets `open` to `false`.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Dialog } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [open, setOpen] = useState(false);
  const [saves, setSaves] = useState(0);
  const save = () => {
    setSaves((n) => n + 1);
    setOpen(false);
  };
  return (
    <Stack>
      <Inline>
        <Button onClick={() => setOpen(true)}>Review fixes</Button>
        <Text tone="muted">Saved: {saves}</Text>
      </Inline>
      <Dialog
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
      </Dialog>
    </Stack>
  );
}
