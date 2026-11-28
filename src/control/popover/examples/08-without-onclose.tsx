/** Without onClose
 * With no `onClose`, Escape and a press outside do nothing: the popover stays
 * open until your code sets `open` to `false`, here the Show and Hide button.
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
    padding: theme.space.md,
  },
}));

export default function WithoutOnClose() {
  const styles = useStyle();
  const anchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <Space direction="vertical" align="start">
      <Button ref={anchor} onClick={() => setOpen((value) => !value)}>
        {open ? 'Hide' : 'Show'}
      </Button>
      <Popover anchorRef={anchor} open={open} matchWidth={false}>
        <div className={styles.panel}>
          <Text>Press Escape or click outside: it stays</Text>
        </div>
      </Popover>
      <Text tone="muted">Open: {open ? 'yes' : 'no'}</Text>
    </Space>
  );
}
