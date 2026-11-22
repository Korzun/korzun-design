import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Heading } from './index.js';

const css = (el: HTMLElement) => getComputedStyle(el);

const channels = (color: string): number[] => {
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const full = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  }
  return (color.match(/[\d.]+/g) ?? []).map(Number);
};

describe('Heading', () => {
  it.each([
    [1, 'H1', 'xxl', '700'],
    [2, 'H2', 'xl', '700'],
    [3, 'H3', 'lg', '600'],
    [4, 'H4', 'md', '600'],
  ] as const)('level %i renders %s with its size and weight', (level, tag, size, weight) => {
    const { getByTestId } = renderWithProviders(
      <Heading level={level} data-testid="h">
        x
      </Heading>
    );
    const el = getByTestId('h');
    expect(el.tagName).toBe(tag);
    expect(css(el).fontSize).toBe(lightTheme.fontSize[size]);
    expect(css(el).fontWeight).toBe(weight);
  });

  it('defaults to the primary text colour', () => {
    const { getByTestId } = renderWithProviders(
      <Heading level={2} data-testid="h">
        x
      </Heading>
    );
    expect(channels(css(getByTestId('h')).color)).toEqual(channels(lightTheme.color.text.primary));
  });

  it('resets margin and uses tight line height', () => {
    const { getByTestId } = renderWithProviders(
      <Heading level={2} data-testid="h">
        x
      </Heading>
    );
    expect(css(getByTestId('h')).margin).toBe('0px');
    expect(css(getByTestId('h')).lineHeight).toBe(String(lightTheme.lineHeight.tight));
  });

  it('overrides beat the level defaults', () => {
    const { getByTestId } = renderWithProviders(
      <Heading level={2} size="sm" weight="regular" tone="muted" data-testid="h">
        x
      </Heading>
    );
    const el = getByTestId('h');
    expect(el.tagName).toBe('H2');
    expect(css(el).fontSize).toBe(lightTheme.fontSize.sm);
    expect(css(el).fontWeight).toBe('400');
    expect(channels(css(el).color)).toEqual(channels(lightTheme.color.text.muted));
  });

  it('truncate clips to one line', () => {
    const { getByTestId } = renderWithProviders(
      <Heading level={3} truncate data-testid="h">
        x
      </Heading>
    );
    expect(css(getByTestId('h')).textOverflow).toBe('ellipsis');
    expect(css(getByTestId('h')).whiteSpace).toBe('nowrap');
    expect(css(getByTestId('h')).maxWidth).toBe('100%');
  });

  it('passes through attributes, ref and className', () => {
    const ref = createRef<HTMLHeadingElement>();
    const { getByTestId } = renderWithProviders(
      <Heading level={1} id="title" ref={ref} className="extra" data-testid="h">
        x
      </Heading>
    );
    const el = getByTestId('h');
    expect(el.id).toBe('title');
    expect(el.classList.contains('extra')).toBe(true);
    expect(ref.current).toBe(el);
  });
});
