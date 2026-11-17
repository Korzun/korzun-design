import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { CardDivider } from '../card-divider/index.js';
import { CardRow } from '../card-row/index.js';
import { Card } from './index.js';

type Props = ComponentProps<typeof Card>;

export default {
  title: 'Component / Card',
  args: {
    title: 'Card title',
    subTitle: 'Subtitle',
    footer: 'Footer',
    size: 'large',
    isCollapsible: false,
  },
  argTypes: {
    title: { control: 'text' },
    subTitle: { control: 'text' },
    footer: { control: 'text' },
    size: { control: 'select', options: ['small', 'large'] },
    isCollapsible: { control: 'boolean' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => (
  <Card {...args}>
    <CardRow>First row</CardRow>
    <CardDivider />
    <CardRow onClick={() => {}}>Clickable row</CardRow>
    <CardDivider>Labelled divider</CardDivider>
    <CardRow>Last row</CardRow>
  </Card>
);

export const Collapsible: Story<Props> = (args) => (
  <Card {...args} defaultCollapsed>
    <CardRow>Hidden until expanded</CardRow>
  </Card>
);
Collapsible.args = { title: 'Collapsible card', isCollapsible: true };

export const Small: Story<Props> = (args) => (
  <Card {...args}>
    <CardRow>Small</CardRow>
  </Card>
);
Small.args = { title: 'Small card', size: 'small' };
