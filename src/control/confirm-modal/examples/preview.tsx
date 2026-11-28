/** Preview */
import { createUseStyles, type Theme } from '@korzun/design/theme';

const block = (theme: Theme) => ({
  backgroundColor: theme.color.brand.light,
  border: `1px solid ${theme.color.brand.outline}`,
  borderRadius: theme.radius.sm,
});

const useStyle = createUseStyles((theme: Theme) => ({
  dialog: {
    width: 200,
    padding: theme.space.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.md,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.md,
  },
  heading: { display: 'flex', alignItems: 'center', gap: theme.space.sm },
  icon: {
    width: 16,
    height: 16,
    flexShrink: 0,
    borderRadius: '50%',
    backgroundColor: theme.color.danger.light,
    border: `1px solid ${theme.color.danger.default}`,
  },
  title: { ...block(theme), width: '55%', height: 14 },
  line: { ...block(theme), height: 10, width: '85%' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: theme.space.sm },
  cancel: { ...block(theme), width: 40, height: 18 },
  confirm: {
    ...block(theme),
    width: 52,
    height: 18,
    backgroundColor: theme.color.danger.default,
    borderColor: theme.color.danger.default,
  },
}));

// A yes-or-no question: an icon and title, one line of consequence, Cancel
// beside a (here destructive) Confirm.
export default function Preview() {
  const styles = useStyle();
  return (
    <div className={styles.dialog}>
      <div className={styles.heading}>
        <div className={styles.icon} />
        <div className={styles.title} />
      </div>
      <div className={styles.line} />
      <div className={styles.footer}>
        <div className={styles.cancel} />
        <div className={styles.confirm} />
      </div>
    </div>
  );
}
