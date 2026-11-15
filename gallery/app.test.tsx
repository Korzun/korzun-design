import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GalleryRoutes } from './app.js';

const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider identity="gallery">
        <ToastProvider>
          <GalleryRoutes />
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

describe('gallery', () => {
  let error: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    // jsdom lacks the dialog API that ConfirmModal's useModalDialog calls.
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    error = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => error.mockRestore());

  it.each([
    ['/', 'Tokens'],
    ['/tokens', 'Tokens'],
    ['/controls', 'Controls'],
    ['/components', 'Components'],
    ['/icons', 'Icons'],
  ])('renders %s without console errors', (path, heading) => {
    mount(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(error).not.toHaveBeenCalled();
  });
});
