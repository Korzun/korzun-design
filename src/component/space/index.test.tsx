import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Space } from './index.js';

const spaceKeys = Object.keys(lightTheme.space) as (keyof typeof lightTheme.space)[];
describe('Space', () => {
  it('defaults to a horizontal row', () => {
    const { getByTestId } = renderWithProviders(<Space data-testid="s" />);
    const el = getByTestId('s');
    const c = getComputedStyle(el);
    expect(el.tagName).toBe('DIV');
    expect(c.flexDirection).toBe('row');
    expect(c.alignItems).toBe('center');
    expect(c.gap).toBe(lightTheme.space.sm);
    expect(c.flexWrap).toBe('nowrap');
    expect(c.minWidth).toBe('0px');
  });

  it('direction="vertical" is a column', () => {
    const { getByTestId } = renderWithProviders(<Space data-testid="s" direction="vertical" />);
    const c = getComputedStyle(getByTestId('s'));
    expect(c.flexDirection).toBe('column');
    expect(c.alignItems).toBe('stretch');
    expect(c.gap).toBe(lightTheme.space.md);
  });

  it.each(spaceKeys)('gap %s uses the space token', (key) => {
    const { getByTestId } = renderWithProviders(<Space data-testid="s" gap={key} />);
    expect(getComputedStyle(getByTestId('s')).gap).toBe(lightTheme.space[key]);
  });

  it('gap none emits 0', () => {
    const { getByTestId } = renderWithProviders(<Space data-testid="s" gap="none" />);
    expect(['0', '0px']).toContain(getComputedStyle(getByTestId('s')).gap);
  });

  it.each([
    ['start', 'flex-start'],
    ['center', 'center'],
    ['end', 'flex-end'],
    ['baseline', 'baseline'],
    ['stretch', 'stretch'],
  ] as const)('align %s maps to alignItems %s', (align, expected) => {
    const { getByTestId } = renderWithProviders(<Space data-testid="s" align={align} />);
    expect(getComputedStyle(getByTestId('s')).alignItems).toBe(expected);
  });

  it.each([
    ['start', 'flex-start'],
    ['center', 'center'],
    ['end', 'flex-end'],
    ['between', 'space-between'],
  ] as const)('justify %s maps to justifyContent %s', (justify, expected) => {
    const { getByTestId } = renderWithProviders(<Space data-testid="s" justify={justify} />);
    expect(getComputedStyle(getByTestId('s')).justifyContent).toBe(expected);
  });

  it('wrap sets flex-wrap', () => {
    const { getByTestId } = renderWithProviders(
      <>
        <Space data-testid="a" wrap />
        <Space data-testid="b" />
      </>
    );
    expect(getComputedStyle(getByTestId('a')).flexWrap).toBe('wrap');
    expect(getComputedStyle(getByTestId('b')).flexWrap).not.toBe('wrap');
  });

  it.each(['div', 'section', 'span', 'nav', 'ul', 'ol', 'li'] as const)(
    'as="%s" renders that tag',
    (as) => {
      const { getByTestId } = renderWithProviders(<Space data-testid="s" as={as} />);
      expect(getByTestId('s').tagName).toBe(as.toUpperCase());
    }
  );

  it.each(['ul', 'ol'] as const)('as="%s" resets the list', (as) => {
    const { getByTestId } = renderWithProviders(<Space data-testid="s" as={as} />);
    const c = getComputedStyle(getByTestId('s'));
    expect(c.margin).toBe('0px');
    expect(c.padding).toBe('0px');
    expect(c.listStyle).toContain('none');
  });

  it('split draws a hidden separator between items only', () => {
    const { getByTestId } = renderWithProviders(
      <Space data-testid="s" split="·">
        {['a', null, false, 'b', <>{'c'}</>]}
      </Space>
    );
    const el = getByTestId('s');
    expect(el.textContent).toBe('a·b·c');
    const seps = el.querySelectorAll('[aria-hidden="true"]');
    expect(seps).toHaveLength(2);
    seps.forEach((s) => expect(s.textContent).toBe('·'));
  });

  it('split skips empty fragments', () => {
    const { getByTestId } = renderWithProviders(
      <Space data-testid="s" split="·">
        <b>a</b>
        <></>
        <>{null}</>
        <b>b</b>
      </Space>
    );
    const el = getByTestId('s');
    expect(el.textContent).toBe('a·b');
    expect(el.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it('split skips empty strings, as `{str && <X />}` leaves when str is empty', () => {
    const empty = '';
    const { getByTestId } = renderWithProviders(
      <Space data-testid="s" split="·">
        <b>a</b>
        {empty && <b>never</b>}
        <>{empty}</>
        <b>b</b>
      </Space>
    );
    const el = getByTestId('s');
    expect(el.textContent).toBe('a·b');
    expect(el.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it('split separates the children of a multi-child fragment', () => {
    const { getByTestId } = renderWithProviders(
      <Space data-testid="s" split="·">
        <>
          <b>x</b>
          <i>y</i>
        </>
      </Space>
    );
    expect(getByTestId('s').textContent).toBe('x·y');
  });

  it.each([
    [
      'sibling fragments',
      [
        <>
          <b>a</b>
        </>,
        <>
          <i>b</i>
        </>,
      ],
      'a·b',
    ],
    [
      'a child beside a fragment',
      [
        <b>a</b>,
        <>
          <i>b</i>
          <u>c</u>
        </>,
      ],
      'a·b·c',
    ],
  ])('split gives unique keys for %s', (_name, items, text) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { getByTestId } = renderWithProviders(
      <Space data-testid="s" split="·">
        {...items}
      </Space>
    );
    expect(getByTestId('s').textContent).toBe(text);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('split inside a list keeps every child an li', () => {
    const { getByTestId } = renderWithProviders(
      <Space data-testid="s" as="ul" split="|">
        <li>a</li>
        <li>b</li>
      </Space>
    );
    const kids = Array.from(getByTestId('s').children);
    expect(kids).toHaveLength(3);
    kids.forEach((k) => expect(k.tagName).toBe('LI'));
    expect(kids[1].getAttribute('role')).toBe('presentation');
    expect(kids[1].getAttribute('aria-hidden')).toBe('true');
  });

  it('passes className, ref and attributes to the root', () => {
    const ref = createRef<HTMLElement>();
    const { getByTestId } = renderWithProviders(
      <Space data-testid="s" data-x="1" aria-label="row" className="extra" ref={ref} />
    );
    const el = getByTestId('s');
    expect(el.className).toContain('extra');
    expect(el.getAttribute('data-x')).toBe('1');
    expect(el.getAttribute('aria-label')).toBe('row');
    expect(ref.current).toBe(el);
  });
});
