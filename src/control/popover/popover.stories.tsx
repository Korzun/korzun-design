import type { Story, StoryDefault } from '@gallery/story';
import { useRef, useState, type ComponentProps } from 'react';

import { createUseStyles, type Theme } from '../../theme/index.js';
import { Button } from '../button/index.js';
import { Popover } from './index.js';

type Props = ComponentProps<typeof Popover>;

const useStyle = createUseStyles((theme: Theme) => ({
  content: {
    padding: theme.space.xl,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.md,
  },
}));

export default {
  title: 'Control / Popover',
  args: { matchWidth: false },
  argTypes: { matchWidth: { control: 'boolean' } },
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
