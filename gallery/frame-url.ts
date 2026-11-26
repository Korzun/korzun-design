import { useThemeSetting } from '@korzun/design/theme';
import { useState } from 'react';

import type { ThemeValue } from './messages.js';

/** Width in px of a `@viewport mobile` example's frame: a common phone's CSS width. */
export const MOBILE_WIDTH = 390;

/**
 * The URL of one example frame. `fit: 'center'` centres a small example in the
 * viewport; overview thumbnails ask for it, docs demos keep the normal flow.
 */
export const frameSrc = (
  moduleSlug: string,
  exampleSlug: string,
  theme: ThemeValue,
  fit?: 'center'
): string =>
  `${import.meta.env.BASE_URL}#/frame/${moduleSlug}/${exampleSlug}?theme=${theme}${fit ? `&fit=${fit}` : ''}`;

/**
 * The theme for a frame's URL, and the iframe's `onLoad`. Until the frame
 * loads, its URL follows the theme for free (a lazy frame fetches nothing
 * before it scrolls into view). Once loaded the URL stays put, so a theme
 * change arrives as the header's `gallery:theme` message instead of a reload.
 */
export const useFrameTheme = (): [ThemeValue, () => void] => {
  const [setting] = useThemeSetting();
  const [loadedTheme, setLoadedTheme] = useState<ThemeValue | null>(null);
  return [loadedTheme ?? setting, () => setLoadedTheme((t) => t ?? setting)];
};
