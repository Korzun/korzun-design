import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { SearchIcon } from '../../icon/search.js';
import { SettingsIcon } from '../../icon/settings.js';
import { Button } from './index.js';

type Props = ComponentProps<typeof Button>;

export default {
  title: 'Control / Button',
  args: { children: 'Save', type: 'default', disabled: false, loading: false, danger: false },
  argTypes: {
    children: { control: 'text' },
    type: { control: 'select', options: ['default', 'primary', 'text', 'link', 'dashed'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    danger: { control: 'boolean' },
    onClick: { control: 'action' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <Button {...args} />;
export const Primary: Story<Props> = (args) => <Button {...args} type="primary" />;
export const Success: Story<Props> = (args) => <Button {...args} danger={false} success />;
export const WithIcons: Story<Props> = (args) => (
  <Button {...args} prefix={SearchIcon} suffix={SettingsIcon} />
);
