/** In a dialog
 * The suggestion list opens inside an open `Modal` that contains the field,
 * so it works in a modal.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, ChipsInput, Modal } from '@korzun/design/control';
import { useState } from 'react';

const SUBJECTS = ['Astronomy', 'Biology', 'Cooking', 'History', 'Poetry', 'Travel'];

export default function InDialog() {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  return (
    <Space direction="vertical" align="start">
      <Button onClick={() => setOpen(true)}>Edit subjects</Button>
      <Text tone="muted">Subjects: {subjects.join(', ') || 'none'}</Text>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit subjects"
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <ChipsInput
          value={subjects}
          suggestions={SUBJECTS}
          onChange={setSubjects}
          placeholder="Add subject…"
        />
      </Modal>
    </Space>
  );
}
