import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { useThemeSetting } from '../src/theme/use-theme-setting.js';
import {
  isShellToPreview,
  isThemeValue,
  parseArgsParam,
  postToWindow,
  serializeActionArgs,
  type ThemeValue,
} from './messages.js';
import { StoryNotFound } from './not-found.js';
import { resolveArgs, storyById } from './stories.js';

const ThemeSync = ({ theme }: { theme: ThemeValue }) => {
  const setSetting = useThemeSetting()[1];
  useEffect(() => {
    setSetting(theme);
  }, [theme, setSetting]);
  return null;
};

const defaultParent = (): Window | null => (window.parent === window ? null : window.parent);

export const Preview = ({ parentWindow = defaultParent() }: { parentWindow?: Window | null }) => {
  const id = useParams()['*'] ?? '';
  const [params] = useSearchParams();
  const rawTheme = params.get('theme');
  const rawArgs = params.get('args');

  const [overrides, setOverrides] = useState(() => parseArgsParam(rawArgs));
  const [theme, setTheme] = useState<ThemeValue | null>(isThemeValue(rawTheme) ? rawTheme : null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data: unknown = event.data;
      if (!isShellToPreview(data)) return;
      if (data.type === 'gallery:args') setOverrides(data.args);
      else setTheme(data.theme);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (parentWindow) postToWindow(parentWindow, { type: 'gallery:ready' });
  }, [parentWindow]);

  const onAction = useCallback(
    (name: string, args: unknown[]) => {
      if (parentWindow)
        postToWindow(parentWindow, {
          type: 'gallery:action',
          name,
          args: serializeActionArgs(args),
        });
    },
    [parentWindow]
  );

  const entry = storyById(id);
  const resolved = useMemo(
    () => (entry ? resolveArgs(entry, overrides, onAction) : null),
    [entry, overrides, onAction]
  );

  if (!entry || !resolved) return <StoryNotFound id={id} />;
  const Story = entry.component;
  return (
    <ThemeProvider identity="gallery-preview">
      <ToastProvider>
        {theme && <ThemeSync theme={theme} />}
        <Story {...resolved} />
      </ToastProvider>
    </ThemeProvider>
  );
};
