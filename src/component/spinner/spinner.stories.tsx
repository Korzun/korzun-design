import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { lightTheme } from '../../theme/theme.js';
import { Inline } from '../inline/index.js';
import { Stack } from '../stack/index.js';
import { Text } from '../text/index.js';
import { Spinner } from './index.js';

type Props = ComponentProps<typeof Spinner>;

const sizes = Object.keys(lightTheme.fontSize) as NonNullable<Props['size']>[];

export default {
  title: 'Component / Spinner',
  args: { size: 'lg', label: 'Loading', decorative: false },
  argTypes: {
    size: { control: 'select', options: sizes },
    label: { control: 'text' },
    decorative: { control: 'boolean' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <Spinner {...args} />;

export const Sizes: Story<Props> = () => (
  <Inline gap="md" align="center">
    {sizes.map((size) => (
      <Spinner key={size} size={size} />
    ))}
  </Inline>
);

export const Labelled: Story<Props> = () => <Spinner size="xl" label="Loading books" />;

export const DecorativeInline: Story<Props> = () => (
  <Inline gap="xs" align="center">
    <Spinner decorative />
    <Text>Loading books</Text>
  </Inline>
);

export const LoadingPage: Story<Props> = () => (
  <Stack align="center" gap="sm">
    <Spinner size="xxl" label="Loading your library" />
    <Text tone="muted">Loading your library</Text>
  </Stack>
);
