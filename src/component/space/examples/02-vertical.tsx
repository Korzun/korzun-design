/** Vertical
 * `direction="vertical"` stacks children in a column. The gap defaults to
 * `md` and children stretch to the full width; put the `<form>` around the
 * Space.
 */
import { Space } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Vertical() {
  const [title, setTitle] = useState<string | undefined>('Middlemarch');
  const [author, setAuthor] = useState<string | undefined>('George Eliot');
  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <Space direction="vertical">
        <TextInput name="title" label="Title" value={title} onChange={setTitle} />
        <TextInput name="author" label="Author" value={author} onChange={setAuthor} />
      </Space>
    </form>
  );
}
