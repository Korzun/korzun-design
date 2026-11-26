import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { siteData } from './data.js';
import { ComponentPage } from './page/component.js';
import { GuidePage } from './page/guide.js';

// Every `#/<route>#<id>` link on a component or guide page lands on an element
// with that id (in-page section links, type links and links between docs), and
// no id repeats on a page.
describe('section links', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = () => {};
  });
  afterAll(() => {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });

  it('every section link on the site has a target, and ids are unique', () => {
    const pages = [
      ...siteData.modules.map((m) => `/components/${m.slug}`),
      ...siteData.guides.map((g) => `/guides/${g.slug}`),
    ];
    const ids = new Map<string, Set<string>>();
    const links: { page: string; href: string }[] = [];
    const duplicates: string[] = [];
    for (const page of pages) {
      const { container, unmount } = render(
        <ThemeProvider identity="test">
          <ToastProvider>
            <MemoryRouter initialEntries={[page]}>
              <Routes>
                <Route path="/components/:slug" element={<ComponentPage />} />
                <Route path="/guides/:slug" element={<GuidePage />} />
              </Routes>
            </MemoryRouter>
          </ToastProvider>
        </ThemeProvider>
      );
      const all = Array.from(container.querySelectorAll('[id]'), (el) => el.id);
      for (const id of new Set(all.filter((x, i) => all.indexOf(x) !== i)))
        duplicates.push(`${page}#${id}`);
      ids.set(page, new Set(all));
      for (const a of container.querySelectorAll('a[href^="#/"]')) {
        const href = a.getAttribute('href')!;
        if (href.slice(2).includes('#')) links.push({ page, href });
      }
      unmount();
    }
    expect(links.length).toBeGreaterThan(50);
    const dead = links.filter(({ href }) => {
      const [route, id] = href.slice(1).split('#');
      return !ids.get(route!)?.has(id!);
    });
    expect(dead).toEqual([]);
    // A repeated id would send a link to the first one only.
    expect(duplicates).toEqual([]);
  }, 120_000);
});
