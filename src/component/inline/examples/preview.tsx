/** Preview */
import { Inline } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  block: {
    width: 64,
    height: 48,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.md,
  },
}));

export default function Preview() {
  const styles = useStyle();
  return (
    <Inline>
      <div className={styles.block} />
      <div className={styles.block} />
      <div className={styles.block} />
    </Inline>
  );
}
