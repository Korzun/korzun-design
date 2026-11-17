import type { Story, StoryDefault } from '@gallery/story';
import { useRef, useState, type ComponentProps } from 'react';

import { Button } from '../button/index.js';
import { Popover } from './index.js';

type Props = ComponentProps<typeof Popover>;

export default {
  title: 'Control / Popover',
  args: { matchWidth: false },
  argTypes: { matchWidth: { control: 'boolean' } },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={anchor} style={{ display: 'inline-block' }}>
        <Button onClick={() => setOpen((o) => !o)}>Toggle popover</Button>
      </div>
      <Popover {...args} anchorRef={anchor} open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: 16, background: 'var(--card, #fff)', border: '1px solid #ccc' }}>
          Popover content
        </div>
      </Popover>
    </>
  );
};
