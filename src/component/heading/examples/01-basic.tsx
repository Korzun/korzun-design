/** Basic
 * A section title with its action on the right. `level` is the outline
 * position; `Space` with `justify="between"` spreads the row.
 */
import { Heading, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [books, setBooks] = useState(3);
  return (
    <Space direction="vertical" gap="md">
      <Space justify="between">
        <Heading level={2}>Library</Heading>
        <Button type="primary" onClick={() => setBooks((n) => n + 1)}>
          Add book
        </Button>
      </Space>
      <Text as="p" size="sm" tone="muted">
        {books} books, updated yesterday
      </Text>
    </Space>
  );
}
