import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { CardRow } from './index.js';

type Props = ComponentProps<typeof CardRow>;

export default {
  title: 'Component / CardRow',
  args: { children: 'Plain row' },
  argTypes: { children: { control: 'text' }, onClick: { control: 'action' } },
} satisfies StoryDefault<Props>;

// A CardRow is a card-shell surface, so it sits on the page background (radius.lg),
// not inside a Card.
export const Default: Story<Props> = ({ onClick: _onClick, ...args }) => <CardRow {...args} />;

export const Clickable: Story<Props> = (args) => <CardRow {...args} />;
Clickable.args = { children: 'Clickable row' };
