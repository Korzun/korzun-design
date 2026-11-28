/** Preview */
import { createUseStyles, type Theme } from '@korzun/design/theme';

const block = (theme: Theme) => ({
  backgroundColor: theme.color.brand.light,
  border: `1px solid ${theme.color.brand.outline}`,
  borderRadius: theme.radius.sm,
});

const useStyle = createUseStyles((theme: Theme) => ({
  dialog: {
    width: 260,
    overflow: 'hidden',
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.md,
  },
  header: { padding: `${theme.space.lg} ${theme.space.lg} 0` },
  title: { ...block(theme), width: '45%', height: 14 },
  body: {
    padding: theme.space.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.sm,
  },
  line: { ...block(theme), height: 10 },
  short: { width: '70%' },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.space.sm,
    padding: `${theme.space.md} ${theme.space.lg}`,
    backgroundColor: theme.color.bg.footer,
    borderTop: `1px solid ${theme.color.border.light}`,
  },
  button: { ...block(theme), width: 44, height: 18 },
  primary: { backgroundColor: theme.color.brand.default, borderColor: theme.color.brand.default },
}));

// A general dialog: a title, any body content, and a footer bar for actions.
export default function Preview() {
  const styles = useStyle();
  return (
    <div className={styles.dialog}>
      <div className={styles.header}>
        <div className={styles.title} />
      </div>
      <div className={styles.body}>
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={`${styles.line} ${styles.short}`} />
      </div>
      <div className={styles.footer}>
        <div className={styles.button} />
        <div className={`${styles.button} ${styles.primary}`} />
      </div>
    </div>
  );
}
