import { ThemeSetting } from '@korzun/design/component';
import { createUseStyles, ThemeProvider, type Theme } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router';

import { ComponentsPage } from './page/components';
import { ControlsPage } from './page/controls';
import { IconsPage } from './page/icons';
import { TokensPage } from './page/tokens';

const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: theme.fontFamily.body,
    color: theme.color.text.primary,
    backgroundColor: theme.color.bg.page,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.md,
    width: 180,
    padding: theme.space.xxl,
    borderRight: `1px solid ${theme.color.border.default}`,
    flexShrink: 0,
  },
  brand: { fontWeight: theme.fontWeight.bold, marginBottom: theme.space.xl },
  link: {
    padding: `${theme.space.md} ${theme.space.xl}`,
    borderRadius: theme.radius.md,
    color: theme.color.text.secondary,
    textDecoration: 'none',
    '&:hover': { backgroundColor: theme.color.bg.hover },
  },
  active: { backgroundColor: theme.color.bg.selected, color: theme.color.text.primary },
  content: {
    flex: 1,
    minWidth: 0,
    padding: theme.space.xxxxl,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.xxxl,
  },
}));

const LINKS = [
  { to: '/tokens', label: 'Tokens' },
  { to: '/controls', label: 'Controls' },
  { to: '/components', label: 'Components' },
  { to: '/icons', label: 'Icons' },
];

export function GalleryRoutes() {
  const styles = useStyle();
  return (
    <div className={styles.root}>
      <nav className={styles.sidebar}>
        <div className={styles.brand}>@korzun/design</div>
        {LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.content}>
        <ThemeSetting />
        <Routes>
          <Route path="/" element={<Navigate to="/tokens" replace />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/controls" element={<ControlsPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/icons" element={<IconsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider identity="gallery">
        <ToastProvider>
          <GalleryRoutes />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
