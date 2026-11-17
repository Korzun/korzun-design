import type { Story, StoryDefault } from '@gallery/story';

import { Tag } from '../tag/index.js';
import { MetadataList } from './index.js';

export default { title: 'Component / MetadataList' } satisfies StoryDefault;

export const Default: Story = () => (
  <MetadataList
    metadata={[
      { title: 'Title', value: 'A Book' },
      { title: 'Status', value: <Tag size="sm">Reading</Tag> },
    ]}
  />
);
