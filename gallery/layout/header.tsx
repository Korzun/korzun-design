import { Inline, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { createUseStyles, useThemeSetting, type Theme } from '@korzun/design/theme';
import cx from 'classnames';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';

import { siteData } from '../data.js';
import { postToWindow } from '../messages.js';
import { siteColumn } from './column.js';

const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    padding: `${theme.space.lg} 0`,
    borderBottom: `1px solid ${theme.color.border.default}`,
    backgroundColor: theme.color.bg.card,
  },
  inner: siteColumn(theme),
  link: {
    color: theme.color.text.secondary,
    textDecoration: 'none',
    '&:hover': { color: theme.color.text.primary },
    '&.active': { color: theme.color.brand.default },
  },
  brand: { color: theme.color.text.primary, textDecoration: 'none' },
}));

const under = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

/** Each section's link and the routes it is active on. */
export const NAV_LINKS: { to: string; label: string; active: (pathname: string) => boolean }[] = [
  {
    to: '/',
    label: 'Components',
    // The overview and every component page but icons, which has its own link.
    active: (p) => p === '/' || (under(p, '/components') && !under(p, '/components/icon')),
  },
  { to: '/components/icon', label: 'Icons', active: (p) => under(p, '/components/icon') },
  { to: '/recipes', label: 'Recipes', active: (p) => under(p, '/recipes') },
  { to: '/guides', label: 'Guides', active: (p) => under(p, '/guides') },
  { to: '/tokens', label: 'Tokens', active: (p) => under(p, '/tokens') },
  { to: '/changelog', label: 'Changelog', active: (p) => under(p, '/changelog') },
];

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
] as const;

/** The site header: name, section links and the theme toggle shared with every example frame. */
export const Header = () => {
  const styles = useStyle();
  const [setting, setSetting] = useThemeSetting();
  const { pathname } = useLocation();

  // Example frames run their own ThemeProvider; tell each one about the change.
  useEffect(() => {
    for (const frame of document.querySelectorAll('iframe'))
      if (frame.contentWindow)
        postToWindow(frame.contentWindow, { type: 'gallery:theme', theme: setting });
  }, [setting]);

  return (
    <header className={styles.root}>
      <Inline justify="between" gap="xl" wrap className={styles.inner}>
        <Inline gap="xl" wrap>
          <Link to="/" className={styles.brand}>
            <Inline gap="sm" align="baseline">
              <Text weight="semibold">@korzun/design</Text>
              <Text size="xs" tone="muted">
                {siteData.version}
              </Text>
            </Inline>
          </Link>
          <Inline as="nav" gap="lg" wrap aria-label="Site">
            {NAV_LINKS.map(({ to, label, active }) => {
              const current = active(pathname);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cx(styles.link, current && 'active')}
                  // `page` on the section's own route, `true` on a page inside the section.
                  aria-current={current ? (pathname === to ? 'page' : 'true') : undefined}
                >
                  <Text size="md">{label}</Text>
                </Link>
              );
            })}
          </Inline>
        </Inline>
        <SegmentedControl label="Theme" value={setting} options={THEMES} onChange={setSetting} />
      </Inline>
    </header>
  );
};
