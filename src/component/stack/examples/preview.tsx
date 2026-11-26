/** Preview */
import { Stack } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  block: {
    width: 200,
    height: 28,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.md,
  },
}));

export default function Preview() {
  const styles = useStyle();
  return (
    <Stack>
      <div className={styles.block} />
      <div className={styles.block} />
      <div className={styles.block} />
    </Stack>
  );
}
