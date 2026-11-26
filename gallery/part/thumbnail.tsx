import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';

import type { ModuleInfo } from '../../scripts/docs-gen/types.js';
import { frameSrc, MOBILE_WIDTH, useFrameTheme } from '../frame-url.js';

// The frame lays out larger than the box and is scaled down to fit, so the
// example renders at a realistic width and reads as a miniature.
const SCALE = 0.6;

const useStyle = createUseStyles((theme: Theme) => ({
  box: {
    position: 'relative',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.color.border.light}`,
    backgroundColor: theme.color.bg.page,
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${100 / SCALE}%`,
    height: `${100 / SCALE}%`,
    border: 0,
    transform: `scale(${SCALE})`,
    transformOrigin: 'top left',
    pointerEvents: 'none',
  },
  // A `@viewport mobile` example lays out at phone width, centred in the box.
  mobile: {
    width: `${MOBILE_WIDTH}px`,
    left: '50%',
    transform: `translateX(-50%) scale(${SCALE})`,
    transformOrigin: 'top center',
  },
}));

export type ThumbnailProps = {
  /** The module whose first example the thumbnail shows. */
  mod: ModuleInfo;
};

/** A lazy, non-interactive, scaled-down live render of a module's first example. */
export const Thumbnail = ({ mod }: ThumbnailProps) => {
  const styles = useStyle();
  const [theme, onLoad] = useFrameTheme();
  const first = mod.examples[0];
  if (!first) return <div className={styles.box} />;

  return (
    <div className={styles.box}>
      <iframe
        className={cx(styles.frame, first.viewport === 'mobile' && styles.mobile)}
        data-viewport={first.viewport}
        src={frameSrc(mod.slug, first.slug, theme, 'center')}
        title={`${mod.title}: ${first.title}`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        onLoad={onLoad}
      />
    </div>
  );
};
