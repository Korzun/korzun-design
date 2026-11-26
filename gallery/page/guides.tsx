import { Card, Heading, Page, Stack, Text } from '@korzun/design/component';
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
    gap: theme.space.xl,
  },
  // The overview's card link: the whole Card is the link.
  card: {
    display: 'block',
    height: '100%',
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: theme.radius.lg,
    '& > *': { height: '100%' },
    '&:hover > *': { borderColor: theme.color.border.hover },
    '&:focus-visible': {
      outline: `2px solid ${theme.color.border.focus}`,
      outlineOffset: 2,
    },
  },
}));

/** `#/guides`: a card per guide doc, linking to its page. */
export const GuidesPage = () => {
  const styles = useStyle();
  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle="Guides · @korzun/design">
        <Stack gap="xxxl">
          <Stack gap="sm">
            <Heading level={1}>Guides</Heading>
            <Text as="p" size="lg" tone="description">
              How the library is meant to be used: the rules behind the components, and the patterns
              screens are built from.
            </Text>
          </Stack>
          <div className={styles.grid}>
            {siteData.guides.map((guide) => (
              <Link key={guide.slug} to={`/guides/${guide.slug}`} className={styles.card}>
                <Card>
                  <Stack gap="xs">
                    <Heading level={2} size="md">
                      {guide.title}
                    </Heading>
                    <Text size="sm" tone="description">
                      <Markdown
                        source={guide.description}
                        from={guide.docPath}
                        inline
                        links={false}
                      />
                    </Text>
                  </Stack>
                </Card>
              </Link>
            ))}
          </div>
        </Stack>
      </Page>
    </div>
  );
};
