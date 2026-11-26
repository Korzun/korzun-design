import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';

import type { ExampleOwner } from '../data.js';
import { DESKTOP_WIDTH, frameSrc, MOBILE_WIDTH, useFrameTheme } from '../frame-url.js';

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
  // A `@viewport desktop` preview lays out past the mobile breakpoint and is
  // scaled by the box's measured width (inline transform), so it fills the box.
  desktop: {
    width: `${DESKTOP_WIDTH}px`,
    height: `${(DESKTOP_WIDTH * 9) / 16}px`,
  },
}));

export type ThumbnailProps = {
  /** The module or recipe whose preview (`examples/preview.tsx`, else its first example) the thumbnail shows. */
  owner: ExampleOwner;
};

/** A lazy, non-interactive, scaled-down live render of a module's preview or a recipe's first example. */
export const Thumbnail = ({ owner }: ThumbnailProps) => {
  const styles = useStyle();
  const [theme, onLoad] = useFrameTheme();
  const first = owner.preview ?? owner.examples[0];
  const boxRef = useRef<HTMLDivElement>(null);
  const [desktopScale, setDesktopScale] = useState<number | null>(null);
  const desktop = first?.viewport === 'desktop';
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!desktop || !box) return;
    const fit = () => setDesktopScale(box.clientWidth / DESKTOP_WIDTH);
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [desktop]);
  if (!first) return <div className={styles.box} />;

  return (
    <div className={styles.box} ref={boxRef}>
      <iframe
        className={cx(
          styles.frame,
          first.viewport === 'mobile' && styles.mobile,
          desktop && styles.desktop
        )}
        style={desktop ? { transform: `scale(${desktopScale ?? SCALE})` } : undefined}
        data-viewport={first.viewport}
        src={frameSrc(owner.framePath, first.slug, theme, 'center')}
        title={`${owner.title}: ${first.title}`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        onLoad={onLoad}
      />
    </div>
  );
};
