import type { StoryEntry } from '@gallery/stories';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useEffect, useRef, useState, type ReactElement } from 'react';

import { isPreviewToShell, postToWindow, type ThemeValue } from '../messages.js';
import type { WidthPreset } from './toolbar.js';

// The frame is centred with auto margins, not justify-content, and never
// shrinks (flex-shrink: 0 inline, beside the width): a preset wider than the canvas then overflows to the right and
// scrolls, instead of being squeezed or clipped on the left.
const useStyle = createUseStyles((theme: Theme) => ({
  canvas: { flex: 1, minWidth: 0, display: 'flex', overflow: 'auto' },
  frame: {
    margin: '0 auto',
    border: `1px solid ${theme.color.border.default}`,
    boxSizing: 'border-box',
  },
}));

type CanvasProps = {
  entry: StoryEntry;
  theme: ThemeValue;
  /** Theme for the first load's src, when it differs from `theme` on mount (a deep link). */
  initialTheme?: ThemeValue;
  width: WidthPreset;
  overrides: Record<string, unknown>;
  onAction: (name: string, args: unknown[]) => void;
};

export const Canvas = ({
  entry,
  theme,
  initialTheme = theme,
  width,
  overrides,
  onAction,
}: CanvasProps): ReactElement => {
  const styles = useStyle();
  const frame = useRef<HTMLIFrameElement>(null);
  // The src carries the state for the first load only and is frozen at mount:
  // a fragment-only src change is a same-document navigation that pushes a
  // top-level history entry. Live changes go by message, the ready handshake
  // pushes the current state, and the canvas remounts per story.
  const [src] = useState(
    () =>
      `${import.meta.env.BASE_URL}#/preview/${entry.id}?theme=${initialTheme}&args=${encodeURIComponent(JSON.stringify(overrides))}`
  );
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

  return (
    <div className={styles.canvas}>
      <iframe
        ref={frame}
        className={styles.frame}
        title="Story preview"
        src={src}
        style={{
          width: width === 'fill' ? '100%' : `${width}px`,
          height: '100%',
          flexShrink: 0,
        }}
      />
    </div>
  );
};
