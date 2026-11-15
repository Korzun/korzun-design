import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils';
import { ThemeSetting } from './index';

describe('ThemeSetting', () => {
  afterEach(() => localStorage.clear());

  it('renders inside a card with the three theme options', () => {
    renderWithProviders(<ThemeSetting />);
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Light' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Auto' })).toBeInTheDocument();
  });

  it('selects a mode and persists it under the signed-in user’s key', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeSetting />, { identity: 'alice' });
    await user.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem('theme-setting:alice')).toBe('dark');
  });
});
