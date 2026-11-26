/** Elements
 * `as="nav"` makes a row of links a navigation landmark. `as="ul"` renders a
 * list and resets its margin, padding and bullets: make each child an `li`. The links
 * take the brand colour from the theme.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyles = createUseStyles((theme: Theme) => ({
  link: {
    color: theme.color.brand.default,
    fontWeight: theme.fontWeight.medium,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    '&:hover': { color: theme.color.brand.linkHover, textDecoration: 'underline' },
  },
}));

export default function Elements() {
  const styles = useStyles();
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          as="nav"
        </Text>
        <Inline as="nav" gap="xl">
          <a className={styles.link} href="/books">
            Books
          </a>
          <a className={styles.link} href="/authors">
            Authors
          </a>
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
