/** Basic
 * A frosted band fixed to the top of the viewport that blurs content under the
 * device status bar and fades to nothing below it. Render it only in the
 * installed app: the switch stands in for the `useIsStandalone()` check. A browser
 * has no status-bar inset, so the band is only `space.md` tall here: the striped
 * strip pinned to the top stands in for content scrolled up under it, and its top
 * edge blurs while the switch is on.
 * @viewport mobile
 */
import { Space, Chip, Text, TopFade } from '@korzun/design/component';
import { Switch } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

const useStyles = createUseStyles((theme: Theme) => ({
  // Page content that has scrolled up under the status bar, pinned there for the demo.
  scrolled: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.base,
    display: 'flex',
    gap: theme.space.xs,
    padding: theme.space.xs,
    backgroundImage: `repeating-linear-gradient(90deg, ${theme.color.brand.default} 0 ${theme.space.xl}, ${theme.color.chip.subject.bg} ${theme.space.xl} ${theme.space.xxxxxl})`,
  },
  // Clear of the pinned strip.
  content: { paddingTop: theme.space.xxxxxl },
}));

export default function Basic() {
  const styles = useStyles();
  const [installed, setInstalled] = useState(true);
  return (
    <>
      <div className={styles.scrolled}>
        <Chip tone="author">George Eliot</Chip>
        <Chip tone="subject">Fiction</Chip>
      </div>
      {installed && <TopFade />}
      <Space direction="vertical" className={styles.content}>
        <Text>Scrolled content under the band blurs, then fades to sharp below it.</Text>
        <Switch
          name="installed"
          label="Installed app"
          checked={installed}
          onChange={setInstalled}
        />
      </Space>
    </>
  );
}
