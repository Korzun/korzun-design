import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { Tag } from './index.js';

type Props = ComponentProps<typeof Tag>;

export default {
  title: 'Component / Tag',
  args: { children: 'Medium', size: 'md' },
  argTypes: {
    children: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md'] },
    onClick: { control: 'action' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = ({ onClick: _onClick, ...args }) => <Tag {...args} />;

export const Small: Story<Props> = ({ onClick: _onClick, ...args }) => <Tag {...args} />;
Small.args = { children: 'Small', size: 'sm' };

export const Clickable: Story<Props> = (args) => <Tag {...args} />;
Clickable.args = { children: 'Clickable' };
