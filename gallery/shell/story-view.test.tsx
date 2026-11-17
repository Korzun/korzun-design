import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { StoryView } from './story-view.js';

const Location = () => {
  const l = useLocation();
  return <output data-testid="loc">{l.pathname + l.search}</output>;
};

const mount = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <ThemeProvider identity="gallery">
        <ToastProvider>
          <Routes>
            <Route
              path="/story/*"
              element={
                <>
                  <StoryView />
                  <Location />
                </>
              }
            />
          </Routes>
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

describe('StoryView', () => {
  it('shows breadcrumb, iframe, and props from argTypes', () => {
    mount('/story/control/button/default');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Control / Button / Default'
    );
    expect(screen.getByTitle('Story preview')).toHaveAttribute(
      'src',
      expect.stringContaining('#/preview/control/button/default?theme=')
    );
    expect(screen.getByLabelText('disabled')).toBeInTheDocument();
    expect(screen.getByText('disabled')).toBeVisible();
    expect(screen.getByLabelText('type')).toBeInTheDocument();
  });

  it('writes a changed boolean into ?args= and pushes it, leaving the iframe src alone', async () => {
    mount('/story/control/button/default');
    const iframe = screen.getByTitle<HTMLIFrameElement>('Story preview');
    const srcBefore = iframe.getAttribute('src');
    const spy = vi.spyOn(iframe.contentWindow!, 'postMessage').mockImplementation(() => {});
    await userEvent.click(screen.getByLabelText('disabled'));
    expect(screen.getByTestId('loc')).toHaveTextContent(
      'args=' + encodeURIComponent(JSON.stringify({ disabled: true }))
    );
    expect(spy).toHaveBeenCalledWith(
      { type: 'gallery:args', args: { disabled: true } },
      window.location.origin
    );
    // A src change would add a browser history entry per panel edit.
    expect(iframe).toHaveAttribute('src', srcBefore);
  });

  it('keeps a wide width preset at its exact width without shrinking', () => {
    mount('/story/control/button/default?width=1024');
    const style = screen.getByTitle('Story preview').style;
    expect(style.width).toBe('1024px');
    expect(style.flexShrink).toBe('0');
  });

  it('stores a cleared number control as null and shows it empty', async () => {
    mount('/story/component/progress-indicator/single');
    const size = screen.getByLabelText('size');
    expect(size).toHaveValue('48');
    await userEvent.clear(size);
    expect(screen.getByTestId('loc')).toHaveTextContent(
      'args=' + encodeURIComponent(JSON.stringify({ size: null }))
    );
    expect(screen.getByLabelText('size')).toHaveValue('');
  });

  it('falls back to defaults on malformed ?args=', () => {
    mount('/story/control/button/default?args=%7Bnope');
    expect(screen.getByLabelText('children')).toHaveValue('Save');
  });

  it('applies ?width= and ?theme=', () => {
    mount('/story/control/button/default?width=414&theme=dark');
    expect(screen.getByTitle('Story preview')).toHaveStyle({ width: '414px' });
    expect(screen.getByTitle('Story preview')).toHaveAttribute(
      'src',
      expect.stringContaining('theme=dark')
    );
    expect(localStorage.getItem('theme-setting:gallery')).toBe('dark');
  });

  it('logs actions posted by the preview and ignores foreign origins', async () => {
    mount('/story/control/button/default');
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://evil.example',
          data: { type: 'gallery:action', name: 'onEvil', args: [] },
        })
      );
    });
    expect(screen.queryByText(/onEvil/)).toBeNull();
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          data: { type: 'gallery:action', name: 'onClick', args: [{ type: 'click' }] },
        })
      );
    });
    expect(screen.getByText(/onClick/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText('No actions yet.')).toBeInTheDocument();
  });

  it('shows not-found for an unknown id', () => {
    mount('/story/nope/nothing');
    expect(screen.getByText(/Story not found/)).toBeInTheDocument();
  });

  it('posts args and theme to the preview on ready and on change', async () => {
    mount('/story/control/button/default?theme=dark');
    const iframe = screen.getByTitle<HTMLIFrameElement>('Story preview');
    const target = iframe.contentWindow!;
    // A src change makes jsdom navigate and swap the window; browsers keep it for a hash-only change.
    vi.spyOn(iframe, 'contentWindow', 'get').mockReturnValue(target);
    const spy = vi.spyOn(target, 'postMessage').mockImplementation(() => {});
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          source: iframe.contentWindow,
          data: { type: 'gallery:ready' },
        })
      );
    });
    expect(spy).toHaveBeenCalledWith(
      { type: 'gallery:theme', theme: 'dark' },
      window.location.origin
    );
    expect(spy).toHaveBeenCalledWith({ type: 'gallery:args', args: {} }, window.location.origin);
    spy.mockClear();
    // Neither a logged action nor a width change may re-push.
    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          source: iframe.contentWindow,
          data: { type: 'gallery:action', name: 'onClick', args: [] },
        })
      );
    });
    await userEvent.click(screen.getByRole('radio', { name: 'Phone' }));
    expect(screen.getByText(/onClick/)).toBeInTheDocument();
    expect(iframe).toHaveStyle({ width: '414px' });
    expect(spy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByLabelText('disabled'));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      { type: 'gallery:args', args: { disabled: true } },
      window.location.origin
    );
  });
});
