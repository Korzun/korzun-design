import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { lightTheme } from '../../theme/theme.js';
import { Tag, type TagTone } from './index.js';

type Props = ComponentProps<typeof Tag>;

const tones = Object.keys(lightTheme.color.chip) as TagTone[];

export default {
  title: 'Component / Tag',
  args: { children: 'Medium', size: 'md', tone: 'subject' },
  argTypes: {
    children: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md'] },
    tone: { control: 'select', options: tones },
    onClick: { control: 'action' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = ({ onClick: _onClick, ...args }) => <Tag {...args} />;

export const Small: Story<Props> = ({ onClick: _onClick, ...args }) => <Tag {...args} />;
Small.args = { children: 'Small', size: 'sm' };

export const Clickable: Story<Props> = (args) => <Tag {...args} />;
Clickable.args = { children: 'Clickable' };

export const Tones: Story<Props> = ({ onClick }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gap: '0.5rem 1rem',
      justifyContent: 'start',
    }}
  >
    {tones.map((tone) => (
      <div key={tone} style={{ display: 'contents' }}>
        <span>
          <Tag tone={tone} onClick={onClick}>
            {tone}
          </Tag>
        </span>
        <span>
          <Tag tone={tone} size="sm" onClick={onClick}>
            {tone}
          </Tag>
        </span>
      </div>
    ))}
  </div>
);
