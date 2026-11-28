/** Align
 * `align` lines the popover up with the anchor's start edge, centre or end
 * edge. The anchors are wider than the popover so each edge shows.
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

type Align = 'start' | 'center' | 'end';

export default function Align() {
  const styles = useStyle();
  const startAnchor = useRef<HTMLElement>(null);
  const centerAnchor = useRef<HTMLElement>(null);
  const endAnchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Align | null>(null);
  const toggle = (align: Align) => setOpen((current) => (current === align ? null : align));
  const anchors = { start: startAnchor, center: centerAnchor, end: endAnchor };
  return (
    <Stack align="start">
      <Text tone="muted">Open: {open ?? 'none'}</Text>
      <Button ref={startAnchor} onClick={() => toggle('start')}>
        align start: popover at the left edge
      </Button>
      <Button ref={centerAnchor} onClick={() => toggle('center')}>
        align center: popover at the middle
      </Button>
      <Button ref={endAnchor} onClick={() => toggle('end')}>
        align end: popover at the right edge
      </Button>
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover
          key={align}
          anchorRef={anchors[align]}
          open={open === align}
          align={align}
          matchWidth={false}
          onClose={() => setOpen(null)}
        >
          <div className={styles.panel}>
            <Text>align {align}</Text>
          </div>
        </Popover>
      ))}
    </Stack>
  );
}
