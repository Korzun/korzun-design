/** Clickable rows
 * `size="small"` with `onClick` makes a whole-card list row: a pointer cursor and only 1px of body
 * padding, so the child supplies its own padding and corner. A `CardRow` inside is flush with the
 * card and concentric with it. Clicking anywhere on a row fires `onClick`.
 */
import { Card, CardRow, Space, Text } from '@korzun/design/component';
import { useState } from 'react';

const books = ['Middlemarch', 'Persuasion', 'Villette'];

export default function ClickableRows() {
  const [opened, setOpened] = useState<string | undefined>();
  return (
    <Space direction="vertical">
      {books.map((book) => (
        <Card key={book} size="small" onClick={() => setOpened(book)}>
          <CardRow>
            <Text>{book}</Text>
          </CardRow>
        </Card>
      ))}
      <Text tone="muted">Opened: {opened ?? 'nothing yet'}</Text>
    </Space>
  );
}
