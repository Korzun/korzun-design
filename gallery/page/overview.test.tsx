import { ThemeProvider } from '@korzun/design/theme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

import { CATEGORIES } from '../../scripts/docs-gen/categories.mjs';
import { siteData } from '../data.js';
import { DESKTOP_WIDTH, MOBILE_WIDTH } from '../frame-url.js';
import { Thumbnail } from '../part/thumbnail.js';
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
    const used = new Set(siteData.modules.map((m) => m.category));
    expect(headings).toEqual(CATEGORIES.filter((c) => used.has(c)));
    expect(headings.length).toBeGreaterThan(1);
  });

  it('gives each card a lazy, inert thumbnail of its preview', () => {
    mount();
    const link = screen.getByRole('link', { name: /^Button\b/ });
    const frame = link.querySelector('iframe')!;
    expect(frame).toHaveAttribute('loading', 'lazy');
    expect(frame).toHaveAttribute('aria-hidden', 'true');
    expect(frame).toHaveAttribute('tabindex', '-1');
    expect(frame.getAttribute('src')).toMatch(
      /^\/#\/frame\/button\/preview\?theme=(light|dark|auto)&fit=center$/
    );
  });

  it('falls back to the first example for a module with no preview', () => {
    const button = siteData.modules.find((m) => m.slug === 'button')!;
    const { container } = render(
      <ThemeProvider identity="test">
        <Thumbnail mod={{ ...button, preview: undefined }} />
      </ThemeProvider>
    );
    expect(container.querySelector('iframe')!.getAttribute('src')).toMatch(
      /\/frame\/button\/basic\?/
    );
  });

  it('lays a @viewport mobile preview out at phone width in its thumbnail', () => {
    const button = siteData.modules.find((m) => m.slug === 'button')!;
    const { container } = render(
      <ThemeProvider identity="test">
        <Thumbnail mod={{ ...button, preview: { ...button.preview!, viewport: 'mobile' } }} />
        <Thumbnail mod={button} />
      </ThemeProvider>
    );
    const [phone, wide] = container.querySelectorAll('iframe');
    expect(phone).toHaveAttribute('data-viewport', 'mobile');
    expect(getComputedStyle(phone).width).toBe(`${MOBILE_WIDTH}px`);
    expect(wide).not.toHaveAttribute('data-viewport');
  });

  it('lays a @viewport desktop preview out past the mobile breakpoint, scaled to fit', () => {
    const bar = siteData.modules.find((m) => m.slug === 'page-actions-bar')!;
    expect(bar.preview?.viewport).toBe('desktop');
    const { container } = render(
      <ThemeProvider identity="test">
        <Thumbnail mod={bar} />
      </ThemeProvider>
    );
    const frame = container.querySelector('iframe')!;
    expect(frame).toHaveAttribute('data-viewport', 'desktop');
    expect(getComputedStyle(frame).width).toBe(`${DESKTOP_WIDTH}px`);
    expect(frame.style.transform).toMatch(/^scale\(/);
  });

  it('filters by the search box and says when nothing matches', async () => {
    mount();
    const search = screen.getByRole('textbox', { name: 'Search components' });
    await userEvent.type(search, 'tinted');
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
    await userEvent.click(screen.getByRole('link', { name: /^Button\b/ }));
    expect(screen.getByTestId('location')).toHaveTextContent('/components/button');
  });
});
