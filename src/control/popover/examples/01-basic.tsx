/** Basic
 * A Filters button opens a popover under it. The popover paints nothing, so the
 * content brings its own background, border and radius. It does not close on
 * selection: choosing an option calls `setOpen(false)` itself. This demo starts open.
 */
import { Space, Text } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef, useState } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.xs,
  },
}));

export default function Basic() {
  const styles = useStyle();
  const anchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(true);
  const [chosen, setChosen] = useState('nothing yet');
  const choose = (label: string) => {
    setChosen(label);
    setOpen(false);
  };
  return (
    <Space direction="vertical" align="start">
      <Button ref={anchor} onClick={() => setOpen((value) => !value)}>
        Filters
      </Button>
      <Popover anchorRef={anchor} open={open} matchWidth={false} onClose={() => setOpen(false)}>
        <div className={styles.panel}>
          <Space direction="vertical" gap="xxs">
            <Button type="text" onClick={() => choose('Unread')}>
              Unread
            </Button>
            <Button type="text" onClick={() => choose('Finished')}>
              Finished
            </Button>
            <Button type="text" onClick={() => choose('Favourites')}>
              Favourites
            </Button>
          </Space>
        </div>
      </Popover>
      <Text tone="muted">Chosen: {chosen}</Text>
    </Space>
  );
}
