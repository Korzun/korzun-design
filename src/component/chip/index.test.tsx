import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Chip } from './index.js';

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

describe('Chip', () => {
  it('renders the compact variant only when size="sm"', () => {
    renderWithProviders(
      <>
        <Chip>Default</Chip>
        <Chip size="sm">Compact</Chip>
      </>
    );
    // react-jss embeds the rule name in the generated class, so the compact
    // `sm` rule is present on the small chip and absent on the default one.
    expect(screen.getByText('Default').className).not.toMatch(/\bsm\b|sm-/);
    expect(screen.getByText('Compact').className).toMatch(/sm/);
  });

  it('defaults to the subject tone', () => {
    renderWithProviders(<Chip>Default</Chip>);
    expectTone(screen.getByText('Default'), lightTheme.color.chip.subject);
  });

  it('colours from the given tone', () => {
    renderWithProviders(<Chip tone="author">Published</Chip>);
    expectTone(screen.getByText('Published'), lightTheme.color.chip.author);
  });

  it('renders the neutral tone grey', () => {
    renderWithProviders(<Chip tone="neutral">No change</Chip>);
    expectTone(screen.getByText('No change'), lightTheme.color.chip.neutral);
  });

  it.each(['success', 'warning', 'danger', 'info'] as const)(
    'renders the %s status tone',
    (tone) => {
      renderWithProviders(<Chip tone={tone}>{tone}</Chip>);
      expectTone(screen.getByText(tone), lightTheme.color.chip[tone]);
    }
  );

  it('keeps size and onClick working with a tone', () => {
    const onClick = vi.fn();
    renderWithProviders(
      <Chip tone="neutral" size="sm" onClick={onClick}>
        Chip
      </Chip>
    );
    const chip = screen.getByRole('button', { name: 'Chip' });
    expect(chip.className).toMatch(/sm/);
    expectTone(chip, lightTheme.color.chip.neutral);
    fireEvent.click(chip);
    fireEvent.keyDown(chip, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
