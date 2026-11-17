import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { Card } from '../card/index.js';
import { Tag } from '../tag/index.js';
import { CardDivider } from './index.js';

type Props = ComponentProps<typeof CardDivider>;

export default {
  title: 'Component / CardDivider',
  args: { align: 'center' },
  argTypes: { align: { control: 'select', options: ['left', 'center', 'right'] } },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => (
  <Card>
    <CardDivider />
    <CardDivider {...args}>Labelled</CardDivider>
    <CardDivider align="right" actions={<Tag size="sm">action</Tag>}>
      Right with actions
    </CardDivider>
  </Card>
);
