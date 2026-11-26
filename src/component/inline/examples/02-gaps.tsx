/** Gaps
 * `gap` takes a key of the theme's `space` scale, or `none` for children
 * that bring their own spacing. Five steps of the scale are shown.
 */
import { Inline, Tag, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Fragment } from 'react';

const gaps = ['none', 'xs', 'md', 'xl', 'xxxl'] as const;

// Two columns, so every row of tags starts at the same x.
const useStyles = createUseStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    alignItems: 'center',
    gap: `${theme.space.md} ${theme.space.xl}`,
  },
}));

export default function Gaps() {
  const styles = useStyles();
  return (
    <div className={styles.grid}>
      {gaps.map((gap) => (
        <Fragment key={gap}>
          <Text size="sm" tone="muted">
            {`gap="${gap}"`}
          </Text>
          <Inline gap={gap}>
            <Tag>One</Tag>
            <Tag>Two</Tag>
            <Tag>Three</Tag>
          </Inline>
        </Fragment>
      ))}
    </div>
  );
}
