/** A semantic list
 * `as="ul"` renders a list and resets its margin, padding and bullets. Make each
 * child an `li`; `<Stack as="li">` works.
 */
import { Stack, Text } from '@korzun/design/component';

const books = [
  { id: 1, title: 'Middlemarch', author: 'George Eliot' },
  { id: 2, title: 'Bleak House', author: 'Charles Dickens' },
  { id: 3, title: 'Persuasion', author: 'Jane Austen' },
];

export default function List() {
  return (
    <Stack as="ul" gap="sm">
      {books.map((book) => (
        <Stack as="li" key={book.id} gap="none">
          <Text weight="semibold">{book.title}</Text>
          <Text size="sm" tone="muted">
            {book.author}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
