import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router';

import { useThemeSetting } from '../src/theme/use-theme-setting.js';
import { exampleFor, moduleBySlug } from './data.js';
import { isShellToPreview, isThemeValue, type ThemeValue } from './messages.js';

const ThemeSync = ({ theme }: { theme: ThemeValue }) => {
  const setSetting = useThemeSetting()[1];
  useEffect(() => {
    setSetting(theme);
  }, [theme, setSetting]);
  return null;
};

// Renders one docs example on its own: the site embeds it in an iframe so the
// example gets its own theme provider and cannot leak styles into the page.
export const Frame = () => {
  const { module: moduleSlug = '', example: exampleSlug = '' } = useParams();
  const [params] = useSearchParams();
  const rawTheme = params.get('theme');
  const [theme, setTheme] = useState<ThemeValue | null>(isThemeValue(rawTheme) ? rawTheme : null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data: unknown = event.data;
      if (isShellToPreview(data) && data.type === 'gallery:theme') setTheme(data.theme);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const mod = moduleBySlug(moduleSlug);
  const found = mod && exampleFor(mod, exampleSlug);
  if (!found) return <p>{`No example "${moduleSlug}/${exampleSlug}".`}</p>;

  const { Component } = found;
  return (
    <ThemeProvider identity="gallery-frame">
      <ToastProvider>
        {theme && <ThemeSync theme={theme} />}
        <Component />
      </ToastProvider>
    </ThemeProvider>
  );
};

// Shown when an example inside the frame links somewhere outside it: the frame
// must never render the shell. `home` is the frame the window was opened on.
export const FrameNavigatedAway = ({ home }: { home: string }) => {
  const { pathname } = useLocation();
  return (
    <div>
      <p>
        The example navigated to <code>{pathname}</code>
      </p>
      <Link to={home}>Back to the example</Link>
    </div>
  );
};
