import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { SettingsIcon } from '../../icon/settings.js';
import { Button } from '../button/index.js';
import { ConfirmModal } from './index.js';

type Props = ComponentProps<typeof ConfirmModal>;

export default {
  title: 'Control / ConfirmModal',
  args: { title: 'Confirm action', confirmText: 'Confirm', danger: false },
  argTypes: {
    title: { control: 'text' },
    confirmText: { control: 'text' },
    danger: { control: 'boolean' },
    onConfirm: { control: 'action' },
    onCancel: { control: 'action' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = ({ onCancel, onConfirm, ...args }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <ConfirmModal
        {...args}
        isOpen={open}
        onCancel={() => {
          setOpen(false);
          onCancel?.();
        }}
        onConfirm={() => {
          setOpen(false);
          onConfirm?.();
        }}
      >
        Are you sure?
      </ConfirmModal>
    </>
  );
};

export const Danger: Story<Props> = ({ onCancel, onConfirm, ...args }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button danger onClick={() => setOpen(true)}>
        Open danger modal
      </Button>
      <ConfirmModal
        {...args}
        isOpen={open}
        icon={SettingsIcon}
        onCancel={() => {
          setOpen(false);
          onCancel?.();
        }}
        onConfirm={() => {
          setOpen(false);
          onConfirm?.();
        }}
      >
        This cannot be undone.
      </ConfirmModal>
    </>
  );
};
Danger.args = { title: 'Delete everything', danger: true, confirmText: 'Delete' };
