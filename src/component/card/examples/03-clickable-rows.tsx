/** Clickable rows
 * `size="small"` with `onClick` makes a whole-card list row: 1px body padding and a pointer
 * cursor. Clicking anywhere on a row fires `onClick`.
 */
import { Card, Stack, Text } from '@korzun/design/component';
import { useState } from 'react';

const books = ['Middlemarch', 'Persuasion', 'Villette'];

export default function ClickableRows() {
  const [opened, setOpened] = useState<string | undefined>();
  return (
    <Stack>
      {books.map((book) => (
        <Card key={book} size="small" onClick={() => setOpened(book)}>
          <Text>{book}</Text>
        </Card>
      ))}
      <Text tone="muted">Opened: {opened ?? 'nothing yet'}</Text>
    </Stack>
  );
}
