import { createUseStyles, useThemeSetting, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

import type { ModuleInfo } from '../../scripts/docs-gen/types.js';
import type { ThemeValue } from '../messages.js';

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
}));

export type ThumbnailProps = {
  /** The module whose first example the thumbnail shows. */
  mod: ModuleInfo;
};

/** A lazy, non-interactive, scaled-down live render of a module's first example. */
export const Thumbnail = ({ mod }: ThumbnailProps) => {
  const styles = useStyle();
  const [setting] = useThemeSetting();
  // Until the frame loads, its URL follows the theme for free (a lazy frame
  // fetches nothing before it scrolls into view). Once loaded the URL stays
  // put, so a theme change arrives as a message instead of a reload.
  const [loadedTheme, setLoadedTheme] = useState<ThemeValue | null>(null);
  const first = mod.examples[0];
  if (!first) return <div className={styles.box} />;

  const theme = loadedTheme ?? setting;
  return (
    <div className={styles.box}>
      <iframe
        className={styles.frame}
        src={`${import.meta.env.BASE_URL}#/frame/${mod.slug}/${first.slug}?theme=${theme}&fit=center`}
        title={`${mod.title}: ${first.title}`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        onLoad={() => setLoadedTheme((t) => t ?? setting)}
      />
    </div>
  );
};
