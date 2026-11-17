import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { CardRow } from '../card-row/index.js';
import { Card } from '../card/index.js';
import { Page } from './index.js';
import { PageType } from './style.js';

type Props = ComponentProps<typeof Page>;

export default {
  title: 'Component / Page',
  sheet: false,
  args: { type: 'default', bottomNav: false, actionsLabel: 'More…' },
  argTypes: {
    type: { control: 'select', options: Object.values(PageType) },
    bottomNav: { control: 'boolean' },
    actionsLabel: { control: 'text' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => (
  <Page {...args}>
    <Card title="Page card">
      <CardRow>Page body</CardRow>
    </Card>
  </Page>
);

export const WithBottomNav: Story<Props> = (args) => (
  <Page {...args} back="/" headerActions={[{ label: 'Action', onClick: () => {} }]}>
    <Card title="With bottomNav">
      <CardRow>Page body</CardRow>
    </Card>
  </Page>
);
WithBottomNav.args = { bottomNav: true };
