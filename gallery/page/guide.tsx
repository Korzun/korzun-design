import { Heading, Page, Stack, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useParams } from 'react-router';

import { siteData } from '../data.js';
import { siteColumn } from '../layout/column.js';
import { NotFound } from '../not-found.js';
import { Markdown } from '../part/markdown.js';

const useStyle = createUseStyles((theme: Theme) => ({
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
}));

/** `#/guides/<slug>`: a guide doc (front matter `category: Guide`) rendered as a page. */
export const GuidePage = () => {
  const styles = useStyle();
  const { slug } = useParams();
  const guide = siteData.guides.find((g) => g.slug === slug);
  if (!guide) return <NotFound />;
  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle={`${guide.title} · @korzun/design`}>
        <Stack gap="xxxl">
          <Stack gap="sm">
            <Heading level={1}>{guide.title}</Heading>
            <Text as="p" size="lg" tone="description">
              {guide.description}
            </Text>
          </Stack>
          <Markdown source={guide.body} from={guide.docPath} />
        </Stack>
      </Page>
    </div>
  );
};
