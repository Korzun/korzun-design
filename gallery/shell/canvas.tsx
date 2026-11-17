import type { StoryEntry } from '@gallery/stories';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useEffect, useRef, type ReactElement } from 'react';

import { isPreviewToShell, postToWindow, type ThemeValue } from '../messages.js';
import type { WidthPreset } from './toolbar.js';

const useStyle = createUseStyles((theme: Theme) => ({
  canvas: { flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', overflow: 'auto' },
  frame: { border: `1px solid ${theme.color.border.default}`, boxSizing: 'border-box' },
}));

type CanvasProps = {
  entry: StoryEntry;
  theme: ThemeValue;
  width: WidthPreset;
  overrides: Record<string, unknown>;
  onAction: (name: string, args: unknown[]) => void;
};

export const Canvas = ({ entry, theme, width, overrides, onAction }: CanvasProps): ReactElement => {
  const styles = useStyle();
  const frame = useRef<HTMLIFrameElement>(null);
  // The src carries the state for a fresh load; live changes go by message,
  // because a query-only src change does not remount the preview.
  const latest = useRef({ theme, overrides, onAction });
  useEffect(() => {
    latest.current = { theme, overrides, onAction };
  });

  const pushArgs = () => {
    const target = frame.current?.contentWindow;
    if (target) postToWindow(target, { type: 'gallery:args', args: latest.current.overrides });
  };
  const pushTheme = () => {
    const target = frame.current?.contentWindow;
    if (target) postToWindow(target, { type: 'gallery:theme', theme: latest.current.theme });
  };
  const push = () => {
    pushArgs();
    pushTheme();
  };
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const source = frame.current?.contentWindow;
      if (source && event.source !== null && event.source !== source) return;
      const data: unknown = event.data;
      if (!isPreviewToShell(data)) return;
      if (data.type === 'gallery:ready') push();
      else latest.current.onAction(data.name, data.args);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(pushArgs, [overrides]);
  useEffect(pushTheme, [theme]);

  const src = `${import.meta.env.BASE_URL}#/preview/${entry.id}?theme=${theme}&args=${encodeURIComponent(JSON.stringify(overrides))}`;

  return (
    <div className={styles.canvas}>
      <iframe
        ref={frame}
        className={styles.frame}
        title="Story preview"
        src={src}
        style={{ width: width === 'fill' ? '100%' : `${width}px`, height: '100%' }}
      />
    </div>
  );
};
