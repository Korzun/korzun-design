/** Preview */
import { Inline } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  phone: {
    position: 'relative',
    width: 88,
    height: 160,
    padding: theme.space.md,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.sm,
    overflow: 'hidden',
    backgroundColor: theme.color.bg.card,
    border: `2px solid ${theme.color.border.default}`,
    borderRadius: 16,
  },
  block: {
    flex: 'none',
    height: 20,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.sm,
  },
  installed: { borderColor: theme.color.brand.default },
  addressBar: {
    flex: 'none',
    height: 14,
    backgroundColor: theme.color.bg.cardHeader,
    borderRadius: theme.radius.pill,
  },
}));

// A browser tab, with its address bar, beside the installed app, which has none:
// the hook tells the two apart.
export default function Preview() {
  const styles = useStyle();
  return (
    <Inline gap="xxl">
      <div className={styles.phone}>
        <div className={styles.addressBar} />
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
      </div>
      <div className={`${styles.phone} ${styles.installed}`}>
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
      </div>
    </Inline>
  );
}
