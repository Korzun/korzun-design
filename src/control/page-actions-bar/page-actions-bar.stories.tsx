import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import type { PageActionItem } from '../page-actions-menu/index.js';
import { PageActionsBar } from './index.js';

type Args = Omit<ComponentProps<typeof PageActionsBar>, 'items'> & {
  onAction: (label: string) => void;
};

const actionItems = (onAction: (label: string) => void): PageActionItem[] => [
  { label: 'Edit', onClick: () => onAction('Edit'), primary: true },
  { label: 'Share', onClick: () => onAction('Share'), primary: true, align: 'leading' },
  { label: 'Duplicate', onClick: () => onAction('Duplicate') },
  { label: 'Archive', onClick: () => onAction('Archive'), disabled: true },
  { label: 'Delete', onClick: () => onAction('Delete'), danger: true, separatorBefore: true },
];

export default {
  title: 'Control / PageActionsBar',
  args: { actionsLabel: 'More…' },
  argTypes: { actionsLabel: { control: 'text' }, onAction: { control: 'action' } },
} satisfies StoryDefault<Args>;

export const Default: Story<Args> = ({ onAction, ...args }) => (
  <PageActionsBar {...args} items={actionItems(onAction)} />
);
