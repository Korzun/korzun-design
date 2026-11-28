/** Custom cells
 * `render` draws a cell from its row. A `Tag` shows a status, and a link `Button` in a cell sits one surface level deeper than the table, so its corners step down.
 */
import { Table, Tag } from '@korzun/design/component';
import { Button } from '@korzun/design/control';

type Book = { id: number; title: string; status: 'reading' | 'finished' | 'unread' };

const books: Book[] = [
  { id: 1, title: 'Middlemarch', status: 'reading' },
  { id: 2, title: 'Persuasion', status: 'finished' },
  { id: 3, title: 'Villette', status: 'unread' },
];

export default function CustomCells() {
  return (
    <Table<Book>
      ariaLabel="Reading list"
      rowKey="id"
      rows={books}
      columns={[
        { key: 'title', title: 'Title', wide: true },
        {
          key: 'status',
          title: 'Status',
          render: (book) => (
            <Tag tone={book.status === 'finished' ? 'success' : 'neutral'} size="sm">
              {book.status}
            </Tag>
          ),
        },
        {
          key: 'open',
          title: 'Open',
          label: false,
          render: (book) => (
            <Button type="link" onClick={() => undefined}>
              {`Open ${book.title}`}
            </Button>
          ),
        },
      ]}
    />
  );
}
