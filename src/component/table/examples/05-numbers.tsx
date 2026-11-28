/** Numbers
 * `align: 'end'` right-aligns a numeric column, header included, so digits line up. `nowrap` keeps a value on one line.
 */
import { Table } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', pages: 880, chapters: 86 },
  { id: 2, title: 'Persuasion', pages: 249, chapters: 24 },
  { id: 3, title: 'Villette', pages: 560, chapters: 42 },
];

export default function Numbers() {
  return (
    <Table
      ariaLabel="Book lengths"
      rowKey="id"
      rows={books}
      columns={[
        { key: 'title', title: 'Title', wide: true },
        { key: 'pages', title: 'Pages', align: 'end', nowrap: true },
        { key: 'chapters', title: 'Chapters', align: 'end', nowrap: true },
      ]}
    />
  );
}
