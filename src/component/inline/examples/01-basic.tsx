/** Basic
 * The spread row: a title on the left and its action on the right, with
 * `justify="between"`. Children are vertically centred.
 */
import { Heading, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [books, setBooks] = useState(3);
  return (
    <Stack gap="xs">
      <Inline justify="between">
        <Heading level={2}>Library</Heading>
        <Button type="primary" onClick={() => setBooks((n) => n + 1)}>
          Add book
        </Button>
      </Inline>
      <Text size="sm" tone="muted">
        Books: {books}
      </Text>
    </Stack>
  );
}
