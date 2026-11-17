import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { Card } from '../card/index.js';
import { CardRow } from './index.js';

type Props = ComponentProps<typeof CardRow>;

export default {
  title: 'Component / CardRow',
  args: { children: 'Plain row' },
  argTypes: { children: { control: 'text' }, onClick: { control: 'action' } },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = ({ onClick: _onClick, ...args }) => (
  <Card>
    <CardRow {...args} />
  </Card>
);

export const Clickable: Story<Props> = (args) => (
  <Card>
    <CardRow {...args} />
  </Card>
);
Clickable.args = { children: 'Clickable row' };
