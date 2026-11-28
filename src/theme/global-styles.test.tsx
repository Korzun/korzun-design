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
