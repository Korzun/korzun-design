import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../test-utils.js';

describe('GlobalStyles reset', () => {
  it('sizes every element border-box with no default margin or padding', () => {
    const { container } = renderWithProviders(
      <div>
        <input />
        <p>text</p>
      </div>
    );
    const input = container.querySelector('input')!;
    expect(getComputedStyle(input).boxSizing).toBe('border-box');
    const p = container.querySelector('p')!;
    expect(getComputedStyle(p).marginTop).toBe('0px');
    expect(getComputedStyle(p).paddingLeft).toBe('0px');
  });
});

describe('GlobalStyles colour scheme', () => {
  // The rule as injected: jsdom does not compute `color-scheme`.
  const scheme = (selector: string) =>
    Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules))
      .filter((rule): rule is CSSStyleRule => 'selectorText' in rule)
      .filter((rule) => rule.selectorText === selector)
      .map((rule) => rule.style.getPropertyValue('color-scheme'))
      .filter(Boolean)
      .at(-1);

  afterEach(() => localStorage.clear());

  it.each(['light', 'dark'] as const)(
    'sets the %s scheme on html as well as body, so framed documents and the root scrollbar match',
    (mode) => {
      localStorage.setItem('theme-setting:scheme', mode);
      renderWithProviders(<p>text</p>, { identity: 'scheme' });
      expect(scheme('html')).toBe(mode);
      expect(scheme('body')).toBe(mode);
    }
  );
});
