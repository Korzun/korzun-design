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
  indicator: {
    flex: 'none',
    alignSelf: 'center',
    width: 18,
    height: 18,
    border: `2px solid ${theme.color.brand.default}`,
    borderTopColor: 'transparent',
    borderRadius: theme.radius.circle,
  },
}));

// The page at rest, then pulled down past the threshold with the indicator above it.
export default function Preview() {
  const styles = useStyle();
  return (
    <Space gap="xxl">
      <div className={styles.phone}>
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
      </div>
      <div className={styles.phone}>
        <div className={styles.indicator} />
        <div className={styles.block} />
        <div className={styles.block} />
        <div className={styles.block} />
      </div>
    </Space>
  );
}
