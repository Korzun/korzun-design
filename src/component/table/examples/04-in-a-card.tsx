/** In a card
 * A table inside a `Card` sits one level deeper than one on the page, so its corners are `md` (8px) instead of `lg` (16px).
 */
import { Card, Table } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', author: 'George Eliot' },
  { id: 2, title: 'Persuasion', author: 'Jane Austen' },
];

export default function InACard() {
  return (
    <Card title="Recently added">
      <Table
        ariaLabel="Recently added"
        rowKey="id"
        rows={books}
        columns={[
          { key: 'title', title: 'Title' },
          { key: 'author', title: 'Author' },
        ]}
      />
    </Card>
  );
}
