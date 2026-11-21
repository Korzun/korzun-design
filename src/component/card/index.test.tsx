import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Card } from './index.js';

describe('Card', () => {
  it('renders footer content when a footer is provided', () => {
    renderWithProviders(
      <Card title="Title" footer={<button>Act</button>}>
        Body
      </Card>
    );
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument();
  });

  it('renders a footer even when the card has no header', () => {
    renderWithProviders(<Card footer={<button>Act</button>}>Body</Card>);
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument();
  });

  it('hides the footer when a collapsible card is collapsed', () => {
    renderWithProviders(
      <Card title="Title" isCollapsible defaultCollapsed footer={<button>Act</button>}>
        Body
      </Card>
    );
    expect(screen.queryByRole('button', { name: 'Act' })).not.toBeInTheDocument();
  });

  it('does not render a footer when none is provided', () => {
    renderWithProviders(<Card title="Title">Body</Card>);
    expect(screen.queryByRole('button', { name: 'Act' })).not.toBeInTheDocument();
  });
});

describe('Card corners', () => {
  it('is lg when large and md + its 1px inset when small (concentric with md children)', () => {
    const { container } = renderWithProviders(
      <>
        <Card>large</Card>
        <Card size="small">small</Card>
      </>
    );
    const [large, small] = Array.from(container.children);
    expect(getComputedStyle(large).borderRadius).toBe(lightTheme.radius.lg);
    // jsdom folds the calc() to `calc(9px)`; compare the resolved pixels.
    const px = (v: string) => parseFloat(v.replace(/^calc\(/, ''));
    expect(px(getComputedStyle(small).borderRadius)).toBe(px(lightTheme.radius.md) + 1);
  });
});
