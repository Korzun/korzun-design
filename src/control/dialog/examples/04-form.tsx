/** Form in a dialog
 * Controls in the body and a footer that saves. `Select` lists open inside the dialog
 * and Escape closes the list before the dialog. `canDismiss={!saving}` and a
 * `loading` Save keep it open until the request finishes.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { Button, Dialog, Select, TextInput } from '@korzun/design/control';
import { useState } from 'react';

const SHELVES = ['Reading', 'To read', 'Finished', 'Abandoned'];

export default function Form() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | undefined>('');
  const [shelf, setShelf] = useState<string | undefined>('Reading');
  const [saved, setSaved] = useState('nothing yet');
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved(`${shelf ?? 'no shelf'}, note “${note ?? ''}”`);
      setSaving(false);
      setOpen(false);
    }, 1000);
  };
  return (
    <Stack>
      <Inline>
        <Button onClick={() => setOpen(true)}>Edit book</Button>
        <Text tone="muted">Saved: {saved}</Text>
      </Inline>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        canDismiss={!saving}
        title="Edit book"
        footer={
          <>
            <Button type="text" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" loading={saving} onClick={save}>
              Save
            </Button>
          </>
        }
      >
        <Stack>
          <TextInput name="note" label="Note" layout="vertical" value={note} onChange={setNote} />
          <Select
            name="shelf"
            label="Shelf"
            layout="vertical"
            options={SHELVES}
            value={shelf}
            onChange={setShelf}
          />
        </Stack>
      </Dialog>
    </Stack>
  );
}
