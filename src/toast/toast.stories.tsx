import type { Story, StoryDefault } from '@gallery/story';

import { Button } from '../control/button/index.js';
import { createUseStyles, type Theme } from '../theme/index.js';
import { useToast } from './index.js';

type Props = { message: string };

const useStyle = createUseStyles((theme: Theme) => ({
  row: { display: 'flex', flexWrap: 'wrap', gap: theme.space.xl },
}));

export default {
  title: 'Toast / Toast',
  args: { message: 'Saved your changes' },
  argTypes: { message: { control: 'text' } },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = ({ message }) => {
  const showToast = useToast();
  const styles = useStyle();
  return (
    <div className={styles.row}>
      <Button onClick={() => showToast(message, 'success')}>Success</Button>
      <Button onClick={() => showToast(message, 'error')}>Error</Button>
      <Button onClick={() => showToast(message, 'info')}>Info</Button>
    </div>
  );
};
