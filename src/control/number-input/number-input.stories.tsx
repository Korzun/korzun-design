import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { NumberInput } from './index.js';

type Props = ComponentProps<typeof NumberInput>;

export default {
  title: 'Control / NumberInput',
  args: { label: 'Number', layout: 'horizontal' },
  argTypes: {
    label: { control: 'text' },
    layout: { control: 'select', options: ['horizontal', 'vertical', 'inline'] },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [value, setValue] = useState<number | undefined>(42);
  return <NumberInput {...args} name="num" value={value} onChange={setValue} />;
};

export const Vertical: Story<Props> = (args) => {
  const [value, setValue] = useState<number | undefined>(42);
  return <NumberInput {...args} name="num-v" value={value} onChange={setValue} />;
};
Vertical.args = { label: 'Vertical', layout: 'vertical' };
