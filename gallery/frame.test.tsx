import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { Frame, FrameNavigatedAway } from './frame.js';

describe('Frame', () => {
  beforeEach(() => localStorage.clear());
  const mount = (url: string) =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/frame/:module/:example" element={<Frame />} />
          <Route path="/frame/recipe/:recipe/:example" element={<Frame />} />
        </Routes>
      </MemoryRouter>
    );

  it('renders the example named in the URL', () => {
    mount('/frame/button/basic');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('looks a recipe frame up among recipes, never among modules', () => {
    mount('/frame/recipe/button/basic');
    expect(screen.getByText('No example "recipe/button/basic".')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();
  });

  it('says so for an unknown example', () => {
    mount('/frame/button/nope');
    expect(screen.getByText('No example "button/nope".')).toBeInTheDocument();
    mount('/frame/nope/basic');
    expect(screen.getByText('No example "nope/basic".')).toBeInTheDocument();
  });

  it('applies the theme param and ignores an invalid one', () => {
    mount('/frame/button/basic?theme=dark');
    expect(localStorage.getItem('theme-setting:gallery-frame')).toBe('dark');
    localStorage.clear();
    mount('/frame/button/basic?theme=neon');
    expect(localStorage.getItem('theme-setting:gallery-frame')).toBeNull();
  });

  it('switches theme on a same-origin gallery:theme message only', () => {
    mount('/frame/button/basic');
    const send = (origin: string) =>
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', { origin, data: { type: 'gallery:theme', theme: 'light' } })
        );
      });
    send('https://evil.example');
    expect(localStorage.getItem('theme-setting:gallery-frame')).toBeNull();
    send(window.location.origin);
    expect(localStorage.getItem('theme-setting:gallery-frame')).toBe('light');
  });
  it('posts its content height to the page, not in fit=center mode', () => {
    const post = vi.spyOn(window, 'postMessage');
    const height = (call: unknown[]) => (call[0] as { type?: string }).type === 'gallery:height';
    const { unmount } = mount('/frame/button/basic?fit=center');
    expect(post.mock.calls.filter(height)).toEqual([]);
    unmount();
    mount('/frame/button/basic');
    expect(post.mock.calls.filter(height)).toEqual([
      [{ type: 'gallery:height', height: expect.any(Number) }, window.location.origin],
    ]);
    post.mockRestore();
  });

  it('posts a taller height when an overlay opens outside the flow, and again when it closes', async () => {
    const post = vi.spyOn(window, 'postMessage');
    const heights = () =>
      post.mock.calls
        .map((call) => call[0] as { type?: string; height?: number })
        .filter((m) => m.type === 'gallery:height')
        .map((m) => m.height);
    mount('/frame/button/basic');
    const [base] = heights();
    const portal = document.createElement('div');
    portal.getBoundingClientRect = () => ({ bottom: 900 }) as DOMRect;
    await act(async () => document.body.append(portal));
    await waitFor(() => expect(heights().at(-1)).toBeGreaterThanOrEqual(900));
    await act(async () => portal.remove());
    await waitFor(() => expect(heights().at(-1)).toBe(base));
    post.mockRestore();
  });

  it('adds top room while an overlay sticks out above the frame, and removes it on close', async () => {
    const post = vi.spyOn(window, 'postMessage');
    const heights = () =>
      post.mock.calls
        .map((call) => call[0] as { type?: string; height?: number })
        .filter((m) => m.type === 'gallery:height')
        .map((m) => m.height);
    // The dev server keeps its module script in the body: it is not an overlay.
    const script = document.createElement('script');
    script.type = 'module';
    script.getBoundingClientRect = () => ({ top: 0, bottom: 0 }) as DOMRect;
    document.body.append(script);
    mount('/frame/button/basic');
    const [base] = heights();
    const padded = () =>
      [...document.body.querySelectorAll<HTMLElement>('div')].filter((el) => el.style.paddingTop);
    expect(padded()).toEqual([]);
    const resized = vi.fn();
    window.addEventListener('resize', resized);
    // A list flipped upward, 60px above the frame's top edge.
    const portal = document.createElement('div');
    portal.getBoundingClientRect = () => ({ top: -60, bottom: 40 }) as DOMRect;
    await act(async () => document.body.append(portal));
    await waitFor(() => expect(padded()).toHaveLength(1));
    const [flow] = padded();
    expect(flow).toContainElement(screen.getByRole('button', { name: 'Save' }));
    expect(parseFloat(flow.style.paddingTop)).toBeGreaterThanOrEqual(60);
    // The popover re-measures against the moved anchor.
    expect(resized).toHaveBeenCalled();
    await act(async () => portal.remove());
    await waitFor(() => expect(padded()).toEqual([]));
    await waitFor(() => expect(heights().at(-1)).toBe(base));
    window.removeEventListener('resize', resized);
    script.remove();
    post.mockRestore();
  });

  it('centres the example only when the URL asks for fit=center', () => {
    const { unmount } = mount('/frame/button/basic?fit=center');
    expect(
      screen.getByRole('button', { name: 'Save' }).closest('[data-fit="center"]')
    ).not.toBeNull();
    unmount();
    mount('/frame/button/basic');
    expect(screen.getByRole('button', { name: 'Save' }).closest('[data-fit]')).toBeNull();
  });
});

describe('FrameNavigatedAway', () => {
  it('shows where the example went and links back', () => {
    render(
      <MemoryRouter initialEntries={['/elsewhere']}>
        <Routes>
          <Route path="*" element={<FrameNavigatedAway home="/frame/button/basic" />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('/elsewhere')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the example' })).toHaveAttribute(
      'href',
      '/frame/button/basic'
    );
  });
});
