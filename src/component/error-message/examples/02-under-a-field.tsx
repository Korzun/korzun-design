/** Under a field
 * Space it from the field above with `Space` `gap`; it has no margin. The
 * message shows while the title is empty and goes away once one is typed.
 */
import { Card, ErrorMessage, Space } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function UnderAField() {
  const [title, setTitle] = useState<string | undefined>(undefined);
  return (
    <Card title="New book">
      <Space direction="vertical" gap="sm">
        <TextInput name="title" label="Title" value={title} onChange={setTitle} />
        <ErrorMessage>{title ? undefined : 'Title is required.'}</ErrorMessage>
      </Space>
    </Card>
  );
}
