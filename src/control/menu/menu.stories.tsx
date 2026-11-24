import { FRUITS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { Inline } from '../../component/inline/index.js';
import { Stack } from '../../component/stack/index.js';
import { Text } from '../../component/text/index.js';
import { BooksIcon, HomeIcon, SettingsIcon } from '../../icon/index.js';
import { Button } from '../button/index.js';
import { Dialog } from '../dialog/index.js';
import { Select } from '../select/index.js';
import { Menu, type MenuItem, type MenuItemBase } from './index.js';

type Props = ComponentProps<typeof Menu>;

export default {
  title: 'Control / Menu',
  args: { surface: 'solid', side: 'bottom', align: 'start', ariaLabel: '' },
  argTypes: {
    surface: { control: 'select', options: ['solid', 'glass'] },
    side: { control: 'select', options: ['bottom', 'top'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    ariaLabel: { control: 'text' },
  },
} satisfies StoryDefault<Props>;

// The last action chosen, so a story shows that activation happened.
const useChosen = () => {
  const [chosen, setChosen] = useState('nothing yet');
  const action = (label: string, extra: Omit<MenuItemBase, 'label'> = {}): MenuItem => ({
    ...extra,
    label,
    onClick: () => setChosen(label),
  });
  return { chosen, action };
};

const Chosen = ({ chosen }: { chosen: string }) => <Text tone="secondary">Chosen: {chosen}</Text>;

export const Actions: Story<Props> = (args) => {
  const { chosen, action } = useChosen();
  return (
    <Stack gap="md">
      <Inline>
        <Menu
          {...args}
          trigger={(p) => <Button {...p}>Sort by</Button>}
          items={[action('Title'), action('Author'), action('Date added')]}
        />
      </Inline>
      <Chosen chosen={chosen} />
    </Stack>
  );
};

// Gallery hash routes, so following a link stays inside the gallery.
export const LinksWithIcons: Story<Props> = (args) => (
  <Inline>
    <Menu
      {...args}
      trigger={(p) => <Button {...p}>Go to</Button>}
      items={[
        { label: 'Menu actions story', to: '/story/control/menu/actions', Icon: HomeIcon },
        { label: 'All stories', to: '/all', Icon: BooksIcon },
        { label: 'Tokens', to: '/tokens', Icon: SettingsIcon, separatorBefore: true },
      ]}
    />
  </Inline>
);

export const DangerAndSeparator: Story<Props> = (args) => {
  const { chosen, action } = useChosen();
  return (
    <Stack gap="md">
      <Inline>
        <Menu
          {...args}
          trigger={(p) => <Button {...p}>Book</Button>}
          items={[
            action('Edit metadata'),
            action('Regenerate chapters'),
            action('Delete book', { danger: true, separatorBefore: true }),
          ]}
        />
      </Inline>
      <Chosen chosen={chosen} />
    </Stack>
  );
};

export const Disabled: Story<Props> = (args) => {
  const { chosen, action } = useChosen();
  return (
    <Stack gap="md">
      <Inline>
        <Menu
          {...args}
          trigger={(p) => <Button {...p}>Devices</Button>}
          items={[
            action('Sync now'),
            action('Clear device editions (0)', { disabled: true }),
            { label: 'Device settings', to: '/tokens', disabled: true },
            action('Forget device', { danger: true }),
          ]}
        />
      </Inline>
      <Chosen chosen={chosen} />
    </Stack>
  );
};

export const Glass: Story<Props> = (args) => {
  const { chosen, action } = useChosen();
  return (
    <Stack gap="md">
      <Inline justify="end">
        <Menu
          {...args}
          trigger={(p) => <Button {...p}>More</Button>}
          items={[action('Accept all'), action('Reject all', { danger: true })]}
        />
      </Inline>
      <Chosen chosen={chosen} />
    </Stack>
  );
};
Glass.args = { surface: 'glass', align: 'end' };

export const InsideDialog: Story<Props> = (args) => {
  const [open, setOpen] = useState(false);
  const { chosen, action } = useChosen();
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Edit book">
        <Stack gap="md">
          <Inline>
            <Menu
              {...args}
              trigger={(p) => <Button {...p}>Actions</Button>}
              items={[action('Rename'), action('Duplicate'), action('Delete', { danger: true })]}
            />
          </Inline>
          <Chosen chosen={chosen} />
        </Stack>
      </Dialog>
    </>
  );
};

// Check by hand: with the Select list open, Escape closes only the list; with
// the menu open, only the menu; then the Dialog.
export const Layers: Story<Props> = (args) => {
  const [open, setOpen] = useState(false);
  const [fruit, setFruit] = useState<string | undefined>();
  const { chosen, action } = useChosen();
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Layers">
        <Stack gap="md">
          <Select
            name="fruit"
            label="Fruit"
            layout="vertical"
            options={FRUITS}
            value={fruit}
            onChange={setFruit}
          />
          <Inline>
            <Menu
              {...args}
              trigger={(p) => <Button {...p}>Actions</Button>}
              items={[action('Peel'), action('Slice'), action('Discard', { danger: true })]}
            />
          </Inline>
          <Chosen chosen={chosen} />
        </Stack>
      </Dialog>
    </>
  );
};
