import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { EmptyState } from './index.js';

type Props = ComponentProps<typeof EmptyState>;

export default {
  title: 'Component / EmptyState',
  args: { title: 'Nothing here', children: 'Try adding something.', danger: false },
  argTypes: {
    title: { control: 'text' },
    children: { control: 'text' },
    danger: { control: 'boolean' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <EmptyState {...args} />;

export const Danger: Story<Props> = (args) => <EmptyState {...args} />;
Danger.args = { title: 'Something went wrong', children: 'Details of the error.', danger: true };
