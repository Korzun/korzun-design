/** useMinimizeOnScroll
 * Scroll this frame down quickly and the bottom bar minimizes; scroll back up a little, reach
 * the top or press Expand and it comes back. A slow scroll leaves it alone. `NavMobile` already
 * does this; call the hook for other bottom chrome.
 * @viewport screen
 */
import { Card, Space, Page, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useMinimizeOnScroll } from '@korzun/design/hooks';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';

const useStyle = createUseStyles((theme: Theme) => ({
  bar: {
    position: 'fixed',
    left: theme.space.xl,
    right: theme.space.xl,
    bottom: theme.space.xl,
    padding: theme.space.lg,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.color.border.default}`,
    backgroundColor: theme.color.bg.card,
    boxShadow: theme.shadow.hoverLift,
    transition: 'padding 200ms ease',
  },
  minimized: { paddingTop: theme.space.xs, paddingBottom: theme.space.xs },
}));

const chapters = Array.from({ length: 12 }, (_, i) => `Chapter ${i + 1}`);

export default function MinimizeOnScroll() {
  const styles = useStyle();
  const { minimized, expand } = useMinimizeOnScroll({ resetKey: 'reader' });
  return (
    <>
      <Page>
        {chapters.map((title) => (
          <Card key={title} title={title}>
            <Text>Scroll quickly to minimize the bar below.</Text>
          </Card>
        ))}
      </Page>
      <div className={cx(styles.bar, minimized && styles.minimized)}>
        <Space justify="between">
          <Text tone="muted">{minimized ? 'Minimized' : 'Expanded'}</Text>
          {minimized && (
            <Button type="link" onClick={expand}>
              Expand
            </Button>
          )}
        </Space>
      </div>
    </>
  );
}
