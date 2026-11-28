/** Empty
 * With no rows the header stays and `empty` fills one full-width row. Without `empty` the table shows its header only.
 */
import { Table } from '@korzun/design/component';

type Book = { id: number; title: string; author: string };

export default function Empty() {
  return (
    <Table<Book>
      ariaLabel="Books"
      rowKey="id"
      rows={[]}
      empty="No books yet. Upload an EPUB to start your library."
      columns={[
        { key: 'title', title: 'Title' },
        { key: 'author', title: 'Author' },
      ]}
    />
  );
}
