import { useStyle } from './style.js';

/** TopFade takes no props. */
export type TopFadeProps = Record<string, never>;

/**
 * Mobile-only scrim: a fixed frosted-glass layer at the top of the viewport that blurs
 * scrolling content beneath the device status bar and fades out below it (Safari-style).
 * Takes no props. Render once, only in the installed app (`isStandalone()`).
 */
export const TopFade = () => {
  const styles = useStyle();
  return <div className={styles.root} aria-hidden="true" />;
};
