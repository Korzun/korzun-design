import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { TextInput } from './index.js';

type Props = ComponentProps<typeof TextInput>;

export default {
  title: 'Control / TextInput',
  args: { label: 'Default', layout: 'horizontal', placeholder: '' },
  argTypes: {
    label: { control: 'text' },
    layout: { control: 'select', options: ['horizontal', 'vertical', 'inline'] },
    placeholder: { control: 'text' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [value, setValue] = useState<string | undefined>('Hello');
  return <TextInput {...args} name="text" value={value} onChange={setValue} />;
};

export const Validated: Story<Props> = (args) => {
  const [value, setValue] = useState<string | undefined>('Hello');
  return (
    <TextInput
      {...args}
      name="text-invalid"
      value={value}
      onChange={setValue}
      validate={(v) => v.length > 0}
      layout="vertical"
    />
  );
};
Validated.args = { label: 'Validated (must not be empty)' };

export const Password: Story<Props> = (args) => (
  <TextInput {...args} name="pw" password value="secret" onChange={() => {}} layout="vertical" />
);
Password.args = { label: 'Password' };

export const Placeholder: Story<Props> = (args) => (
  <TextInput {...args} name="ph" value="" onChange={() => {}} placeholder="Type here" />
);
Placeholder.args = { label: 'Placeholder' };
