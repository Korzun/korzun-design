/** Clickable
 * `onClick` makes a tag a button: focusable, Enter and Space activate it, and hover deepens the tone. It receives no event. Here an author chip filters the list, and clearing the filter is an action, so it is a link `Button`.
 */
import { Inline, Stack, Tag, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
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
        <Button type="link" onClick={() => setAuthor(undefined)}>
          Clear
        </Button>
      </Inline>
      <Text tone="muted">Filter: {author ?? 'none'}</Text>
    </Stack>
  );
}
