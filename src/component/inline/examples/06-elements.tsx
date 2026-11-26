/** Elements
 * `as="nav"` makes a row of links a navigation landmark. `as="ul"` renders a
 * list and resets its margin, padding and bullets: make each child an `li`.
 */
import { Inline, Stack, Text } from '@korzun/design/component';

export default function Elements() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          as="nav"
        </Text>
        <Inline as="nav" gap="xl">
          <a href="/books">Books</a>
          <a href="/authors">Authors</a>
        </Inline>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          as="ul"
        </Text>
        <Inline as="ul" gap="xl">
          <li>
            <Text>Middlemarch</Text>
          </li>
          <li>
            <Text>Bleak House</Text>
          </li>
          <li>
            <Text>Persuasion</Text>
          </li>
        </Inline>
      </Stack>
    </Stack>
  );
}
