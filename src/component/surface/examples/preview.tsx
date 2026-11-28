/** Preview */
import { Surface, useSurfaceRadius } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { ReactNode } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  box: {
    padding: theme.space.xxl,
    backgroundColor: theme.color.brand.light,
    border: `1px solid ${theme.color.brand.outline}`,
  },
  core: { width: 120, height: 24 },
}));

// A box drawn at the current depth, its contents one level deeper.
const Box = ({ children }: { children?: ReactNode }) => {
  const styles = useStyle();
  const borderRadius = useSurfaceRadius();
  return (
    <div
      className={children ? styles.box : `${styles.box} ${styles.core}`}
      style={{ borderRadius }}
    >
      {children && <Surface>{children}</Surface>}
    </div>
  );
};

// Each level of nesting takes the next corner radius down: lg, md, sm.
export default function Preview() {
  return (
    <Box>
      <Box>
        <Box />
      </Box>
    </Box>
  );
}
