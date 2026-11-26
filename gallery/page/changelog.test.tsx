import * as hooks from '@korzun/design/hooks';
import { ThemeProvider } from '@korzun/design/theme';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { siteData } from '../data.js';
import { ChangelogPage } from './changelog.js';

const mount = () =>
  render(
    <ThemeProvider identity="test">
      <MemoryRouter initialEntries={['/changelog']}>
        <ChangelogPage />
      </MemoryRouter>
    </ThemeProvider>
  );

const version = (v: string) => screen.getByRole('region', { name: v });

describe('ChangelogPage', () => {
  it('renders every version, newest first', () => {
    mount();
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual(siteData.changelog.map((v) => v.version));
    expect(h2[0]).toBe(siteData.version);
  });

  it('links a module tag to its component page', () => {
    mount();
    const links = within(version('0.5.0')).getAllByRole('link', { name: 'Button' });
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(link.getAttribute('href')).toBe('/components/button');
  });

  it('links a hook tag to the hooks guide', () => {
    mount();
    const [link] = screen.getAllByRole('link', { name: 'usePullToRefresh' });
    expect(link!.getAttribute('href')).toBe('/guides/hooks');
  });

  it('renders General and names with no page as plain chips', () => {
    mount();
    expect(screen.getAllByText('General').length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: 'General' })).toBeNull();
    // Any tag that is neither a module value nor a hook (none once every module has a page).
    const paged = new Set(siteData.modules.flatMap((m) => m.values));
    const plain = siteData.changelog
      .flatMap((v) => v.entries.flatMap((e) => e.tags))
      .find((t) => t !== 'General' && !paged.has(t) && !(t in hooks));
    if (plain) {
      expect(screen.getAllByText(plain).length).toBeGreaterThan(0);
      expect(screen.queryByRole('link', { name: plain })).toBeNull();
    }
  });

  it('renders entry markdown with nested bullets', () => {
    mount();
    const nested = version('0.5.0').querySelector('li li');
    expect(nested).not.toBeNull();
    expect(version('0.5.0').querySelector('code')).not.toBeNull();
  });
});
