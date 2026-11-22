import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { ErrorMessage } from './index.js';

const css = (el: HTMLElement) => getComputedStyle(el);

const channels = (color: string): number[] => {
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const full = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  }
  return (color.match(/[\d.]+/g) ?? []).map(Number);
};

describe('ErrorMessage', () => {
  it('renders a p with role="alert"', () => {
    const { getByRole } = renderWithProviders(<ErrorMessage>Bad input</ErrorMessage>);
    const el = getByRole('alert');
    expect(el.tagName).toBe('P');
    expect(el.textContent).toBe('Bad input');
  });

  it.each([null, undefined, false, ''])('renders nothing when children is %j', (children) => {
    const { container, queryByRole } = renderWithProviders(<ErrorMessage>{children}</ErrorMessage>);
    // The provider wraps children in a div; the message adds nothing inside it.
    expect(container.firstElementChild?.childElementCount ?? 0).toBe(0);
    expect(queryByRole('alert')).toBeNull();
  });

  it('renders 0', () => {
    const { getByRole } = renderWithProviders(<ErrorMessage>{0}</ErrorMessage>);
    expect(getByRole('alert').textContent).toBe('0');
  });

  it('uses the danger colour and small size', () => {
    const { getByRole } = renderWithProviders(<ErrorMessage>x</ErrorMessage>);
    const el = getByRole('alert');
    expect(channels(css(el).color)).toEqual(channels(lightTheme.color.danger.default));
    expect(css(el).fontSize).toBe(lightTheme.fontSize.sm);
  });

  it('has no margin or padding', () => {
    const { getByRole } = renderWithProviders(<ErrorMessage>x</ErrorMessage>);
    const el = getByRole('alert');
    expect(css(el).margin).toBe('0px');
    expect(css(el).padding).toBe('0px');
  });

  it.each(['div', 'span'] as const)('as renders a %s', (as) => {
    const { getByRole } = renderWithProviders(<ErrorMessage as={as}>x</ErrorMessage>);
    expect(getByRole('alert').tagName).toBe(as.toUpperCase());
  });

  it('passes id and aria attributes through', () => {
    const { getByRole } = renderWithProviders(
      <ErrorMessage id="e" aria-live="assertive">
        x
      </ErrorMessage>
    );
    const el = getByRole('alert');
    expect(el.id).toBe('e');
    expect(el.getAttribute('aria-live')).toBe('assertive');
  });

  it('applies className and ref', () => {
    const ref = createRef<HTMLElement>();
    const { getByRole } = renderWithProviders(
      <ErrorMessage className="extra" ref={ref}>
        x
      </ErrorMessage>
    );
    expect(getByRole('alert').classList.contains('extra')).toBe(true);
    expect(ref.current).toBe(getByRole('alert'));
  });
});
