import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { Frame, FrameNavigatedAway } from './frame.js';

describe('Frame', () => {
  beforeEach(() => localStorage.clear());
  const mount = (url: string) =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/frame/:module/:example" element={<Frame />} />
        </Routes>
      </MemoryRouter>
    );

  it('renders the example named in the URL', () => {
    mount('/frame/button/basic');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
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
