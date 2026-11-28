/** Preview */
import { Page } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  card: {
    width: 300,
    height: 32,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.lg,
  },
  tall: { height: 56 },
}));

// The screen's centred column: one block per Card, spaced by the page gap.
export default function Preview() {
  const styles = useStyle();
  return (
    <Page>
      <div className={styles.card} />
      <div className={`${styles.card} ${styles.tall}`} />
      <div className={styles.card} />
    </Page>
  );
}
