import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { lightTheme } from '../../theme/theme.js';
import { Stack } from '../stack/index.js';
import { Inline } from './index.js';

type Props = ComponentProps<typeof Inline>;

const gaps = [...Object.keys(lightTheme.space), 'none'] as NonNullable<Props['gap']>[];

export default {
  title: 'Component / Inline',
  args: { gap: 'sm', align: 'center', justify: 'start', wrap: false, as: 'div' },
  argTypes: {
    gap: { control: 'select', options: gaps },
    align: { control: 'select', options: ['center', 'start', 'end', 'baseline', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
    wrap: { control: 'boolean' },
    as: { control: 'select', options: ['div', 'span', 'ul', 'ol', 'li', 'nav'] },
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
  <Inline {...args}>
    <Boxes />
  </Inline>
);

export const Gaps: Story<Props> = () => (
  <Stack gap="xxl">
    {gaps.map((gap) => (
      <Stack key={gap} gap="xs">
        <div>gap: {gap}</div>
        <Inline gap={gap}>
          <Boxes />
        </Inline>
      </Stack>
    ))}
  </Stack>
);

export const Justify: Story<Props> = () => (
  <Stack gap="xxl">
    {(['start', 'center', 'end', 'between'] as const).map((justify) => (
      <Stack key={justify} gap="xs">
        <div>justify: {justify}</div>
        <div style={{ width: '100%', border: '1px dashed currentColor' }}>
          <Inline justify={justify}>
            <Boxes />
          </Inline>
        </div>
      </Stack>
    ))}
  </Stack>
);

export const Align: Story<Props> = () => (
  <Stack gap="xxl">
    {(['center', 'start', 'end', 'baseline', 'stretch'] as const).map((align) => (
      <Stack key={align} gap="xs">
        <div>align: {align}</div>
        <Inline align={align}>
          <div style={box}>Short</div>
          <div style={{ ...box, padding: '1.5rem', fontSize: '1.5rem' }}>Tall</div>
          <div style={box}>Short</div>
        </Inline>
      </Stack>
    ))}
  </Stack>
);

export const Wrap: Story<Props> = () => (
  <div style={{ width: '12rem', border: '1px dashed currentColor' }}>
    <Inline wrap>
      <Boxes />
      <Boxes />
    </Inline>
  </div>
);
