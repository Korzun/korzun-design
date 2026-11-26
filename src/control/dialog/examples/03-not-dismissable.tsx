/** Not dismissable while busy
 * `canDismiss={!saving}` makes Escape and backdrop clicks do nothing while a request
 * runs. The switch holds the busy state on so you can try both; the footer buttons
 * are disabled or loading to match, so every way out is gated the same.
 */
import { Stack } from '@korzun/design/component';
import { Button, Dialog, Switch } from '@korzun/design/control';
import { useState } from 'react';

export default function NotDismissable() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open busy dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        canDismiss={!saving}
        title="Saving changes"
        footer={
          <>
            <Button type="text" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" loading={saving} onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <Stack>
          Escape and the backdrop are ignored while the request is in flight.
          <Switch name="saving" label="Request in flight" checked={saving} onChange={setSaving} />
        </Stack>
      </Dialog>
    </>
  );
}
