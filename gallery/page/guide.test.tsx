import { ThemeProvider } from '@korzun/design/theme';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { siteData } from '../data.js';
import { GuidePage } from './guide.js';

const mount = (slug: string, hash = '') =>
  render(
    <ThemeProvider identity="test">
      <MemoryRouter initialEntries={[`/guides/${slug}${hash}`]}>
        <Routes>
          <Route path="/guides/:slug" element={<GuidePage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

describe('GuidePage', () => {
  it.each(siteData.guides.map((g) => [g.slug, g] as const))(
    'renders the %s guide with its title and description',
    (slug, guide) => {
      mount(slug);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(guide.title);
      expect(screen.getByText(guide.description)).toBeInTheDocument();
    }
  );

  it('renders the corners guide: title, description and body headings', () => {
    mount('corners');
    const corners = siteData.guides.find((g) => g.slug === 'corners')!;
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Corners');
    expect(screen.getByText(corners.description)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Tokens' })).toBeInTheDocument();
  });

  it('rewrites links between docs to site routes', () => {
    const { container } = mount('patterns');
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs.some((h) => h?.startsWith('#/guides/') || h?.startsWith('#/components/'))).toBe(
      true
    );
    expect(hrefs.some((h) => h?.endsWith('.md'))).toBe(false);
  });

  it('lands on the section a link names: headings carry slug ids', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    try {
      mount('tokens', '#recipe');
      const recipe = document.getElementById('recipe');
      expect(recipe).toHaveTextContent('recipe');
      expect(scrollIntoView.mock.contexts).toContain(recipe);
    } finally {
      Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
    }
  });

  it('renders not-found for an unknown guide', () => {
    mount('nope');
    expect(screen.getByRole('heading', { level: 1, name: 'Not found' })).toBeInTheDocument();
  });
});
