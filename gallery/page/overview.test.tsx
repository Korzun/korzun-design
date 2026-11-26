import { ThemeProvider } from '@korzun/design/theme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

import { OverviewPage } from './overview.js';

const Location = () => <p data-testid="location">{useLocation().pathname}</p>;

const mount = () =>
  render(
    <ThemeProvider identity="test">
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="*" element={<Location />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

describe('OverviewPage', () => {
  it('renders the categories in the closed-list order, empty ones hidden', () => {
    mount();
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(['Layout', 'Actions', 'Feedback']);
  });

  it('gives each card a lazy, inert thumbnail of the first example', () => {
    mount();
    const link = screen.getByRole('link', { name: /Button/ });
    const frame = link.querySelector('iframe')!;
    expect(frame).toHaveAttribute('loading', 'lazy');
    expect(frame).toHaveAttribute('aria-hidden', 'true');
    expect(frame).toHaveAttribute('tabindex', '-1');
    expect(frame.getAttribute('src')).toMatch(
      /^\/#\/frame\/button\/basic\?theme=(light|dark|auto)$/
    );
  });

  it('filters by the search box and says when nothing matches', async () => {
    mount();
    const search = screen.getByRole('textbox', { name: 'Search components' });
    await userEvent.type(search, 'alert');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Feedback',
    ]);
    await userEvent.clear(search);
    await userEvent.type(search, 'zzz');
    expect(screen.queryAllByRole('heading', { level: 2 })).toEqual([]);
    expect(screen.getByText('No components match “zzz”.')).toBeInTheDocument();
  });

  it('navigates to the component page when a card is clicked', async () => {
    mount();
    await userEvent.click(screen.getByRole('link', { name: /Button/ }));
    expect(screen.getByTestId('location')).toHaveTextContent('/components/button');
  });
});
