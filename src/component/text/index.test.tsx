import { fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Space } from '../space/index.js';
import { Text } from './index.js';

const css = (el: HTMLElement) => getComputedStyle(el);

const channels = (color: string): number[] => {
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const full = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  }
  return (color.match(/[\d.]+/g) ?? []).map(Number);
};

describe('Text', () => {
  it('renders a span by default', () => {
    const { getByTestId } = renderWithProviders(<Text data-testid="t">x</Text>);
    expect(getByTestId('t').tagName).toBe('SPAN');
  });

  it('a bare Text emits no size, tone, or weight class and inherits', () => {
    const { getByTestId } = renderWithProviders(
      <div style={{ color: 'rgb(1, 2, 3)', fontSize: '20px' }}>
        <Text data-testid="t">x</Text>
      </div>
    );
    const el = getByTestId('t');
    expect(el.className).not.toMatch(/size-|tone-|weight-/);
    expect(css(el).color).toBe('rgb(1, 2, 3)');
    expect(css(el).fontSize).toBe('20px');
  });

  it.each(Object.keys(lightTheme.fontSize) as (keyof typeof lightTheme.fontSize)[])(
    'size %s uses the token',
    (size) => {
      const { getByTestId } = renderWithProviders(
        <Text data-testid="t" size={size}>
          x
        </Text>
      );
      expect(css(getByTestId('t')).fontSize).toBe(lightTheme.fontSize[size]);
    }
  );

  it.each(['primary', 'secondary', 'muted', 'faint', 'description'] as const)(
    'tone %s uses color.text.%s',
    (tone) => {
      const { getByTestId } = renderWithProviders(
        <Text data-testid="t" tone={tone}>
          x
        </Text>
      );
      expect(channels(css(getByTestId('t')).color)).toEqual(channels(lightTheme.color.text[tone]));
    }
  );

  it('danger and success use the chip text colours', () => {
    const { getByTestId } = renderWithProviders(
      <>
        <Text data-testid="d" tone="danger">
          x
        </Text>
        <Text data-testid="s" tone="success">
          x
        </Text>
      </>
    );
    expect(channels(css(getByTestId('d')).color)).toEqual(
      channels(lightTheme.color.chip.danger.text)
    );
    expect(channels(css(getByTestId('s')).color)).toEqual(
      channels(lightTheme.color.chip.success.text)
    );
  });

  it('weight regular is 400', () => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" weight="regular">
        x
      </Text>
    );
    expect(css(getByTestId('t')).fontWeight).toBe('400');
  });

  it('weight bold is 700', () => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" weight="bold">
        x
      </Text>
    );
    expect(css(getByTestId('t')).fontWeight).toBe('700');
  });

  it('truncate on a span clips with an ellipsis and becomes inline-block', () => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" truncate>
        x
      </Text>
    );
    const c = css(getByTestId('t'));
    expect(c.overflow).toBe('hidden');
    expect(c.textOverflow).toBe('ellipsis');
    expect(c.whiteSpace).toBe('nowrap');
    expect(c.minWidth).toBe('0px');
    expect(c.display).toBe('inline-block');
    expect(c.maxWidth).toBe('100%');
  });

  it('truncate on a div keeps block display', () => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" as="div" truncate>
        x
      </Text>
    );
    expect(css(getByTestId('t')).display).not.toBe('inline-block');
    expect(css(getByTestId('t')).overflow).toBe('hidden');
    expect(css(getByTestId('t')).maxWidth).toBe('100%');
  });

  it('truncated Text inside Space can shrink', () => {
    const { getByTestId } = renderWithProviders(
      <Space>
        <Text data-testid="t" truncate>
          a long title
        </Text>
      </Space>
    );
    expect(css(getByTestId('t')).minWidth).toBe('0px');
  });

  it('as="p" resets margin', () => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" as="p">
        x
      </Text>
    );
    expect(getByTestId('t').tagName).toBe('P');
    expect(css(getByTestId('t')).margin).toBe('0px');
  });

  it('as="label" passes htmlFor', () => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" as="label" htmlFor="field">
        x
      </Text>
    );
    expect(getByTestId('t').tagName).toBe('LABEL');
    expect(getByTestId('t').getAttribute('for')).toBe('field');
  });

  it.each(['strong', 'em', 'div'] as const)('as="%s" renders that tag', (as) => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" as={as}>
        x
      </Text>
    );
    expect(getByTestId('t').tagName).toBe(as.toUpperCase());
  });

  it('passes attributes and ref through', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLElement>();
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" id="x" aria-live="polite" data-x="1" onClick={onClick} ref={ref}>
        x
      </Text>
    );
    const el = getByTestId('t');
    expect(el.id).toBe('x');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('data-x')).toBe('1');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(el);
  });

  it('applies className', () => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="t" className="extra">
        x
      </Text>
    );
    expect(getByTestId('t').className).toContain('extra');
  });
});
