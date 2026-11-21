import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { CardRow } from './index.js';

describe('CardRow', () => {
  it('calls onClick on click, Enter and Space', () => {
    const onClick = vi.fn();
    renderWithProviders(<CardRow onClick={onClick}>row</CardRow>);
    const row = screen.getByText('row');
    fireEvent.click(row);
    fireEvent.keyDown(row, { key: 'Enter' });
    fireEvent.keyDown(row, { key: ' ' });
    fireEvent.keyDown(row, { key: 'a' });
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('renders its children without a handler', () => {
    renderWithProviders(<CardRow>plain</CardRow>);
    expect(screen.getByText('plain')).toBeInTheDocument();
  });
});

describe('CardRow corners', () => {
  it('takes the card shell radius (lg), since it sits on the page background', () => {
    const { container } = renderWithProviders(<CardRow>row</CardRow>);
    expect(getComputedStyle(container.firstElementChild!).borderRadius).toBe(lightTheme.radius.lg);
  });
});
