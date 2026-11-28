/** Basic
 * Columns name a field of each row; `rowKey` names the field that identifies a row. Values show as text, and a missing one shows a dash.
 */
import { Table } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', author: 'George Eliot', year: 1871 },
  { id: 2, title: 'Persuasion', author: 'Jane Austen', year: 1817 },
  { id: 3, title: 'Villette', author: 'Charlotte Brontë', year: 1853 },
  { id: 4, title: 'Anonymous pamphlet', author: null, year: 1790 },
];

export default function Basic() {
  return (
    <Table
      ariaLabel="Books"
      rowKey="id"
      rows={books}
      columns={[
        { key: 'title', title: 'Title' },
        { key: 'author', title: 'Author' },
        { key: 'year', title: 'Year' },
      ]}
    />
  );
}
