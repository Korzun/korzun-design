import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { ProgressCircle, type ProgressCircleTone } from './index.js';

const bar = () => screen.getByRole('progressbar');

/** A colour's red, green and blue channels, from hex or rgb() alike. */
const channels = (color: string): number[] => {
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const full = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  }
  return (color.match(/[\d.]+/g) ?? []).map(Number).slice(0, 3);
};

describe('ProgressCircle', () => {
  it('is a named progressbar with the value as a percentage by default', () => {
    renderWithProviders(
      <ProgressCircle value={0.42} ariaLabel="Reading progress for Middlemarch" />
    );
    const el = screen.getByRole('progressbar', { name: 'Reading progress for Middlemarch' });
    expect(el).toHaveAttribute('aria-valuemin', '0');
    expect(el).toHaveAttribute('aria-valuemax', '1');
    expect(el).toHaveAttribute('aria-valuenow', '0.42');
    expect(el).toHaveAttribute('aria-valuetext', '42%');
  });

  it('shows the label beside the circle by default, hidden from screen readers', () => {
    renderWithProviders(<ProgressCircle value={0.42} ariaLabel="Progress" />);
    const label = screen.getByText('42%');
    expect(label).toHaveAttribute('aria-hidden', 'true');
    expect(label.closest('svg')).toBeNull();
  });

  it('draws the circle at 0 and at 1, with no "Not started" or "Completed" text', () => {
    const { container } = renderWithProviders(
      <>
        <ProgressCircle value={0} ariaLabel="a" />
        <ProgressCircle value={1} ariaLabel="b" />
      </>
    );
    expect(container.querySelectorAll('svg')).toHaveLength(2);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.queryByText(/Not started|Completed/)).not.toBeInTheDocument();
  });

  it.each([
    [-0.5, '0%', '0'],
    [1.5, '100%', '1'],
    [Number.NaN, '0%', '0'],
    [undefined as unknown as number, '0%', '0'],
    [Infinity, '0%', '0'],
  ])('clamps %s to show %s', (value, text, now) => {
    renderWithProviders(<ProgressCircle value={value} ariaLabel="Progress" />);
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(bar()).toHaveAttribute('aria-valuenow', now);
  });

  it('rounds the percentage to a whole number', () => {
    renderWithProviders(<ProgressCircle value={0.996} ariaLabel="Progress" />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('max sets the scale: the default unit still shows a percentage', () => {
    renderWithProviders(<ProgressCircle value={3} max={10} ariaLabel="Progress" />);
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(bar()).toHaveAttribute('aria-valuemax', '10');
    expect(bar()).toHaveAttribute('aria-valuenow', '3');
  });

  it('any other unit shows the value itself followed by the unit', () => {
    renderWithProviders(<ProgressCircle value={3} max={10} unit=" of 10" ariaLabel="Chapters" />);
    expect(screen.getByText('3 of 10')).toBeInTheDocument();
    expect(bar()).toHaveAttribute('aria-valuetext', '3 of 10');
  });

  it('unit="" shows the bare value', () => {
    renderWithProviders(<ProgressCircle value={7} max={12} unit="" ariaLabel="Steps" />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('label="inside" draws the text in the circle', () => {
    renderWithProviders(<ProgressCircle value={0.42} label="inside" ariaLabel="Progress" />);
    expect(screen.getByText('42%').closest('svg')).not.toBeNull();
  });

  it('label="none" draws no text but keeps the value text for screen readers', () => {
    const { container } = renderWithProviders(
      <ProgressCircle value={0.42} label="none" ariaLabel="Progress" />
    );
    expect(container).not.toHaveTextContent('42%');
    expect(bar()).toHaveAttribute('aria-valuetext', '42%');
  });

  it('variant="filled" (default) draws a sector; "outline" draws an arc and no sector', () => {
    const { getByTestId, rerender } = renderWithProviders(
      <ProgressCircle value={0.5} ariaLabel="Progress" />
    );
    expect(getByTestId('progress-sector')).toBeInTheDocument();
    rerender(<ProgressCircle value={0.5} variant="outline" ariaLabel="Progress" />);
    expect(getByTestId('progress-arc')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="progress-sector"]')).toBeNull();
  });

  it('filled at 1 is a whole disc, at 0 has no sector', () => {
    const { getByTestId, rerender } = renderWithProviders(
      <ProgressCircle value={1} ariaLabel="Progress" />
    );
    expect(getByTestId('progress-sector').tagName.toLowerCase()).toBe('circle');
    rerender(<ProgressCircle value={0} ariaLabel="Progress" />);
    expect(document.querySelector('[data-testid="progress-sector"]')).toBeNull();
  });

  it('outline arc length follows the value', () => {
    const { getByTestId } = renderWithProviders(
      <ProgressCircle value={0.25} variant="outline" ariaLabel="Progress" />
    );
    const arc = getByTestId('progress-arc');
    expect(arc).toHaveAttribute('pathLength', '100');
    expect(arc).toHaveAttribute('stroke-dasharray', '25 100');
  });

  it.each([
    ['brand', lightTheme.color.brand.default],
    ['success', lightTheme.color.success],
    ['warning', lightTheme.color.warning],
    ['danger', lightTheme.color.danger.default],
    ['neutral', lightTheme.color.text.muted],
  ] as [ProgressCircleTone, string][])('tone %s colours the progress', (tone, colour) => {
    const { getByTestId } = renderWithProviders(
      <ProgressCircle value={0.5} tone={tone} ariaLabel="Progress" />
    );
    expect(channels(getComputedStyle(getByTestId('progress-sector')).fill)).toEqual(
      channels(colour)
    );
  });

  it('has no info tone: it would look the same as brand', () => {
    // @ts-expect-error `info` is the brand blue, so it is not offered.
    const tone: ProgressCircleTone = 'info';
    expect(tone).toBe('info');
  });

  it('size sets the SVG width and height', () => {
    const { container } = renderWithProviders(
      <ProgressCircle value={0.5} size={64} ariaLabel="Progress" />
    );
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '64');
    expect(svg).toHaveAttribute('height', '64');
  });
});
