/** Width
 * `matchWidth` makes the popover exactly as wide as its anchor, as a Select's
 * list is. `matchWidth={false}` lets the content size itself.
 */
import { Stack, Text } from '@korzun/design/component';
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

export default function Width() {
  const styles = useStyle();
  const matchedAnchor = useRef<HTMLElement>(null);
  const contentAnchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<'matched' | 'content' | null>(null);
  const toggle = (name: 'matched' | 'content') =>
    setOpen((current) => (current === name ? null : name));
  return (
    <Stack>
      <Text tone="muted">Open: {open ?? 'none'}</Text>
      <Button ref={matchedAnchor} onClick={() => toggle('matched')}>
        matchWidth: as wide as this button
      </Button>
      <Button ref={contentAnchor} onClick={() => toggle('content')}>
        matchWidth false: as wide as its content
      </Button>
      <Popover
        anchorRef={matchedAnchor}
        open={open === 'matched'}
        matchWidth
        onClose={() => setOpen(null)}
      >
        <div className={styles.panel}>
          <Text>Same width as the anchor</Text>
        </div>
      </Popover>
      <Popover
        anchorRef={contentAnchor}
        open={open === 'content'}
        matchWidth={false}
        onClose={() => setOpen(null)}
      >
        <div className={styles.panel}>
          <Text>Short</Text>
        </div>
      </Popover>
    </Stack>
  );
}
