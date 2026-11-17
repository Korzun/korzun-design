import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { Switch } from './index.js';

type Props = ComponentProps<typeof Switch>;

export default {
  title: 'Control / Switch',
  args: {
    label: 'Default',
    description: '',
    disabled: false,
    loading: false,
    layout: 'default',
    radius: 'inset',
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    layout: { control: 'select', options: ['default', 'horizontal'] },
    radius: { control: 'select', options: ['inset', 'pill'] },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [checked, setChecked] = useState(true);
  return <Switch {...args} name="sw" checked={checked} onChange={setChecked} />;
};

export const WithDescription: Story<Props> = (args) => {
  const [checked, setChecked] = useState(true);
  return <Switch {...args} name="sw-desc" checked={checked} onChange={setChecked} />;
};
WithDescription.args = { label: 'With description', description: 'Helper text' };

export const Disabled: Story<Props> = (args) => (
  <Switch {...args} name="sw-dis" checked onChange={() => {}} />
);
Disabled.args = { label: 'Disabled', disabled: true };

export const Loading: Story<Props> = (args) => (
  <Switch {...args} name="sw-load" checked={false} onChange={() => {}} />
);
Loading.args = { label: 'Loading', loading: true };
