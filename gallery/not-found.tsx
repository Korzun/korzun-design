import { Heading, Page, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Link, useLocation } from 'react-router';

const useStyle = createUseStyles((theme: Theme) => ({
  link: { color: theme.color.brand.default },
}));

/** Shown for any route, component or guide the site does not have. */
export const NotFound = () => {
  const styles = useStyle();
  return (
    <Page>
      <Heading level={1}>Not found</Heading>
      <Text as="p">
        Nothing lives at <code>{useLocation().pathname}</code>.
      </Text>
      <Link to="/" className={styles.link}>
        Back to the components
      </Link>
    </Page>
  );
};
