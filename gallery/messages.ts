import { isValidElement } from 'react';

export type ThemeValue = 'light' | 'dark' | 'auto';

export type ShellToPreview =
  | { type: 'gallery:args'; args: Record<string, unknown> }
  | { type: 'gallery:theme'; theme: ThemeValue };

export type PreviewToShell =
  | { type: 'gallery:ready' }
  | { type: 'gallery:action'; name: string; args: unknown[] };

const isRecord = (data: unknown): data is Record<string, unknown> =>
  typeof data === 'object' && data !== null && !Array.isArray(data);

export const isThemeValue = (value: unknown): value is ThemeValue =>
  value === 'light' || value === 'dark' || value === 'auto';

export const isShellToPreview = (data: unknown): data is ShellToPreview => {
  if (!isRecord(data)) return false;
  if (data.type === 'gallery:args') return isRecord(data.args);
  if (data.type === 'gallery:theme') return isThemeValue(data.theme);
  return false;
};

export const isPreviewToShell = (data: unknown): data is PreviewToShell => {
  if (!isRecord(data)) return false;
  if (data.type === 'gallery:ready') return true;
  if (data.type === 'gallery:action')
    return typeof data.name === 'string' && Array.isArray(data.args);
  return false;
};

const serializeValue = (value: unknown): unknown => {
  if (value === undefined) return null;
  if (value instanceof Event) return { type: value.type };
  // React's synthetic events are not Events; they carry the native one.
  if (isRecord(value) && 'nativeEvent' in value && typeof value.type === 'string')
    return { type: value.type };
  if (isValidElement(value)) return '<Element>';
  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : JSON.parse(json);
  } catch {
    return String(value);
  }
};

export const serializeActionArgs = (args: unknown[]): unknown[] => args.map(serializeValue);

export const postToWindow = (target: Window, message: ShellToPreview | PreviewToShell): void => {
  target.postMessage(message, window.location.origin);
};

// A control the user cleared is stored as `null` in ?args= (JSON drops
// `undefined`, which would let the default snap back); render it as undefined.
export const restoreClearedArgs = (overrides: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(overrides).map(([key, value]) => [key, value === null ? undefined : value])
  );

export const parseArgsParam = (raw: string | null): Record<string, unknown> => {
  if (raw === null) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
};
