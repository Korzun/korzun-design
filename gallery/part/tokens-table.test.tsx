import { lightTheme, ThemeProvider } from '@korzun/design/theme';
import { render, screen, within } from '@testing-library/react';

import { TokensTable } from './tokens-table.js';

describe('TokensTable', () => {
  it('shows a value in each mode, with a swatch for a colour', () => {
    render(
      <ThemeProvider identity="test">
        <TokensTable tokens={[{ path: 'space.md', kind: 'value', light: '8px', dark: '8px' }]} />
      </ThemeProvider>
    );
    expect(screen.getAllByText('8px')).toHaveLength(2);
  });

  it('shows a recipe as a link to the tokens guide and the properties it sets, not a dash', () => {
    render(
      <ThemeProvider identity="test">
        <TokensTable tokens={[{ path: 'recipe.glass', kind: 'recipe', light: null, dark: null }]} />
      </ThemeProvider>
    );
    const row = screen.getByRole('row', { name: /theme\.recipe\.glass/ });
    expect(within(row).queryByText('–')).toBeNull();
    expect(within(row).getByRole('link', { name: 'recipe' })).toHaveAttribute(
      'href',
      '#/guides/tokens#recipe'
    );
    for (const key of Object.keys(lightTheme.recipe.glass)) {
      expect(row).toHaveTextContent(key);
    }
  });
});

describe('TokensTable recipe table', () => {
  const recipe = { path: 'recipe.glass', kind: 'recipe', light: null, dark: null } as const;

  it('leaves the properties cell unlabelled and wide, for the stacked phone layout', () => {
    const { container } = render(
      <ThemeProvider identity="test">
        <TokensTable tokens={[recipe]} />
      </ThemeProvider>
    );
    const cells = Array.from(container.querySelectorAll('tbody td'));
    expect(cells.map((td) => td.getAttribute('data-label'))).toEqual([null, null]);
    expect(cells[1]!.className).toMatch(/wide/);
  });

  it('shows no empty value table when there are only recipes', () => {
    render(
      <ThemeProvider identity="test">
        <TokensTable tokens={[recipe]} />
      </ThemeProvider>
    );
    expect(screen.queryByRole('table', { name: 'Tokens' })).toBeNull();
    expect(screen.getByRole('table', { name: 'Recipe tokens' })).toBeInTheDocument();
  });

  it('still shows the value table when there are no tokens at all', () => {
    render(
      <ThemeProvider identity="test">
        <TokensTable tokens={[]} />
      </ThemeProvider>
    );
    expect(screen.getByRole('table', { name: 'Tokens' })).toBeInTheDocument();
  });
});
