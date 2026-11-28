/** List
 * An indented list of titles in a sticky side column. Scroll the article and the section in
 * view turns blue, with a bar on its left; click a title to scroll to it. Level 2 and 3 items
 * indent under the one before.
 * @viewport screen
 */
import { Heading, Space, Text } from '@korzun/design/component';
import { Anchor, type AnchorItem } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  root: { padding: theme.space.xxxxl },
  article: {
    flex: 1,
    minWidth: 0,
    maxWidth: '36rem',
    // Room below the last section, so each section can scroll up to the top.
    paddingBottom: '50vh',
  },
  aside: { position: 'sticky', top: theme.space.xxxxl, flex: 'none' },
}));

const sections: (AnchorItem & { body: string[] })[] = [
  {
    id: 'adding',
    title: 'Adding books',
    body: [
      'Drop an EPUB on the library, or send it by email. Bookplate reads the title, author and cover from the file, and asks only when something is missing.',
      'A book you already have is matched by its identifier, so adding it twice keeps one copy and the newer file.',
    ],
  },
  {
    id: 'formats',
    title: 'Formats',
    level: 2,
    body: [
      'EPUB 2 and 3 open as they are. A PDF is kept as a file you can download, but it has no chapters to track.',
      'A file that fails validation is still added, with a note on its page saying what is wrong.',
    ],
  },
  {
    id: 'metadata',
    title: 'Fixing metadata',
    level: 2,
    body: [
      'Edit the title, series and subjects from the book page. Each change rewrites the file, so a reader that syncs the book later sees it too.',
      'Suggested fixes wait in a queue until you accept or dismiss them.',
    ],
  },
  {
    id: 'series',
    title: 'Series order',
    level: 3,
    body: [
      'A number after the series name sets the book’s place in it. Half numbers, such as 2.5, sit between two books.',
      'Books with no number sort after the numbered ones, by title.',
    ],
  },
  {
    id: 'reading',
    title: 'Reading',
    body: [
      'Open a book to read it in the browser, or send it to a reader. Progress is saved per chapter, on every device.',
      'Finishing the last chapter marks the book as read and asks for a rating.',
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing',
    body: [
      'Invite someone to your library and they see every book in it. They keep their own progress, ratings and requests.',
      'A shared library has one owner. Only the owner can delete books or replace their files.',
      'Removing someone takes the library away from them at once. Their progress stays, in case you invite them back.',
      'A request for a book you do not have shows on your requests page, with who asked and when.',
    ],
  },
];

export default function List() {
  const styles = useStyle();
  return (
    <Space align="start" gap="xxxxxl" className={styles.root}>
      <Space direction="vertical" gap="xxxxl" className={styles.article}>
        {sections.map(({ id, title, level = 1, body }) => (
          <Space key={id} direction="vertical" gap="md">
            <Heading level={(level + 1) as 2 | 3 | 4} id={id}>
              {title}
            </Heading>
            {body.map((paragraph) => (
              <Text as="p" key={paragraph}>
                {paragraph}
              </Text>
            ))}
          </Space>
        ))}
      </Space>
      <div className={styles.aside}>
        <Anchor items={sections} />
      </div>
    </Space>
  );
}
