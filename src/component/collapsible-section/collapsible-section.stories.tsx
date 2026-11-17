import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { CollapsibleSection } from './index.js';

type Props = ComponentProps<typeof CollapsibleSection>;

export default {
  title: 'Component / CollapsibleSection',
  args: { title: 'Section title', subTitle: 'Click to toggle' },
  argTypes: { title: { control: 'text' }, subTitle: { control: 'text' } },
} satisfies StoryDefault<Props>;

export const Uncontrolled: Story<Props> = (args) => (
  <CollapsibleSection {...args}>Section body</CollapsibleSection>
);

export const Controlled: Story<Props> = (args) => {
  const [open, setOpen] = useState(false);
  return (
    <CollapsibleSection {...args} open={open} onOpenToggle={() => setOpen((o) => !o)}>
      Controlled body
    </CollapsibleSection>
  );
};
