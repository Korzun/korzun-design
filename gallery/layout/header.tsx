import { Inline, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { createUseStyles, useThemeSetting, type Theme } from '@korzun/design/theme';
import cx from 'classnames';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';

import { siteData } from '../data.js';
import { postToWindow } from '../messages.js';
import { siteColumn } from './column.js';
import { TAP_TARGET } from './tap-target.js';

/**
 * The header's height on a phone, where it sticks: a 44px row for the name and
 * theme, a 44px row for the links, and the rule under them. Anchor targets
 * stop this far down so the header does not cover them.
 */
export const MOBILE_HEADER_HEIGHT = `calc(2 * ${TAP_TARGET} + 1px)`;

const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    padding: `${theme.space.lg} 0`,
    borderBottom: `1px solid ${theme.color.border.default}`,
    backgroundColor: theme.color.bg.card,
    // On a phone pages run to thousands of pixels: the header stays in reach.
    [theme.breakpoint.mobile]: {
      position: 'sticky',
      top: 0,
      zIndex: theme.zIndex.header,
      padding: 0,
    },
  },
  // One row on a desktop, wrapping when narrow: name and links on the left,
  // the theme on the right. On a phone, the name and theme share the first
  // row and the links take a second that scrolls sideways.
  inner: {
    ...siteColumn(theme),
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.space.xl,
    [theme.breakpoint.mobile]: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      gridTemplateAreas: '"brand theme" "nav nav"',
      gap: `0 ${theme.space.md}`,
    },
  },
  nav: {
    marginRight: 'auto',
    [theme.breakpoint.mobile]: {
      gridArea: 'nav',
      // Edge to edge, so the row scrolls under the column's gutters; the first
      // label still lines up with the name above it.
      margin: `0 -${theme.space.xxl}`,
      padding: `0 calc(${theme.space.xxl} - ${theme.space.xs})`,
      overflowX: 'auto',
      scrollbarWidth: 'none',
      // The links' own padding spaces them, so their hit areas touch.
      '& > *': { flexWrap: 'nowrap', gap: 0 },
    },
  },
  link: {
    color: theme.color.text.secondary,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    '&:hover': { color: theme.color.text.primary },
    '&.active': { color: theme.color.brand.default },
    [theme.breakpoint.mobile]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: TAP_TARGET,
      minWidth: TAP_TARGET,
      padding: `0 ${theme.space.xs}`,
    },
  },
  brand: {
    color: theme.color.text.primary,
    textDecoration: 'none',
    [theme.breakpoint.mobile]: {
      gridArea: 'brand',
      justifySelf: 'start',
      display: 'flex',
      alignItems: 'center',
      minHeight: TAP_TARGET,
    },
  },
  // The control keeps the library's `controlHeight`; on a phone each segment's
  // hit area reaches 44px tall with an invisible `::after`.
  theme: {
    [theme.breakpoint.mobile]: {
      gridArea: 'theme',
      '& [role="radio"]::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: TAP_TARGET,
        transform: 'translateY(-50%)',
      },
    },
  },
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
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <Inline gap="sm" align="baseline">
            <Text weight="semibold">@korzun/design</Text>
            <Text size="xs" tone="muted">
              {siteData.version}
            </Text>
          </Inline>
        </Link>
        <nav aria-label="Site" className={styles.nav}>
          <Inline gap="lg" wrap>
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
        </nav>
        <div className={styles.theme}>
          <SegmentedControl label="Theme" value={setting} options={THEMES} onChange={setSetting} />
        </div>
      </div>
    </header>
  );
};
