/** Preview */
import { Stack } from '@korzun/design/component';
import { Button, Popover } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useRef } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  // Tall enough for the open panel, so the centred thumbnail keeps it in frame.
  box: { height: 175 },
  panel: {
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    padding: theme.space.xs,
  },
}));

export default function Preview() {
  const styles = useStyle();
  const anchor = useRef<HTMLElement>(null);
  return (
    <Stack align="start" className={styles.box}>
      <Button ref={anchor} onClick={() => {}}>
        Filters
      </Button>
      <Popover anchorRef={anchor} open matchWidth={false} onClose={() => {}}>
        <div className={styles.panel}>
          <Stack gap="xxs">
            <Button type="text" onClick={() => {}}>
              Unread
            </Button>
            <Button type="text" onClick={() => {}}>
              Finished
            </Button>
            <Button type="text" onClick={() => {}}>
              Favourites
            </Button>
          </Stack>
        </div>
      </Popover>
    </Stack>
  );
}
