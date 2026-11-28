/** Preview */
import { Inline } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  swatch: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.color.border.default}`,
  },
  brand: { backgroundColor: theme.color.brand.default },
  success: { backgroundColor: theme.color.success },
  warning: { backgroundColor: theme.color.warning },
  danger: { backgroundColor: theme.color.danger.default },
  text: { backgroundColor: theme.color.text.primary },
  card: { backgroundColor: theme.color.bg.card },
}));

const tokens = ['brand', 'success', 'warning', 'danger', 'text', 'card'] as const;

export default function Preview() {
  const styles = useStyle();
  return (
    <Inline gap="sm">
      {tokens.map((token) => (
        <div key={token} className={`${styles.swatch} ${styles[token]}`} />
      ))}
    </Inline>
  );
}
