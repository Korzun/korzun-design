import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { DateTimeInput } from './index.js';

type Props = ComponentProps<typeof DateTimeInput>;

export default {
  title: 'Control / DateTimeInput',
  args: { label: 'When' },
  argTypes: { label: { control: 'text' } },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <div>
      <DateTimeInput {...args} name="date" value={value} onChange={setValue} />
      <div>{value ?? '(empty)'}</div>
    </div>
  );
};
