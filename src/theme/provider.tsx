import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as JssThemeProvider } from 'react-jss';

import { Context, type ThemeSetting } from './context.js';
import { GlobalStyles } from './global-styles.js';
import { darkTheme, lightTheme, type ThemeMode } from './theme.js';

const STORAGE_PREFIX = 'theme-setting:';
const DARK_QUERY = '(prefers-color-scheme: dark)';

// The appearance choice belongs to the user the consumer identifies via the
// `identity` prop, not the device: it is stored under a per-identity key so
// switching to `null` (signed out) drops back to 'auto' (the sign-in screen
// never inherits a previous user's dark choice) and switching back restores
// that user's own choice. A `null` identity has no key, so nothing is stored.
const storageKey = (identity: string | null): string | null =>
  identity === null ? null : `${STORAGE_PREFIX}${identity}`;

const readSetting = (identity: string | null): ThemeSetting => {
  const key = storageKey(identity);
  const stored = key === null ? null : localStorage.getItem(key);
  return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto';
};

export type ThemeProviderProps = {
  /** The app. */
  children: ReactNode;
  /**
   * Whose light, dark or auto choice this is, for example the signed-in user's id. The choice is saved per identity in `localStorage` and restored when it comes back; with `null`, nothing is saved and the mode is `'auto'`.
   */
  identity?: string | null;
};
export const ThemeProvider = ({ children, identity = null }: ThemeProviderProps) => {
  const [scope, setScope] = useState(identity);
  const [setting, setSettingState] = useState<ThemeSetting>(() => readSetting(identity));
  const [systemDark, setSystemDark] = useState<boolean>(
    () => window.matchMedia(DARK_QUERY).matches
  );

  // Re-scope whenever the consumer's identity changes: on sign-in restore that
  // user's saved choice; on sign-out (identity becomes null) the setting falls
  // back to 'auto'. Done during render rather than in an effect so no frame is
  // ever painted with the previous identity's setting.
  if (scope !== identity) {
    setScope(identity);
    setSettingState(readSetting(identity));
  }

  useEffect(() => {
    const mql = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const setSetting = useCallback(
    (next: ThemeSetting) => {
      const key = storageKey(identity);
      if (key !== null) localStorage.setItem(key, next);
      setSettingState(next);
    },
    [identity]
  );

  const resolvedMode: ThemeMode = setting === 'auto' ? (systemDark ? 'dark' : 'light') : setting;
  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({ setting, setSetting, resolvedMode }),
    [setting, setSetting, resolvedMode]
  );

  return (
    <Context.Provider value={value}>
      <JssThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </JssThemeProvider>
    </Context.Provider>
  );
};
