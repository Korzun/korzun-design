import { FRUITS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { Select } from './index.js';

type Props = ComponentProps<typeof Select>;

export default {
  title: 'Control / Select',
  args: {
    label: 'Default',
    layout: 'horizontal',
    disabled: false,
    loading: false,
    allowCreate: false,
    surface: 'card',
  },
  argTypes: {
    label: { control: 'text' },
    layout: { control: 'select', options: ['horizontal', 'vertical', 'inline'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    allowCreate: { control: 'boolean' },
    surface: { control: 'select', options: ['card', 'page'] },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [value, setValue] = useState<string | undefined>('Banana');
  return <Select {...args} name="sel" options={FRUITS} value={value} onChange={setValue} />;
};

export const AllowCreate: Story<Props> = (args) => {
  const [value, setValue] = useState<string | undefined>('Banana');
  return <Select {...args} name="sel-create" options={FRUITS} value={value} onChange={setValue} />;
};
AllowCreate.args = { label: 'Allow create', allowCreate: true, layout: 'vertical' };

export const Disabled: Story<Props> = (args) => (
  <Select {...args} name="sel-dis" options={FRUITS} value="Apple" />
);
Disabled.args = { label: 'Disabled', disabled: true };

export const Loading: Story<Props> = (args) => (
  <Select {...args} name="sel-load" options={FRUITS} value={undefined} />
);
Loading.args = { label: 'Loading', loading: true };
