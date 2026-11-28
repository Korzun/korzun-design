/** Preview
 * @viewport mobile
 */
import { Stack, TopFade } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';

const useStyle = createUseStyles((theme: Theme) => ({
  content: { position: 'fixed', top: -14, left: 16, right: 16 },
  block: {
    height: 28,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
    borderRadius: theme.radius.md,
  },
}));

// Page content scrolled up under the frosted band at the top edge.
export default function Preview() {
  const styles = useStyle();
  return (
    <>
      <TopFade />
      <div className={styles.content}>
        <Stack>
          <div className={styles.block} />
          <div className={styles.block} />
          <div className={styles.block} />
        </Stack>
      </div>
    </>
  );
}
