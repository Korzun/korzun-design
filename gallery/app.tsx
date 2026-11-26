import { Page } from '@korzun/design/component';
import { createUseStyles, ThemeProvider, type Theme } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { useState, type ReactElement } from 'react';
import { HashRouter, Outlet, Route, Routes, useLocation } from 'react-router';

import { Frame, FrameNavigatedAway } from './frame.js';
import { Header } from './layout/header.js';
import { NotFound } from './not-found.js';
import { ComponentPage } from './page/component.js';
import { OverviewPage } from './page/overview.js';
import { ChangelogPage, GuidePage } from './page/pending.js';
import { TokensPage } from './page/tokens.js';

const useStyle = createUseStyles((theme: Theme) => ({
  // Apps reset the body margin in their own CSS; the site has none.
  '@global': { body: { margin: 0 } },
  root: {
    minHeight: '100vh',
    fontFamily: theme.fontFamily.body,
    color: theme.color.text.primary,
    backgroundColor: theme.color.bg.page,
  },
}));

const ShellBody = (): ReactElement => {
  const styles = useStyle();
  return (
    <div className={styles.root}>
      <Header />
      <Outlet />
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

// The tokens page predates the site and has no Page of its own.
const Tokens = (): ReactElement => (
  <Page documentTitle="Tokens · @korzun/design">
    <TokensPage />
  </Page>
);

export const GalleryRoutes = (): ReactElement => {
  const { pathname } = useLocation();
  // A window opened on an example frame (a thumbnail, a demo, a screenshot
  // link) stays a frame: links inside must not load the site into it.
  const [frameHome] = useState(() => (pathname.startsWith('/frame/') ? pathname : null));

  if (frameHome)
    return (
      <Routes>
        <Route path="/frame/:module/:example" element={<Frame />} />
        <Route path="*" element={<FrameNavigatedAway home={frameHome} />} />
      </Routes>
    );
  return (
    <Routes>
      <Route path="/frame/:module/:example" element={<Frame />} />
      <Route element={<Shell />}>
        <Route index element={<OverviewPage />} />
        <Route path="/components/:slug" element={<ComponentPage />} />
        <Route path="/guides/:slug" element={<GuidePage />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export const App = (): ReactElement => (
  <HashRouter>
    <GalleryRoutes />
  </HashRouter>
);
