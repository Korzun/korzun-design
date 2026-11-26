import { ThemeProvider } from '@korzun/design/theme';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { RecipePage, RecipesPage } from './recipes.js';

const mount = (url: string) =>
  render(
    <ThemeProvider identity="test">
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:slug" element={<RecipePage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

describe('RecipesPage', () => {
  it('lists each recipe as a link to its page, with a thumbnail', () => {
    mount('/recipes');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Recipes');
    const link = screen.getByRole('link', { name: /Sign in/ });
    expect(link).toHaveAttribute('href', '/recipes/login');
    const thumb = link.querySelector('iframe')!;
    expect(thumb.getAttribute('src')).toContain('#/frame/recipe/login/sign-in?');
    expect(thumb.getAttribute('src')).toContain('fit=center');
  });
});

describe('RecipePage', () => {
  it('renders the title, the live example and the prose', () => {
    mount('/recipes/login');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in');
    const iframe = screen.getByTitle('Sign in: Sign in');
    expect(iframe.getAttribute('src')).toContain('#/frame/recipe/login/sign-in?');
    expect(
      screen.getByRole('heading', { level: 2, name: "Why it's built this way" })
    ).toBeInTheDocument();
    // The generated examples region is not repeated as prose.
    expect(screen.queryByRole('heading', { level: 2, name: 'Examples' })).toBeNull();
  });

  it('rewrites the doc links in the prose to site routes', () => {
    const { container } = mount('/recipes/login');
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('#/guides/corners');
  });

  it('shows Not found for an unknown recipe', () => {
    mount('/recipes/nope');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Not found');
  });
});
