import type { Story, StoryDefault } from '@gallery/story';
import { useRef, useState, type ComponentProps } from 'react';

import { createUseStyles, type Theme } from '../../theme/index.js';
import { Button } from '../button/index.js';
import { Popover, type PopoverAlign, type PopoverSide } from './index.js';

type Props = ComponentProps<typeof Popover>;

const useStyle = createUseStyles((theme: Theme) => ({
  content: {
    padding: theme.space.xl,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.md,
  },
  small: {
    padding: theme.space.md,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.hoverLift,
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.space.xl,
    padding: '120px 40px',
    rowGap: 200,
  },
  cell: { display: 'flex', justifyContent: 'center' },
  anchor: {
    padding: theme.space.md,
    border: `1px dashed ${theme.color.border.strong}`,
    borderRadius: theme.radius.md,
    width: 160,
    textAlign: 'center',
  },
  full: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: theme.space.xl,
    boxSizing: 'border-box',
  },
}));

export default {
  title: 'Control / Popover',
  args: { matchWidth: false, side: 'bottom', align: 'start' },
  argTypes: {
    side: { control: 'select', options: ['bottom', 'top'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    matchWidth: { control: 'boolean' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const styles = useStyle();
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={anchor} style={{ display: 'inline-block' }}>
        <Button onClick={() => setOpen((o) => !o)}>Toggle popover</Button>
      </div>
      <Popover {...args} anchorRef={anchor} open={open} onClose={() => setOpen(false)}>
        <div className={styles.content}>Popover content</div>
      </Popover>
    </>
  );
};

const PlacedAnchor = ({ side, align }: { side: PopoverSide; align: PopoverAlign }) => {
  const styles = useStyle();
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.cell}>
      <div ref={anchor} className={styles.anchor}>
        {side} / {align}
      </div>
      <Popover anchorRef={anchor} open side={side} align={align} matchWidth={false}>
        <div className={styles.small}>
          {side} {align}
        </div>
      </Popover>
    </div>
  );
};

export const Placements: Story<Props> = () => {
  const styles = useStyle();
  const sides: PopoverSide[] = ['top', 'bottom'];
  const aligns: PopoverAlign[] = ['start', 'center', 'end'];
  return (
    <div className={styles.grid}>
      {sides.flatMap((side) =>
        aligns.map((align) => <PlacedAnchor key={`${side}-${align}`} side={side} align={align} />)
      )}
    </div>
  );
};

export const FlipNearBottom: Story<Props> = (args) => {
  const styles = useStyle();
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.full}>
      <div ref={anchor} className={styles.anchor}>
        Anchor at the bottom
      </div>
      <Popover {...args} anchorRef={anchor} open side="bottom">
        <div className={styles.content}>Prefers bottom, flips up: no room below</div>
      </Popover>
    </div>
  );
};
