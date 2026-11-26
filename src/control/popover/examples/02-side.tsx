/** Side
 * `side="bottom"` opens the popover below its anchor and `side="top"` above it.
 * Each anchor is labelled with the side it asks for.
 */
import { Inline, Stack, Text } from '@korzun/design/component';
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

export default function Side() {
  const styles = useStyle();
  const belowAnchor = useRef<HTMLElement>(null);
  const aboveAnchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<'bottom' | 'top' | null>(null);
  const toggle = (side: 'bottom' | 'top') => setOpen((current) => (current === side ? null : side));
  return (
    <Stack>
      <Text tone="muted">Open: {open ?? 'none'}</Text>
      <Inline>
        <Button ref={belowAnchor} onClick={() => toggle('bottom')}>
          Opens below
        </Button>
        <Button ref={aboveAnchor} onClick={() => toggle('top')}>
          Opens above
        </Button>
      </Inline>
      <Popover
        anchorRef={belowAnchor}
        open={open === 'bottom'}
        side="bottom"
        matchWidth={false}
        onClose={() => setOpen(null)}
      >
        <div className={styles.panel}>
          <Text>Below the anchor</Text>
        </div>
      </Popover>
      <Popover
        anchorRef={aboveAnchor}
        open={open === 'top'}
        side="top"
        matchWidth={false}
        onClose={() => setOpen(null)}
      >
        <div className={styles.panel}>
          <Text>Above the anchor</Text>
        </div>
      </Popover>
    </Stack>
  );
}
