/** Submit a form
 * The row sits below the cards, outside the `<form>`, so the submit item names
 * the form with `form`. `onClick` is required on every item but never called
 * for a submit one (pass an empty function): the form's `action` runs instead. `loading` follows the
 * pending save, and Save is disabled while a field is empty.
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { PageFooterActions, TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function SubmitAForm() {
  const [title, setTitle] = useState<string | undefined>('Dune');
  const [author, setAuthor] = useState<string | undefined>('Frank Herbert');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('Not saved');
  const hasInvalidFields = !title?.trim() || !author?.trim();
  return (
    <Stack>
      <form
        id="book-form"
        action={async (data) => {
          setSaving(true);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setSaving(false);
          setStatus(`Saved ${String(data.get('title'))}`);
        }}
      >
        <Stack>
          <Card title="Details">
            <TextInput name="title" label="Title" value={title} onChange={setTitle} />
          </Card>
          <Card title="Identifiers">
            <TextInput name="author" label="Author" value={author} onChange={setAuthor} />
          </Card>
        </Stack>
      </form>
      <PageFooterActions
        items={[
          { label: 'Cancel', onClick: () => setStatus('Cancelled'), disabled: saving },
          {
            label: saving ? 'Saving…' : 'Save',
            onClick: () => {},
            submit: true,
            form: 'book-form',
            emphasis: true,
            loading: saving,
            disabled: hasInvalidFields,
          },
        ]}
      />
      <Text tone="muted">{status}</Text>
    </Stack>
  );
}
