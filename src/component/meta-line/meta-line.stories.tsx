import type { Story, StoryDefault } from '@gallery/story';

import { MetaLine } from './index.js';

export default { title: 'Component / MetaLine' } satisfies StoryDefault;

export const Default: Story = () => <MetaLine items={['Author', '2024', null, '320 pages']} />;
