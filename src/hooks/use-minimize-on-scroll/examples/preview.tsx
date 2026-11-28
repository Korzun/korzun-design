/** Preview */
import { Space } from '@korzun/design/component';
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
  bar: {
    position: 'absolute',
    left: theme.space.md,
    right: theme.space.md,
    bottom: theme.space.md,
    height: 22,
    backgroundColor: theme.color.brand.default,
    borderRadius: theme.radius.pill,
  },
  minimized: { left: '50%', right: 'auto', width: 28, height: 12, transform: 'translateX(-50%)' },
}));

// The bottom bar at rest, then shrunk to a small pill once the page scrolls down fast.
export default function Preview() {
  const styles = useStyle();
  return (
    <Space gap="xxl">
      <div className={styles.phone}>
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.bar} />
      </div>
      <div className={styles.phone}>
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={`${styles.bar} ${styles.minimized}`} />
      </div>
    </Space>
  );
}
