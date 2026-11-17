import { createUseStyles, ThemeProvider, type Theme } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import type { ReactElement } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router';

import { AllStories } from './all.js';
import { TokensPage } from './page/tokens.js';
import { Preview } from './preview.js';
import { Sidebar } from './shell/sidebar.js';
import { StoryView } from './shell/story-view.js';
import { stories } from './stories.js';

const useStyle = createUseStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    fontFamily: theme.fontFamily.body,
    color: theme.color.text.primary,
    backgroundColor: theme.color.bg.page,
  },
  content: {
    flex: 1,
    minWidth: 0,
    overflowY: 'auto',
    padding: theme.space.xxxxl,
    boxSizing: 'border-box',
  },
}));

const ShellBody = (): ReactElement => {
  const styles = useStyle();
  return (
    <div className={styles.root}>
      <Sidebar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

const Shell = (): ReactElement => (
  <ThemeProvider identity="gallery">
    <ToastProvider>
      <ShellBody />
    </ToastProvider>
  </ThemeProvider>
);

export const GalleryRoutes = (): ReactElement => (
  <Routes>
    <Route path="/" element={<Navigate to={`/story/${stories[0].id}`} replace />} />
    <Route element={<Shell />}>
      <Route path="/story/*" element={<StoryView />} />
      <Route path="/all" element={<AllStories />} />
      <Route path="/tokens" element={<TokensPage />} />
    </Route>
    <Route path="/preview/*" element={<Preview />} />
  </Routes>
);

export const App = (): ReactElement => (
  <HashRouter>
    <GalleryRoutes />
  </HashRouter>
);
