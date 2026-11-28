/** Preview */
import { Table } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', author: 'George Eliot', year: 1871 },
  { id: 2, title: 'Persuasion', author: 'Jane Austen', year: 1817 },
  { id: 3, title: 'Villette', author: 'Charlotte Brontë', year: 1853 },
];

export default function Preview() {
  return (
    <div style={{ width: 320 }}>
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
    </div>
  );
}
