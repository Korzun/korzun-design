import { FRUITS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { ChipsInput } from './index.js';

type Props = ComponentProps<typeof ChipsInput>;

export default {
  title: 'Control / ChipsInput',
  args: { label: 'Fruits', placeholder: 'Add fruit', disabled: false },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [value, setValue] = useState<string[]>(['Apple']);
  return <ChipsInput {...args} value={value} suggestions={FRUITS} onChange={setValue} />;
};

export const Disabled: Story<Props> = (args) => (
  <ChipsInput
    {...args}
    value={['Cherry']}
    suggestions={FRUITS}
    onChange={() => {}}
    chipColor="author"
  />
);
Disabled.args = { label: 'Disabled', disabled: true };
