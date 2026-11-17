import { ThemeProvider } from '@korzun/design/theme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { Sidebar } from './sidebar.js';

const mount = (path = '/story/control/button/default') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider identity="gallery">
        <Sidebar />
      </ThemeProvider>
    </MemoryRouter>
  );

describe('Sidebar', () => {
  it('lists groups and marks the active story', () => {
    mount();
    expect(screen.getByRole('link', { name: 'Default' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'All' })).toHaveAttribute('href', '/all');
    expect(screen.getByRole('link', { name: 'Tokens' })).toHaveAttribute('href', '/tokens');
  });

  it('stacks story links as list items inside a list', () => {
    mount();
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href')?.startsWith('/story/'));
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.parentElement?.tagName).toBe('LI');
      expect(link.parentElement?.parentElement?.tagName).toBe('UL');
    }
  });

  it('filters by search text', async () => {
    mount();
    await userEvent.type(screen.getByLabelText('Search'), 'toast');
    expect(
      screen
        .getAllByRole('link')
        .filter((l) => l.getAttribute('href')?.startsWith('/story/'))
        .map((l) => l.getAttribute('href'))
    ).toEqual(['/story/toast/toast/default']);
  });

  it('carries the width preset, and only it, into story links', () => {
    mount('/story/control/button/default?width=414&theme=dark&args=%7B%7D');
    expect(screen.getByRole('link', { name: 'Primary' })).toHaveAttribute(
      'href',
      '/story/control/button/primary?width=414'
    );
  });
});
