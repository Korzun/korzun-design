/** Writing styles
 * `createUseStyles` takes a function of the typed `theme`, so spacing, colours and corners all come from tokens. `applyTransparency` tints a token, and the `theme.breakpoint.mobile` string keys a media query. The Button counts the picks the tinted row shows.
 */
import { applyTransparency } from '@korzun/design';
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    padding: theme.space.xxl,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.lg,
  },
  highlight: {
    padding: theme.space.md,
    backgroundColor: applyTransparency(theme.color.brand.default, 0.12),
    borderRadius: theme.radius.md,
  },
  [theme.breakpoint.mobile]: { panel: { padding: theme.space.md } },
}));

export default function Styles() {
  const styles = useStyle();
  const [picks, setPicks] = useState(0);
  return (
    <div className={styles.panel}>
      <Space direction="vertical" gap="md" align="start">
        <div className={styles.highlight}>
          <Text>Picked {picks} times</Text>
        </div>
        <Button onClick={() => setPicks((n) => n + 1)}>Pick</Button>
      </Space>
    </div>
  );
}
