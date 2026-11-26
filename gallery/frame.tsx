import { createUseStyles, ThemeProvider, type Theme } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router';

import { useThemeSetting } from '../src/theme/use-theme-setting.js';
import { exampleFor, moduleBySlug } from './data.js';
import { isThemeMessage, isThemeValue, type ThemeValue } from './messages.js';

const ThemeSync = ({ theme }: { theme: ThemeValue }) => {
  const setSetting = useThemeSetting()[1];
  useEffect(() => {
    setSetting(theme);
  }, [theme, setSetting]);
  return null;
};

const useStyle = createUseStyles((theme: Theme) => ({
  '@global': { body: { margin: 0 } },
  centered: {
    display: 'grid',
    placeItems: 'center',
    // A wide example (a form) shrinks to the frame instead of overflowing it.
    gridTemplateColumns: 'minmax(0, 1fr)',
    '& > *': { maxWidth: '100%' },
    minHeight: '100vh',
    padding: theme.space.xxxxl,
    boxSizing: 'border-box',
  },
}));

// Thumbnails ask for `fit=center`: a small example sits in the middle of the
// viewport instead of its top-left corner. Docs demos keep the normal flow.
const Centered = ({ children }: { children: ReactNode }) => (
  <div className={useStyle().centered} data-fit="center">
    {children}
  </div>
);

// Renders one docs example on its own: the site embeds it in an iframe so the
// example gets its own theme provider and cannot leak styles into the page.
export const Frame = () => {
  const { module: moduleSlug = '', example: exampleSlug = '' } = useParams();
  const [params] = useSearchParams();
  const rawTheme = params.get('theme');
  const centered = params.get('fit') === 'center';
  const [theme, setTheme] = useState<ThemeValue | null>(isThemeValue(rawTheme) ? rawTheme : null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data: unknown = event.data;
      if (isThemeMessage(data)) setTheme(data.theme);
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
        {centered ? (
          <Centered>
            <Component />
          </Centered>
        ) : (
          <Component />
        )}
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
