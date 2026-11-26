export type ThemeValue = 'light' | 'dark' | 'auto';

/** The site posts this to every example frame when the reader switches theme. */
export type ThemeMessage = { type: 'gallery:theme'; theme: ThemeValue };

const isRecord = (data: unknown): data is Record<string, unknown> =>
  typeof data === 'object' && data !== null && !Array.isArray(data);

export const isThemeValue = (value: unknown): value is ThemeValue =>
  value === 'light' || value === 'dark' || value === 'auto';

export const isThemeMessage = (data: unknown): data is ThemeMessage =>
  isRecord(data) && data.type === 'gallery:theme' && isThemeValue(data.theme);

/** An example frame posts this to the site whenever its content height changes. */
export type HeightMessage = { type: 'gallery:height'; height: number };

export const isHeightMessage = (data: unknown): data is HeightMessage =>
  isRecord(data) &&
  data.type === 'gallery:height' &&
  typeof data.height === 'number' &&
  Number.isFinite(data.height) &&
  data.height >= 0;

export const postToWindow = (target: Window, message: ThemeMessage | HeightMessage): void => {
  target.postMessage(message, window.location.origin);
};
