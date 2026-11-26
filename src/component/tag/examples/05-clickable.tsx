/** Clickable
 * `onClick` makes a tag a button: focusable, Enter and Space activate it, and hover deepens the tone. It receives no event. Here an author chip filters the list.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';
import { useState } from 'react';

const authors = ['George Eliot', 'Terry Pratchett', 'Ursula K. Le Guin'];

export default function Clickable() {
  const [author, setAuthor] = useState<string | undefined>(undefined);
  return (
    <Stack gap="sm" align="start">
      <Inline wrap>
        {authors.map((name) => (
          <Tag key={name} tone="author" onClick={() => setAuthor(name)}>
            {name}
          </Tag>
        ))}
        <Tag tone="neutral" onClick={() => setAuthor(undefined)}>
          Clear
        </Tag>
      </Inline>
      <Text tone="muted">Filter: {author ?? 'none'}</Text>
    </Stack>
  );
}
