import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../../control/button/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Card } from '../card/index.js';
import { Page } from '../page/index.js';
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

describe('CardRow follows surface depth', () => {
  const radiusOf = (el: Element) => getComputedStyle(el).borderRadius;

  it('is 16px on a Page', () => {
    renderWithProviders(
      <Page>
        <CardRow>row</CardRow>
      </Page>
    );
    expect(radiusOf(screen.getByText('row'))).toBe('16px');
  });

  it('is 8px inside a Card', () => {
    renderWithProviders(
      <Page>
        <Card>
          <CardRow>row</CardRow>
        </Card>
      </Page>
    );
    expect(radiusOf(screen.getByText('row'))).toBe('8px');
  });

  it('its Button is 4px inside a Card', () => {
    renderWithProviders(
      <Page>
        <Card>
          <CardRow>
            <Button>Go</Button>
          </CardRow>
        </Card>
      </Page>
    );
    expect(radiusOf(screen.getByRole('button', { name: 'Go' }))).toBe('4px');
  });
});
