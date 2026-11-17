import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router';

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
import { resolveArgs, storyById, type StoryEntry } from './stories.js';

const ThemeSync = ({ theme }: { theme: ThemeValue }) => {
  const setSetting = useThemeSetting()[1];
  useEffect(() => {
    setSetting(theme);
  }, [theme, setSetting]);
  return null;
};

const defaultParent = (): Window | null => (window.parent === window ? null : window.parent);

type PreviewStoryProps = {
  entry: StoryEntry;
  initialArgs: Record<string, unknown>;
  initialTheme: ThemeValue | null;
  parentWindow: Window | null;
};

// Stateful part of the preview. The parent keys it on the story id, so a hash
// navigation to another story remounts it with state read from the new URL.
const PreviewStory = ({ entry, initialArgs, initialTheme, parentWindow }: PreviewStoryProps) => {
  const [overrides, setOverrides] = useState(initialArgs);
  const [theme, setTheme] = useState<ThemeValue | null>(initialTheme);

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

  const resolved = useMemo(
    () => resolveArgs(entry, overrides, onAction),
    [entry, overrides, onAction]
  );

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

export const Preview = ({ parentWindow = defaultParent() }: { parentWindow?: Window | null }) => {
  const id = useParams()['*'] ?? '';
  const [params] = useSearchParams();
  const rawTheme = params.get('theme');
  const entry = storyById(id);

  if (!entry) return <StoryNotFound id={id} />;
  return (
    <PreviewStory
      key={id}
      entry={entry}
      initialArgs={parseArgsParam(params.get('args'))}
      initialTheme={isThemeValue(rawTheme) ? rawTheme : null}
      parentWindow={parentWindow}
    />
  );
};

// Shown when a story inside the preview frame links somewhere outside the
// preview (a back button to "/", a nav item): the frame must never render the
// shell or a blank page. `home` is the preview the frame was opened on.
export const PreviewNavigatedAway = ({ home }: { home: string }) => {
  const { pathname } = useLocation();
  return (
    <div>
      <p>
        The story navigated to <code>{pathname}</code>
      </p>
      <Link to={home}>Back to the story</Link>
    </div>
  );
};
