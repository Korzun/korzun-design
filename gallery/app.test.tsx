import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GalleryRoutes } from './app.js';
import { stories } from './stories.js';

const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <GalleryRoutes />
    </MemoryRouter>
  );

describe('gallery routes', () => {
  beforeEach(() => {
    // jsdom lacks the dialog API that modal stories call.
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  it('redirects / to the first story', () => {
    mount('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(stories[0].title);
  });

  it('renders the tokens page inside the shell', () => {
    mount('/tokens');
    expect(screen.getByRole('heading', { level: 1, name: 'Tokens' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
  });

  it('renders the contact sheet with sheet:false stories as links', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mount('/all');
    expect(screen.getByRole('heading', { level: 1, name: 'All stories' })).toBeInTheDocument();
    const links = screen.getAllByRole('link', { name: /^Open / });
    expect(links.length).toBe(stories.filter((s) => !s.sheet).length);
    for (const l of links) {
      expect(l).toHaveAttribute(
        'href',
        expect.stringMatching(/^\/story\/component\/(page|nav-mobile|nav-desktop|top-fade)\//)
      );
    }
    expect(screen.getAllByTestId('sheet-story').length).toBe(stories.length);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('renders the preview route without the sidebar', () => {
    mount('/preview/control/button/default');
    expect(screen.queryByRole('link', { name: 'All' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
  it('shows not-found inside the shell for an unknown path', () => {
    mount('/nope');
    expect(screen.getByText(/Story not found/)).toHaveTextContent('/nope');
    expect(screen.getByRole('link', { name: 'All' })).toBeInTheDocument();
  });

  it('keeps a preview window a preview when a story links outside it', async () => {
    render(
      <MemoryRouter initialEntries={['/preview/control/button/default']}>
        <Link to="/">to root</Link>
        <Link to="/books">to books</Link>
        <GalleryRoutes />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByRole('link', { name: 'to root' }));
    expect(screen.queryByRole('link', { name: 'All' })).toBeNull();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    expect(screen.getByText(/The story navigated to/)).toHaveTextContent('/');
    await userEvent.click(screen.getByRole('link', { name: 'to books' }));
    expect(screen.getByText(/The story navigated to/)).toHaveTextContent('/books');
    expect(screen.getByRole('link', { name: 'Back to the story' })).toHaveAttribute(
      'href',
      '/preview/control/button/default'
    );
    await userEvent.click(screen.getByRole('link', { name: 'Back to the story' }));
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
