import { FRUITS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { Stack } from '../../component/stack/index.js';
import { Button } from '../button/index.js';
import { Select } from '../select/index.js';
import { TextInput } from '../text-input/index.js';
import { Dialog } from './index.js';

type Props = ComponentProps<typeof Dialog>;

export default {
  title: 'Control / Dialog',
  args: { title: 'Fixes waiting' },
  argTypes: { title: { control: 'text' } },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = ({ open: _open, onClose: _onClose, ...args }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog {...args} open={open} onClose={() => setOpen(false)}>
        A dialog with no footer. Dismiss it with Escape or a click on the backdrop.
      </Dialog>
    </>
  );
};

export const WithFooter: Story<Props> = ({ open: _open, onClose: _onClose, ...args }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button type="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        Footer buttons default to the modal radius.
      </Dialog>
    </>
  );
};

export const NotDismissable: Story<Props> = ({ open: _open, onClose: _onClose, ...args }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
    }, 1500);
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        canDismiss={false}
        footer={
          <Button type="primary" loading={saving} onClick={save}>
            Save
          </Button>
        }
      >
        Escape and the backdrop are ignored (canDismiss is false) until Save finishes.
      </Dialog>
    </>
  );
};

export const WithForm: Story<Props> = ({ open: _open, onClose: _onClose, ...args }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | undefined>('');
  const [fruit, setFruit] = useState<string | undefined>();
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button type="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <Stack gap="md">
          <TextInput name="name" label="Name" layout="vertical" value={name} onChange={setName} />
          <Select
            name="fruit"
            label="Fruit"
            layout="vertical"
            options={FRUITS}
            value={fruit}
            onChange={setFruit}
          />
        </Stack>
      </Dialog>
    </>
  );
};
