import { Inline, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { createUseStyles, useThemeSetting, type Theme } from '@korzun/design/theme';
import { useEffect } from 'react';
import { Link, NavLink } from 'react-router';

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

const LINKS = [
  { to: '/', label: 'Components', end: true },
  { to: '/components/icon', label: 'Icons', end: false },
  { to: '/recipes', label: 'Recipes', end: false },
  { to: '/tokens', label: 'Tokens', end: false },
  { to: '/changelog', label: 'Changelog', end: false },
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
            {LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={styles.link}>
                <Text size="md">{label}</Text>
              </NavLink>
            ))}
          </Inline>
        </Inline>
        <SegmentedControl label="Theme" value={setting} options={THEMES} onChange={setSetting} />
      </Inline>
    </header>
  );
};
