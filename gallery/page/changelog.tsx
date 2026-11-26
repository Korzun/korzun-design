import { Heading, Inline, Page, Stack, Tag, Text } from '@korzun/design/component';
import * as hooks from '@korzun/design/hooks';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Link } from 'react-router';

import { siteData } from '../data.js';
import { siteColumn } from '../layout/column.js';
import { Markdown } from '../part/markdown.js';

const useStyle = createUseStyles((theme: Theme) => ({
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
  // No bullets: each entry opens with its row of tag chips, and a bullet beside
  // the chips left the text wrapping under it. A hairline separates entries.
  entries: { margin: 0, padding: 0, listStyle: 'none' },
  entry: {
    '& + &': {
      marginTop: theme.space.xl,
      paddingTop: theme.space.xl,
      borderTop: `1px solid ${theme.color.border.light}`,
    },
  },
  // inline-flex, so a linked chip sits on the same line as a plain one.
  chipLink: {
    display: 'inline-flex',
    textDecoration: 'none',
    // The focus ring follows the Tag inside, which is on the page (depth 0).
    borderRadius: theme.radius.lg,
    '&:focus-visible': { outline: `2px solid ${theme.color.border.focus}`, outlineOffset: 2 },
  },
}));

/** The site route a changelog tag names, or null when it has no page (`General`, a module not on the site yet). */
const tagRoute = (tag: string): string | null => {
  const mod = siteData.modules.find((m) => m.values.includes(tag));
  if (mod) return `/components/${mod.slug}`;
  if (tag in hooks && siteData.guides.some((g) => g.slug === 'hooks')) return '/guides/hooks';
  return null;
};

const TagChip = ({ tag }: { tag: string }) => {
  const styles = useStyle();
  const chip = (
    <Tag tone="neutral" size="sm">
      {tag}
    </Tag>
  );
  const to = tagRoute(tag);
  return to ? (
    <Link to={to} className={styles.chipLink}>
      {chip}
    </Link>
  ) : (
    chip
  );
};

/** `#/changelog`: every version of CHANGELOG.md, each line with its tags as chips. */
export const ChangelogPage = () => {
  const styles = useStyle();
  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle="Changelog · @korzun/design">
        <Stack gap="xxxxl">
          <Heading level={1}>Changelog</Heading>
          {siteData.changelog.map((release) => (
            <Stack as="section" gap="lg" key={release.version} aria-label={release.version}>
              <Inline gap="md" align="baseline">
                <Heading level={2}>{release.version}</Heading>
                <Text size="sm" tone="muted">
                  {release.date}
                </Text>
              </Inline>
              <ul className={styles.entries}>
                {release.entries.map((entry, i) => (
                  <li key={i} className={styles.entry}>
                    <Stack gap="xs">
                      <Inline gap="xs" wrap>
                        {entry.tags.map((tag) => (
                          <TagChip key={tag} tag={tag} />
                        ))}
                      </Inline>
                      <Markdown source={entry.text} from="CHANGELOG.md" />
                    </Stack>
                  </li>
                ))}
              </ul>
            </Stack>
          ))}
        </Stack>
      </Page>
    </div>
  );
};
