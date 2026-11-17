import type { Story, StoryDefault } from '@gallery/story';

import { PageActionsMenu, type PageActionItem } from './index.js';

type Args = { onAction: (label: string) => void };

const actionItems = (onAction: (label: string) => void): PageActionItem[] => [
  { label: 'Edit', onClick: () => onAction('Edit'), primary: true },
  { label: 'Share', onClick: () => onAction('Share'), primary: true, align: 'leading' },
  { label: 'Duplicate', onClick: () => onAction('Duplicate') },
  { label: 'Archive', onClick: () => onAction('Archive'), disabled: true },
  { label: 'Delete', onClick: () => onAction('Delete'), danger: true, separatorBefore: true },
];

export default {
  title: 'Control / PageActionsMenu',
  argTypes: { onAction: { control: 'action' } },
} satisfies StoryDefault<Args>;

export const Default: Story<Args> = ({ onAction }) => (
  <PageActionsMenu items={actionItems(onAction)} />
);
