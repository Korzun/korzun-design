import { createUseStyles, ThemeProvider, type Theme } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { useState, type ReactElement } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router';

import { AllStories } from './all.js';
import { Frame, FrameNavigatedAway } from './frame.js';
import { StoryNotFound } from './not-found.js';
import { TokensPage } from './page/tokens.js';
import { Preview, PreviewNavigatedAway } from './preview.js';
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

const ShellNotFound = (): ReactElement => <StoryNotFound id={useLocation().pathname} />;

export const GalleryRoutes = (): ReactElement => {
  const { pathname } = useLocation();
  // A window opened on a preview or example frame (the canvas iframe, a
  // screenshot link) stays a frame: links inside must not load the shell into it.
  const [previewHome] = useState(() =>
    pathname.startsWith('/preview/') || pathname.startsWith('/frame/') ? pathname : null
  );

  if (previewHome)
    return (
      <Routes>
        <Route path="/preview/*" element={<Preview />} />
        <Route path="/frame/:module/:example" element={<Frame />} />
        <Route
          path="*"
          element={
            previewHome.startsWith('/frame/') ? (
              <FrameNavigatedAway home={previewHome} />
            ) : (
              <PreviewNavigatedAway home={previewHome} />
            )
          }
        />
      </Routes>
    );
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/story/${stories[0].id}`} replace />} />
      <Route path="/preview/*" element={<Preview />} />
      <Route path="/frame/:module/:example" element={<Frame />} />
      <Route element={<Shell />}>
        <Route path="/story/*" element={<StoryView />} />
        <Route path="/all" element={<AllStories />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="*" element={<ShellNotFound />} />
      </Route>
    </Routes>
  );
};

export const App = (): ReactElement => (
  <HashRouter>
    <GalleryRoutes />
  </HashRouter>
);
