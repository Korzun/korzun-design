import { NAV_ITEMS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';

import { NavDesktop } from './index.js';

export default { title: 'Component / NavDesktop', sheet: false } satisfies StoryDefault;

export const Default: Story = () => <NavDesktop items={[...NAV_ITEMS]} />;
