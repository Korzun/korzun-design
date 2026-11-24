import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../../control/button/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Page } from '../page/index.js';
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

describe('Card follows surface depth', () => {
  const radiusOf = (el: Element) => getComputedStyle(el).borderRadius;

  it('is 16px outside any surface and on a Page', () => {
    const { container } = renderWithProviders(<Card>a</Card>);
    expect(radiusOf(container.firstElementChild!)).toBe('16px');
    const page = renderWithProviders(
      <Page>
        <Card>b</Card>
      </Page>
    );
    expect(radiusOf(page.getByText('b').parentElement!)).toBe('16px');
  });

  it('a Card inside a Card is 8px', () => {
    renderWithProviders(
      <Page>
        <Card>
          <Card>inner</Card>
        </Card>
      </Page>
    );
    expect(radiusOf(screen.getByText('inner').parentElement!)).toBe('8px');
  });

  it('a Card three deep is 4px and its Button is 4px', () => {
    renderWithProviders(
      <Page>
        <Card>
          <Card>
            <Card>
              deep
              <Button>Go</Button>
            </Card>
          </Card>
        </Card>
      </Page>
    );
    expect(radiusOf(screen.getByText('deep').parentElement!)).toBe('4px');
    expect(radiusOf(screen.getByRole('button', { name: 'Go' }))).toBe('4px');
  });

  it('small card is calc(8px + 1px) on a Page and calc(4px + 1px) inside a Card', () => {
    renderWithProviders(
      <Page>
        <Card size="small">outer</Card>
        <Card>
          <Card size="small">inner</Card>
        </Card>
      </Page>
    );
    // jsdom folds calc(8px + 1px) to calc(9px).
    expect(radiusOf(screen.getByText('outer').parentElement!)).toBe('calc(9px)');
    expect(radiusOf(screen.getByText('inner').parentElement!)).toBe('calc(5px)');
  });

  it('Buttons in the body, headerAction and footer are 8px on a Page', () => {
    renderWithProviders(
      <Page>
        <Card title="T" headerAction={<Button>Head</Button>} footer={<Button>Foot</Button>}>
          <Button>Body</Button>
        </Card>
      </Page>
    );
    for (const name of ['Head', 'Body', 'Foot']) {
      expect(radiusOf(screen.getByRole('button', { name }))).toBe('8px');
    }
  });
});
