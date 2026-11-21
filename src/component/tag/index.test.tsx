import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Tag } from './index.js';

// jsdom normalises colours (`#8a5e00` → `rgb(138, 94, 0)`, spacing in rgba());
// compare channel lists so a hex token and its computed rgb() form match.
const channels = (color: string): number[] => {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16));
  return (color.match(/[\d.]+/g) ?? []).map(Number);
};

const expectTone = (el: HTMLElement, chip: { text: string; bg: string; border: string }) => {
  const computed = getComputedStyle(el);
  expect(channels(computed.color)).toEqual(channels(chip.text));
  expect(channels(computed.backgroundColor)).toEqual(channels(chip.bg));
  expect(channels(computed.borderColor)).toEqual(channels(chip.border));
};

describe('Tag', () => {
  it('renders the compact variant only when size="sm"', () => {
    renderWithProviders(
      <>
        <Tag>Default</Tag>
        <Tag size="sm">Compact</Tag>
      </>
    );
    // react-jss embeds the rule name in the generated class, so the compact
    // `sm` rule is present on the small chip and absent on the default one.
    expect(screen.getByText('Default').className).not.toMatch(/\bsm\b|sm-/);
    expect(screen.getByText('Compact').className).toMatch(/sm/);
  });

  it('defaults to the subject tone', () => {
    renderWithProviders(<Tag>Default</Tag>);
    expectTone(screen.getByText('Default'), lightTheme.color.chip.subject);
  });

  it('colours from the given tone', () => {
    renderWithProviders(<Tag tone="author">Published</Tag>);
    expectTone(screen.getByText('Published'), lightTheme.color.chip.author);
  });

  it('renders the neutral tone grey', () => {
    renderWithProviders(<Tag tone="neutral">No change</Tag>);
    expectTone(screen.getByText('No change'), lightTheme.color.chip.neutral);
  });

  it('keeps size and onClick working with a tone', () => {
    const onClick = vi.fn();
    renderWithProviders(
      <Tag tone="neutral" size="sm" onClick={onClick}>
        Chip
      </Tag>
    );
    const chip = screen.getByRole('button', { name: 'Chip' });
    expect(chip.className).toMatch(/sm/);
    expectTone(chip, lightTheme.color.chip.neutral);
    fireEvent.click(chip);
    fireEvent.keyDown(chip, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
