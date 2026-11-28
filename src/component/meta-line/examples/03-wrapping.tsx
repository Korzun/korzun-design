/** Wrapping
 * When the line is too narrow it wraps between data, never inside one, and no separator is left at a line end or leading the next line.
 */
import { MetaLine, Text } from '@korzun/design/component';

export default function Wrapping() {
  return (
    <Text as="div" size="sm" tone="faint">
      <MetaLine
        separator="·"
        items={[
          'Frank Herbert',
          'Dune Chronicles #3',
          'Science fiction',
          'Hardcover, first edition',
          '612 pages',
          'Added 12 March 2026',
          'Last read on a Kindle Scribe',
          'Finished in 9 days',
          'Rated four stars',
          'Lent to a friend in April',
          'Recommended by the book club',
        ]}
      />
    </Text>
  );
}
