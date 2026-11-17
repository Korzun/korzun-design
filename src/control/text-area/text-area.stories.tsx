import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { TextArea } from './index.js';

type Props = ComponentProps<typeof TextArea>;

export default {
  title: 'Control / TextArea',
  args: { label: 'Default', layout: 'vertical', maxLength: undefined },
  argTypes: {
    label: { control: 'text' },
    layout: { control: 'select', options: ['horizontal', 'vertical', 'inline'] },
    maxLength: { control: 'number', min: 0 },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [value, setValue] = useState<string | undefined>('Some longer text');
  return <TextArea {...args} name="area" value={value} onChange={setValue} />;
};

export const AutoResize: Story<Props> = (args) => {
  const [value, setValue] = useState<string | undefined>('Some longer text');
  return <TextArea {...args} name="area-auto" value={value} onChange={setValue} autoResize />;
};
AutoResize.args = { label: 'Auto-resize, max 80', maxLength: 80 };

export const Borderless: Story<Props> = (args) => (
  <TextArea {...args} name="area-b" value="" variant="borderless" />
);
Borderless.args = { label: 'Borderless', layout: 'horizontal' };
