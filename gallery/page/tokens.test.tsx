import { lightTheme, ThemeProvider } from '@korzun/design/theme';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { leaves, recipeEntries, tokenGroups, TokensPage } from './tokens.js';

const mount = () =>
  render(
    <ThemeProvider identity="test">
      <MemoryRouter>
        <TokensPage />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('TokensPage', () => {
  it('has a section for every token group in the theme', () => {
    const { container } = mount();
    // querySelector, not getByRole: the page is too big for role queries in jsdom.
    const titles = Array.from(container.querySelectorAll('section > h2')).map((h) => h.textContent);
    expect(titles).toEqual(tokenGroups(lightTheme));
    for (const group of ['fontFamily', 'fontWeight', 'lineHeight', 'layout'])
      expect(titles).toContain(group);
    expect(titles).not.toContain('colorScheme');
  });

  it('draws one swatch for a plain colour string, not one per character', () => {
    const { container } = mount();
    const paths = Array.from(container.querySelectorAll('section span')).map((s) => s.textContent);
    expect(paths.filter((p) => p === 'color.success')).toHaveLength(1);
    expect(paths.some((p) => /^color\.(success|warning|info)\.\d$/.test(p ?? ''))).toBe(false);
  });
});

describe('leaves', () => {
  it('keeps a plain value as its own single leaf', () => {
    expect(leaves('#16a34a', 'color.success')).toEqual([['color.success', '#16a34a']]);
    expect(leaves({ a: 1, b: { c: '2' } }, 'x')).toEqual([
      ['x.a', 1],
      ['x.b.c', '2'],
    ]);
  });
});

describe('recipeEntries', () => {
  it('lists nested recipe groups by full path with the properties each sets', () => {
    const paths = recipeEntries(lightTheme.recipe as never, 'recipe').map(([p]) => p);
    expect(paths).toContain('recipe.glassHighlight');
    expect(paths).toContain('recipe.modal.dialog');
    expect(paths).toContain('recipe.card.footer');
    expect(paths).not.toContain('recipe.modal');
  });
});
