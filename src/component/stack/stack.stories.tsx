import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { lightTheme } from '../../theme/theme.js';
import { Stack } from './index.js';

type Props = ComponentProps<typeof Stack>;

const gaps = [...Object.keys(lightTheme.space), 'none'] as NonNullable<Props['gap']>[];

export default {
  title: 'Component / Stack',
  args: { gap: 'md', align: 'stretch', as: 'div' },
  argTypes: {
    gap: { control: 'select', options: gaps },
    align: { control: 'select', options: ['stretch', 'start', 'center', 'end'] },
    as: { control: 'select', options: ['div', 'section', 'ul', 'ol', 'li'] },
  },
} satisfies StoryDefault<Props>;

const box = { padding: '0.5rem', border: '1px solid currentColor' };

const Boxes = () => (
  <>
    <div style={box}>One</div>
    <div style={{ ...box, padding: '1rem' }}>Two</div>
    <div style={box}>Three</div>
  </>
);

export const Default: Story<Props> = (args) => (
  <Stack {...args}>
    <Boxes />
  </Stack>
);

export const Gaps: Story<Props> = () => (
  <Stack gap="xxl">
    {gaps.map((gap) => (
      <Stack key={gap} gap={gap} align="start">
        <div>gap: {gap}</div>
        <Boxes />
      </Stack>
    ))}
  </Stack>
);

export const Align: Story<Props> = () => (
  <Stack gap="xxl">
    {(['stretch', 'start', 'center', 'end'] as const).map((align) => (
      <Stack key={align} align={align}>
        <div>align: {align}</div>
        <Boxes />
      </Stack>
    ))}
  </Stack>
);

export const List: Story<Props> = (args) => (
  <Stack {...args} as="ul">
    <Stack as="li" gap="none">
      First
    </Stack>
    <Stack as="li" gap="none">
      Second
    </Stack>
    <Stack as="li" gap="none">
      Third
    </Stack>
  </Stack>
);
