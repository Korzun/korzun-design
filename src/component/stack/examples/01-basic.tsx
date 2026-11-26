/** Basic
 * A form's fields, spaced with no `gap` prop. Put the `<form>` around the
 * Stack; children stretch to the full width.
 */
import { Stack } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [title, setTitle] = useState<string | undefined>('Middlemarch');
  const [author, setAuthor] = useState<string | undefined>('George Eliot');
  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      <Stack>
        <TextInput name="title" label="Title" value={title} onChange={setTitle} />
        <TextInput name="author" label="Author" value={author} onChange={setAuthor} />
      </Stack>
    </form>
  );
}
