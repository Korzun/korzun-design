import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { lightTheme } from '../../theme/theme.js';
import { Inline } from '../inline/index.js';
import { Stack } from '../stack/index.js';
import { Text } from './index.js';

type Props = ComponentProps<typeof Text>;

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
  title: 'Component / Text',
  args: {
    as: 'span',
    size: 'md',
    tone: 'primary',
    weight: 'regular',
    truncate: false,
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['span', 'p', 'div', 'label', 'strong', 'em'],
    },
    size: { control: 'select', options: sizes },
    tone: { control: 'select', options: tones },
    weight: { control: 'select', options: weights },
    truncate: { control: 'boolean' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <Text {...args}>The quick brown fox</Text>;

export const Sizes: Story<Props> = () => (
  <Stack gap="xs">
    {sizes.map((size) => (
      <Text key={size} as="div" size={size}>
        size {size}
      </Text>
    ))}
  </Stack>
);

export const Tones: Story<Props> = () => (
  <Stack gap="xs">
    {tones.map((tone) => (
      <Text key={tone} as="div" tone={tone}>
        tone {tone}
      </Text>
    ))}
  </Stack>
);

export const Weights: Story<Props> = () => (
  <Stack gap="xs">
    {weights.map((weight) => (
      <Text key={weight} as="div" weight={weight}>
        weight {weight}
      </Text>
    ))}
  </Stack>
);

const long = 'A very long title that cannot possibly fit in the space it has been given';

export const Truncate: Story<Props> = () => (
  <Stack gap="xl">
    <div style={{ width: '12rem', border: '1px dashed currentColor' }}>
      <Text truncate>{long}</Text>
    </div>
    <div style={{ width: '16rem', border: '1px dashed currentColor' }}>
      <Inline>
        <Text truncate>{long}</Text>
        <button type="button">Open</button>
      </Inline>
    </div>
  </Stack>
);

export const Recipes: Story<Props> = () => (
  <Stack gap="sm">
    <Text as="p">Body text inherits the surrounding size and colour.</Text>
    <Text as="p" size="sm" tone="muted">
      Meta line, 3 books, updated yesterday
    </Text>
    <Text as="p" size="xs" tone="faint">
      Caption under a figure
    </Text>
  </Stack>
);
