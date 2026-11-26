import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';

import type { ModuleInfo } from '../../scripts/docs-gen/types.js';
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
  // A frame's blank document paints white before the preview loads; keep it
  // transparent till then. Opacity, not `visibility: hidden` as the example
  // block uses: Chrome loads a hidden lazy iframe at once, which would fetch
  // every thumbnail on the overview up front.
  pending: { opacity: 0 },
}));

export type ThumbnailProps = {
  /** The module whose preview (`examples/preview.tsx`, else its first example) the thumbnail shows. */
  mod: ModuleInfo;
};

/** A lazy, non-interactive, scaled-down live render of a module's preview. */
export const Thumbnail = ({ mod }: ThumbnailProps) => {
  const styles = useStyle();
  const [theme, onLoad] = useFrameTheme();
  const [loaded, setLoaded] = useState(false);
  const first = mod.preview ?? mod.examples[0];
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
          desktop && styles.desktop,
          !loaded && styles.pending
        )}
        style={desktop ? { transform: `scale(${desktopScale ?? SCALE})` } : undefined}
        data-viewport={first.viewport}
        src={frameSrc(mod.slug, first.slug, theme, 'center')}
        title={`${mod.title}: ${first.title}`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        onLoad={() => {
          setLoaded(true);
          onLoad();
        }}
      />
    </div>
  );
};
