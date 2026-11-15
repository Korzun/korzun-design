import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

// Import the provider module files, not their barrels: barrel imports sit inside
// circular-import cycles in Bookplate and poison module loading (see Bookplate's test-utils).
import { ThemeProvider } from './theme/provider.js';
import { ToastProvider } from './toast/provider.js';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  identity?: string | null;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: ReactElement,
  { identity = null, initialEntries, ...options }: RenderWithProvidersOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider identity={identity}>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * The text of each `MetaLine` item under `container`, in order. Glyph SVGs
 * (the rating icons draw their emoji as an SVG `<text>` node) are dropped so a
 * rated item reads as its name alone, e.g. `'Love'`.
 */
export function metaItems(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-testid="meta-item"]')).map((item) => {
    const copy = item.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('svg').forEach((svg) => svg.remove());
    return copy.textContent ?? '';
  });
}
