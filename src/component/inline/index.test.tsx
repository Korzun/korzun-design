import { fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Inline } from './index.js';

const css = (el: HTMLElement) => getComputedStyle(el);

describe('Inline', () => {
  it('defaults to a row div with gap sm, centred, start, no wrap', () => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" />);
    const el = getByTestId('i');
    expect(el.tagName).toBe('DIV');
    expect(css(el).display).toBe('flex');
    expect(css(el).flexDirection).toBe('row');
    expect(css(el).gap).toBe(lightTheme.space.sm);
    expect(css(el).alignItems).toBe('center');
    expect(css(el).justifyContent).toBe('flex-start');
    expect(css(el).flexWrap).not.toBe('wrap');
  });

  it.each([
    ['between', 'space-between'],
    ['center', 'center'],
    ['end', 'flex-end'],
  ] as const)('justify %s maps to %s', (justify, expected) => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" justify={justify} />);
    expect(css(getByTestId('i')).justifyContent).toBe(expected);
  });

  it.each([
    ['start', 'flex-start'],
    ['end', 'flex-end'],
    ['baseline', 'baseline'],
    ['stretch', 'stretch'],
  ] as const)('align %s maps to %s', (align, expected) => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" align={align} />);
    expect(css(getByTestId('i')).alignItems).toBe(expected);
  });

  it('wrap sets flex-wrap', () => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" wrap />);
    expect(css(getByTestId('i')).flexWrap).toBe('wrap');
  });

  it('gap xxl uses the space token', () => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" gap="xxl" />);
    expect(css(getByTestId('i')).gap).toBe(lightTheme.space.xxl);
  });

  it('gap none emits 0', () => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" gap="none" />);
    expect(['0', '0px']).toContain(css(getByTestId('i')).gap);
  });

  it.each(['nav', 'span'] as const)('as="%s" renders that tag', (as) => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" as={as} />);
    expect(getByTestId('i').tagName).toBe(as.toUpperCase());
  });

  it('as="ol" renders a reset list', () => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" as="ol" />);
    const el = getByTestId('i');
    expect(el.tagName).toBe('OL');
    expect(css(el).margin).toBe('0px');
    expect(css(el).padding).toBe('0px');
    expect(css(el).listStyle).toContain('none');
  });

  it('passes attributes and ref through', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLElement>();
    const { getByTestId } = renderWithProviders(
      <Inline data-testid="i" id="x" aria-label="L" data-x="1" onClick={onClick} ref={ref} />
    );
    const el = getByTestId('i');
    expect(el.id).toBe('x');
    expect(el.getAttribute('aria-label')).toBe('L');
    expect(el.getAttribute('data-x')).toBe('1');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(el);
  });

  it('applies className', () => {
    const { getByTestId } = renderWithProviders(<Inline data-testid="i" className="extra" />);
    expect(getByTestId('i').classList.contains('extra')).toBe(true);
  });
});
