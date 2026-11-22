import { fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Stack } from './index.js';

const spaceKeys = Object.keys(lightTheme.space) as (keyof typeof lightTheme.space)[];

describe('Stack', () => {
  it('defaults to a column div with gap md and stretch', () => {
    const { getByTestId } = renderWithProviders(<Stack data-testid="s" />);
    const el = getByTestId('s');
    const computed = getComputedStyle(el);
    expect(el.tagName).toBe('DIV');
    expect(computed.display).toBe('flex');
    expect(computed.flexDirection).toBe('column');
    expect(computed.gap).toBe(lightTheme.space.md);
    expect(computed.alignItems).toBe('stretch');
    expect(computed.minWidth).toBe('0px');
  });

  it.each(spaceKeys)('gap %s uses the space token', (key) => {
    const { getByTestId } = renderWithProviders(<Stack data-testid="s" gap={key} />);
    expect(getComputedStyle(getByTestId('s')).gap).toBe(lightTheme.space[key]);
  });

  it('gap none emits 0', () => {
    const { getByTestId } = renderWithProviders(<Stack data-testid="s" gap="none" />);
    expect(['0', '0px']).toContain(getComputedStyle(getByTestId('s')).gap);
  });

  it.each([
    ['start', 'flex-start'],
    ['center', 'center'],
    ['end', 'flex-end'],
  ] as const)('align %s maps to alignItems %s', (align, expected) => {
    const { getByTestId } = renderWithProviders(<Stack data-testid="s" align={align} />);
    expect(getComputedStyle(getByTestId('s')).alignItems).toBe(expected);
  });

  it('as="ul" renders a reset list', () => {
    const { getByTestId } = renderWithProviders(<Stack data-testid="s" as="ul" />);
    const el = getByTestId('s');
    const computed = getComputedStyle(el);
    expect(el.tagName).toBe('UL');
    expect(computed.margin).toBe('0px');
    expect(computed.padding).toBe('0px');
    expect(computed.listStyle).toContain('none');
  });

  it('as="section" renders a section', () => {
    const { getByTestId } = renderWithProviders(<Stack data-testid="s" as="section" />);
    expect(getByTestId('s').tagName).toBe('SECTION');
  });

  it('passes attributes and ref through', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLElement>();
    const { getByTestId } = renderWithProviders(
      <Stack data-testid="s" id="x" aria-label="L" data-x="1" onClick={onClick} ref={ref} />
    );
    const el = getByTestId('s');
    expect(el.id).toBe('x');
    expect(el.getAttribute('aria-label')).toBe('L');
    expect(el.getAttribute('data-x')).toBe('1');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(el);
  });

  it('applies className', () => {
    const { getByTestId } = renderWithProviders(<Stack data-testid="s" className="extra" />);
    expect(getByTestId('s').classList.contains('extra')).toBe(true);
  });
});
