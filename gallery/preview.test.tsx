import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { parseArgsParam, serializeActionArgs } from './messages.js';
import { Preview } from './preview.js';
import { stories } from './stories.js';

describe('messages', () => {
  it('parseArgsParam tolerates bad input', () => {
    expect(parseArgsParam(null)).toEqual({});
    expect(parseArgsParam('{not json')).toEqual({});
    expect(parseArgsParam('[1]')).toEqual({});
    expect(parseArgsParam('{"a":1}')).toEqual({ a: 1 });
  });
  it('serializeActionArgs reduces events and survives cycles', () => {
    const cyc: Record<string, unknown> = {};
    cyc.self = cyc;
    const element = <b />;
    const out = serializeActionArgs([new MouseEvent('click'), element, cyc, 3]);
    expect(out[0]).toEqual({ type: 'click' });
    expect(out[1]).toBe('<Element>');
    expect(typeof out[2]).toBe('string');
    expect(out[3]).toBe(3);
    expect(() => JSON.stringify(out)).not.toThrow();
  });
});

describe('Preview', () => {
  beforeEach(() => localStorage.clear());
  const mount = (url: string, parentWindow: Window | null = null) =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/preview/*" element={<Preview parentWindow={parentWindow} />} />
          <Route path="/story/*" element={<div>story route</div>} />
        </Routes>
      </MemoryRouter>
    );
  it('renders the story named in the URL with URL args', () => {
    mount(
      '/preview/control/button/default?args=' +
        encodeURIComponent(JSON.stringify({ children: 'From URL' }))
    );
    expect(screen.getByRole('button', { name: 'From URL' })).toBeInTheDocument();
  });
  it('applies the theme param to the preview identity', () => {
    mount('/preview/control/button/default?theme=dark');
    expect(localStorage.getItem('theme-setting:gallery-preview')).toBe('dark');
  });
  it('ignores an invalid theme param', () => {
    mount('/preview/control/button/default?theme=neon');
    expect(localStorage.getItem('theme-setting:gallery-preview')).toBeNull();
  });
  it('applies theme messages from the shell', () => {
    mount('/preview/control/button/default');
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          data: { type: 'gallery:theme', theme: 'light' },
        })
      );
    });
    expect(localStorage.getItem('theme-setting:gallery-preview')).toBe('light');
  });
  it('updates args from a same-origin shell message and ignores others', () => {
    mount('/preview/control/button/default');
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://evil.example',
          data: { type: 'gallery:args', args: { children: 'Evil' } },
        })
      );
    });
    expect(screen.queryByRole('button', { name: 'Evil' })).toBeNull();
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          data: { type: 'gallery:args', args: { children: 'Live' } },
        })
      );
    });
    expect(screen.getByRole('button', { name: 'Live' })).toBeInTheDocument();
  });
  it('posts ready on mount and actions to the parent window', () => {
    const post = vi.fn();
    mount('/preview/control/button/default', { postMessage: post } as unknown as Window);
    expect(post).toHaveBeenCalledWith({ type: 'gallery:ready' }, window.location.origin);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'gallery:action', name: 'onClick' }),
      window.location.origin
    );
  });
  it('shows not-found for an unknown id', () => {
    mount('/preview/nope/nothing');
    expect(screen.getByText(/Story not found/)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', `/story/${stories[0].id}`);
  });
});
