import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { createUseStyles, type Theme } from '../../theme/index.js';
import { ProgressIndicator } from './index.js';

type Props = ComponentProps<typeof ProgressIndicator>;

const useStyle = createUseStyles((theme: Theme) => ({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: theme.space.xl },
}));

export default {
  title: 'Component / ProgressIndicator',
  args: { value: 0.5, size: 48 },
  argTypes: {
    value: { control: 'number', min: 0, max: 1, step: 0.05 },
    size: { control: 'number' },
  },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = ({ value: _value, ...args }) => {
  const styles = useStyle();
  return (
    <div className={styles.row}>
      {[0.1, 0.25, 0.5, 0.75, 0.95].map((v) => (
        <ProgressIndicator key={v} {...args} value={v} ariaLabel={`${v * 100}%`} />
      ))}
    </div>
  );
};

export const Single: Story<Props> = (args) => (
  <ProgressIndicator {...args} ariaLabel={`${args.value * 100}%`} />
);
