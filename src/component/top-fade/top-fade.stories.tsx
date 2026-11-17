import type { Story, StoryDefault } from '@gallery/story';

import { createUseStyles, type Theme } from '../../theme/index.js';
import { TopFade } from './index.js';

const useStyle = createUseStyles((theme: Theme) => ({
  scroll: { height: '200vh', padding: theme.space.xxl, color: theme.color.text.muted },
}));

export default { title: 'Component / TopFade', sheet: false } satisfies StoryDefault;

export const Default: Story = () => {
  const styles = useStyle();
  return (
    <>
      <TopFade />
      <div className={styles.scroll}>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i}>Scroll content under the fade band, line {i + 1}.</p>
        ))}
      </div>
    </>
  );
};
