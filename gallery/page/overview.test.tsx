import { ThemeProvider } from '@korzun/design/theme';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

import { CATEGORIES } from '../../scripts/docs-gen/categories.mjs';
import { moduleOwner, siteData } from '../data.js';
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

  it('lists Hooks last and leaves nested modules to the parent page', () => {
    mount();
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings.at(-1)).toBe('Hooks');
    const cards = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(cards).toContain('Page');
    expect(cards).not.toContain('PageActionsBar');
    expect(cards).not.toContain('CardRow');
    expect(screen.queryByText('Page /')).toBeNull();
  });

  it('still finds a nested module by search, naming its parent', async () => {
    mount();
    await userEvent.type(screen.getByRole('textbox', { name: 'Search components' }), 'PageActions');
    const cards = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(cards).toEqual(['PageActionsBar', 'PageActionsMenu']);
    expect(screen.getAllByText('Page /')).toHaveLength(2);
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

  it('renders card descriptions as inline markdown, with no block or link inside the card link', () => {
    mount();
    const link = screen.getByRole('link', { name: /^TextInput\b/ });
    expect(link.textContent).not.toContain('`');
    expect(link.querySelector('code')).toHaveTextContent('maxLength');
    expect(link.querySelector('a, p, div div p, ul, pre')).toBeNull();
  });

  it('keeps a thumbnail transparent until its frame loads, so a blank frame never flashes', () => {
    const button = siteData.modules.find((m) => m.slug === 'button')!;
    const { container } = render(
      <ThemeProvider identity="test">
        <Thumbnail owner={moduleOwner(button)} />
      </ThemeProvider>
    );
    const frame = container.querySelector('iframe')!;
    expect(getComputedStyle(frame).opacity).toBe('0');
    fireEvent.load(frame);
    expect(getComputedStyle(frame).opacity).toBe('1');
  });

  it('falls back to the first example for a module with no preview', () => {
    const button = siteData.modules.find((m) => m.slug === 'button')!;
    const { container } = render(
      <ThemeProvider identity="test">
        <Thumbnail owner={moduleOwner({ ...button, preview: undefined })} />
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
        <Thumbnail
          owner={moduleOwner({ ...button, preview: { ...button.preview!, viewport: 'mobile' } })}
        />
        <Thumbnail owner={moduleOwner(button)} />
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
        <Thumbnail owner={moduleOwner(bar)} />
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

  it('clears an empty search from its Clear search button', async () => {
    mount();
    await userEvent.type(screen.getByRole('textbox', { name: 'Search components' }), 'zzz');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.queryByText('No components match “zzz”.')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0);
    expect(screen.getByRole('textbox', { name: 'Search components' })).toHaveValue('');
  });

  it('navigates to the component page when a card is clicked', async () => {
    mount();
    await userEvent.click(screen.getByRole('link', { name: /^Button\b/ }));
    expect(screen.getByTestId('location')).toHaveTextContent('/components/button');
  });
});
