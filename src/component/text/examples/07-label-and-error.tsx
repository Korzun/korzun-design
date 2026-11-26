/** Label and error
 * `as="label"` with `htmlFor` names a native or third-party control. While the field is empty an
 * inline error shows: `as="div"` with `tone="danger"` and `aria-live="polite"`.
 */
import { Stack, Text } from '@korzun/design/component';
import { useState } from 'react';

export default function LabelAndError() {
  const [title, setTitle] = useState('');
  return (
    <Stack gap="xs">
      <Text as="label" htmlFor="book-title" size="sm" weight="medium">
        Title
      </Text>
      <input
        id="book-title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <Text as="div" size="sm" tone="danger" aria-live="polite">
        {title === '' ? 'Title is required.' : null}
      </Text>
    </Stack>
  );
}
