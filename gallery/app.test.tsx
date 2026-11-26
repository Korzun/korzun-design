import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter } from 'react-router';

import { GalleryRoutes } from './app.js';

const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <GalleryRoutes />
    </MemoryRouter>
  );

describe('gallery routes', () => {
  beforeEach(() => localStorage.clear());

  it('renders the overview at / with the header', () => {
    mount('/');
    expect(screen.getByRole('textbox', { name: 'Search components' })).toBeInTheDocument();
    // Scoped to the nav: role queries over the whole overview are slow in jsdom.
    const links = within(screen.getByRole('navigation', { name: 'Site' }))
      .getAllByRole('link')
      .map((l) => [l.textContent, l.getAttribute('href')]);
    expect(links).toEqual([
      ['Components', '/'],
      ['Icons', '/components/icon'],
      ['Tokens', '/tokens'],
      ['Changelog', '/changelog'],
    ]);
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeInTheDocument();
  });

  it.each([
    ['/components/button', 'Button'],
    ['/tokens', 'Tokens'],
    ['/changelog', 'Changelog'],
  ])('renders %s with its page heading', (path, heading) => {
    // querySelector, not getByRole: the tokens page is too big for role queries in jsdom.
    const { container } = mount(path);
    expect(container.querySelector('h1')).toHaveTextContent(heading);
  });

  it('renders not-found for an unknown route, component or guide', () => {
    for (const path of ['/nope', '/components/nope', '/guides/nope']) {
      const { unmount } = mount(path);
      expect(screen.getByRole('heading', { level: 1, name: 'Not found' })).toBeInTheDocument();
      expect(screen.getByText(path)).toBeInTheDocument();
      unmount();
    }
  });

  it('renders a frame without the header', () => {
    mount('/frame/button/basic');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Components' })).toBeNull();
  });

  it('posts the chosen theme to every loaded frame without reloading it', async () => {
    mount('/');
    const frames = Array.from(document.querySelectorAll('iframe'));
    expect(frames.length).toBeGreaterThan(0);
    // A loaded frame keeps its URL; the theme reaches it as a message.
    for (const f of frames) fireEvent.load(f);
    const srcs = frames.map((f) => f.getAttribute('src'));
    const spies = frames.map((f) => vi.spyOn(f.contentWindow!, 'postMessage'));
    await userEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    for (const spy of spies)
      expect(spy).toHaveBeenCalledWith(
        { type: 'gallery:theme', theme: 'dark' },
        window.location.origin
      );
    expect(frames.map((f) => f.getAttribute('src'))).toEqual(srcs);
  });

  it('keeps a frame window a frame when an example links outside it', async () => {
    render(
      <MemoryRouter initialEntries={['/frame/button/basic']}>
        <Link to="/">to root</Link>
        <GalleryRoutes />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByRole('link', { name: 'to root' }));
    expect(screen.queryByRole('textbox', { name: 'Search components' })).toBeNull();
    expect(screen.getByText(/The example navigated to/)).toHaveTextContent('/');
    await userEvent.click(screen.getByRole('link', { name: 'Back to the example' }));
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
