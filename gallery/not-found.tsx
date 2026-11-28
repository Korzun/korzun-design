import { Heading, Page, Space, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Link, useLocation } from 'react-router';

import { siteColumn } from './layout/column.js';
import { siteLink } from './layout/link.js';

const useStyle = createUseStyles((theme: Theme) => ({
  // The site column, like every other page, so the heading lines up with the header.
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
  link: siteLink(theme),
}));

/** Shown for any route, component or guide the site does not have. */
export const NotFound = () => {
  const styles = useStyle();
  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle="Not found · @korzun/design">
        <Space direction="vertical" gap="md">
          <Heading level={1}>Not found</Heading>
          <Text as="p">
            Nothing lives at <code>{useLocation().pathname}</code>.
          </Text>
          <Link to="/" className={styles.link}>
            Back to the components
          </Link>
        </Space>
      </Page>
    </div>
  );
};
