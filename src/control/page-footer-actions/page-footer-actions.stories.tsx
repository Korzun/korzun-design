import type { Story, StoryDefault } from '@gallery/story';

import { PageFooterActions } from './index.js';

type Args = { onAction: (label: string) => void };

export default {
  title: 'Control / PageFooterActions',
  argTypes: { onAction: { control: 'action' } },
} satisfies StoryDefault<Args>;

export const Default: Story<Args> = ({ onAction }) => (
  <PageFooterActions
    items={[
      { label: 'Delete', onClick: () => onAction('Delete'), danger: true, align: 'leading' },
      { label: 'Cancel', onClick: () => onAction('Cancel') },
      { label: 'Busy', onClick: () => onAction('Busy'), loading: true },
      { label: 'Disabled', onClick: () => onAction('Disabled'), disabled: true },
      { label: 'Save', onClick: () => onAction('Save'), emphasis: true },
    ]}
  />
);
