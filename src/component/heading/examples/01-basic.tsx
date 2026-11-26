/** Basic
 * A section title with its action on the right. `level` is the outline
 * position; `Inline` with `justify="between"` spreads the row.
 */
import { Heading, Inline, Stack, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [books, setBooks] = useState(3);
  return (
    <Stack gap="md">
      <Inline justify="between">
        <Heading level={2}>Library</Heading>
        <Button type="primary" onClick={() => setBooks((n) => n + 1)}>
          Add book
        </Button>
      </Inline>
      <Text as="p" size="sm" tone="muted">
        {books} books, updated yesterday
      </Text>
    </Stack>
  );
}
