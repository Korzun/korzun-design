/** Without a label
 * A textarea with no visible `label` takes `ariaLabel`, so assistive tech can
 * still name it.
 */
import { Space, Text } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

export default function WithoutLabel() {
  const [notes, setNotes] = useState<string | undefined>(undefined);
  return (
    <Space direction="vertical">
      <TextArea
        name="notes"
        layout="inline"
        ariaLabel="Reading notes"
        placeholder="Reading notes"
        value={notes}
        onChange={setNotes}
      />
      <Text tone="muted">Characters: {notes?.length ?? 0}</Text>
    </Space>
  );
}
