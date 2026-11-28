/** Preview */
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  screen: {
    position: 'relative',
    width: 280,
    height: 160,
    padding: theme.space.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.md,
    overflow: 'hidden',
    backgroundColor: theme.color.bg.page,
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.lg,
  },
  pageBlock: {
    height: 28,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.light}`,
    borderRadius: theme.radius.md,
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.overlay.backdrop,
  },
  dialog: {
    width: 160,
    padding: theme.space.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.md,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.md,
  },
  line: {
    height: 10,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.sm,
  },
  short: { width: '60%' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: theme.space.sm },
  button: {
    width: 32,
    height: 14,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.sm,
  },
  primary: { backgroundColor: theme.color.brand.default, borderColor: theme.color.brand.default },
}));

// An open dialog over a dimmed page: the hook opens it, traps Escape and
// backdrop clicks, and calls back to close it.
export default function Preview() {
  const styles = useStyle();
  return (
    <div className={styles.screen}>
      <div className={styles.pageBlock} />
      <div className={styles.pageBlock} />
      <div className={styles.pageBlock} />
      <div className={styles.backdrop}>
        <div className={styles.dialog}>
          <div className={`${styles.line} ${styles.short}`} />
          <div className={styles.line} />
          <div className={styles.footer}>
            <div className={styles.button} />
            <div className={`${styles.button} ${styles.primary}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
