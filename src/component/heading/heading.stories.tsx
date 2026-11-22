import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { lightTheme } from '../../theme/theme.js';
import { Stack } from '../stack/index.js';
import { Heading } from './index.js';

type Props = ComponentProps<typeof Heading>;

const sizes = Object.keys(lightTheme.fontSize) as NonNullable<Props['size']>[];
const tones = [
  'primary',
  'secondary',
  'muted',
  'faint',
  'description',
  'danger',
  'success',
] as NonNullable<Props['tone']>[];
const weights = Object.keys(lightTheme.fontWeight) as NonNullable<Props['weight']>[];

export default {
  title: 'Component / Heading',
  args: {
    level: 2,
    size: 'xl',
    tone: 'primary',
    weight: 'bold',
    truncate: false,
  },
  argTypes: {
    size: { control: 'select', options: sizes },
    tone: { control: 'select', options: tones },
    weight: { control: 'select', options: weights },
    truncate: { control: 'boolean' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <Heading {...args}>Library</Heading>;

export const Levels: Story<Props> = () => (
  <Stack gap="sm">
    <Heading level={1}>Level 1</Heading>
    <Heading level={2}>Level 2</Heading>
    <Heading level={3}>Level 3</Heading>
    <Heading level={4}>Level 4</Heading>
  </Stack>
);

export const Overrides: Story<Props> = () => (
  <div style={{ padding: '1rem', border: '1px solid currentColor' }}>
    <Heading level={2} size="sm" weight="medium" tone="muted">
      Section title in a card
    </Heading>
  </div>
);

export const Truncate: Story<Props> = () => (
  <div style={{ width: '12rem', border: '1px dashed currentColor' }}>
    <Heading level={3} truncate>
      A very long heading that cannot possibly fit in the space it has been given
    </Heading>
  </div>
);
