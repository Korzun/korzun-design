/** Preview */
import { Space } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    width: 150,
    padding: theme.space.xl,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.md,
  },
  title: {
    height: 8,
    backgroundColor: theme.color.brand.outline,
    borderRadius: theme.radius.pill,
  },
  dash: {
    height: 3,
    backgroundColor: theme.color.brand.outline,
    borderRadius: theme.radius.pill,
  },
  current: { backgroundColor: theme.color.brand.default },
  w1: { width: 104 },
  w2: { width: 84, marginLeft: 16 },
  w3: { width: 64, marginLeft: 32 },
  d1: { width: 24 },
  d2: { width: 18 },
  d3: { width: 12 },
}));

const outline = [1, 2, 3, 2, 1, 2] as const;
const CURRENT = 2;

// The open panel of titles beside the column of dashes it opens from.
export default function Preview() {
  const styles = useStyle();
  return (
    <Space gap="xl">
      <Space direction="vertical" gap="lg" className={styles.panel}>
        {outline.map((level, i) => (
          <div
            key={i}
            className={`${styles.title} ${styles[`w${level}`]} ${i === CURRENT ? styles.current : ''}`}
          />
        ))}
      </Space>
      <Space direction="vertical" gap="md" align="end">
        {outline.map((level, i) => (
          <div
            key={i}
            className={`${styles.dash} ${styles[`d${level}`]} ${i === CURRENT ? styles.current : ''}`}
          />
        ))}
      </Space>
    </Space>
  );
}
