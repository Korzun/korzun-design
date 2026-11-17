import { NAV_ITEMS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { NavMobile } from './index.js';

type Props = ComponentProps<typeof NavMobile>;

export default {
  title: 'Component / NavMobile',
  sheet: false,
  args: { expanded: 'main' },
  argTypes: { expanded: { control: 'select', options: ['main', 'settings'] } },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => (
  <NavMobile
    {...args}
    main={{ items: [...NAV_ITEMS], collapsed: NAV_ITEMS[0] }}
    settings={{ items: NAV_ITEMS.slice(1), collapsed: NAV_ITEMS[2] }}
  />
);
