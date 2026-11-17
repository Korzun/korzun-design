import { ICON_SEGMENTS, SEGMENTS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { SegmentedControl } from './index.js';

type Props = Pick<ComponentProps<typeof SegmentedControl>, 'label' | 'surface'>;

export default {
  title: 'Control / SegmentedControl',
  args: { label: 'Text', surface: 'card' },
  argTypes: {
    label: { control: 'text' },
    surface: { control: 'select', options: ['card', 'row'] },
  },
} satisfies StoryDefault<Props>;

export const Text: Story<Props> = (args) => {
  const [value, setValue] = useState<'one' | 'two' | 'three'>('one');
  return <SegmentedControl {...args} options={SEGMENTS} value={value} onChange={setValue} />;
};

export const IconsClearable: Story<Props> = (args) => {
  const [value, setValue] = useState<string | null>('search');
  return (
    <SegmentedControl
      {...args}
      options={ICON_SEGMENTS}
      value={value}
      onChange={setValue}
      clearable
      showLabels={false}
    />
  );
};
IconsClearable.args = { label: 'Icons, clearable' };

export const ReadOnly: Story<Props> = (args) => (
  <SegmentedControl {...args} options={SEGMENTS} value="two" />
);
ReadOnly.args = { label: 'Read-only' };
