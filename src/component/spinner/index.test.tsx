import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Spinner } from './index.js';

const css = (el: HTMLElement) => getComputedStyle(el);

describe('Spinner', () => {
  it('has role="status" named "Loading" by default', () => {
    const { getByRole } = renderWithProviders(<Spinner />);
    expect(getByRole('status', { name: 'Loading' })).toBeTruthy();
  });

  it('uses a custom label', () => {
    const { getByRole } = renderWithProviders(<Spinner label="Loading books" />);
    expect(getByRole('status', { name: 'Loading books' })).toBeTruthy();
  });

  it('decorative hides it from assistive tech', () => {
    const { queryByRole, container } = renderWithProviders(<Spinner decorative label="x" />);
    expect(queryByRole('status')).toBeNull();
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('size resolves the font-size token', () => {
    const { getByRole } = renderWithProviders(<Spinner size="xl" />);
    expect(css(getByRole('status')).fontSize).toBe(lightTheme.fontSize.xl);
  });

  it('unset size sets no font size', () => {
    const { getByRole } = renderWithProviders(
      <div style={{ fontSize: '20px' }}>
        <Spinner />
      </div>
    );
    expect(css(getByRole('status')).fontSize).toBe('20px');
  });

  it('applies className', () => {
    const { getByRole } = renderWithProviders(<Spinner className="extra" />);
    expect(getByRole('status').className).toContain('extra');
  });
});
