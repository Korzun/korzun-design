import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../../control/button/index.js';
import { ClockIcon } from '../../icon/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { Card } from '../card/index.js';
import { Page } from '../page/index.js';
import { Alert } from './index.js';

const radiusOf = (el: Element) => getComputedStyle(el).borderRadius;

describe('Alert', () => {
  it('renders title, body and action', () => {
    renderWithProviders(
      <Alert tone="warning" title="Frame is overdue" action={<Button>Retry</Button>}>
        No check-in for 2h 14m.
      </Alert>
    );
    expect(screen.getByText('Frame is overdue')).toBeInTheDocument();
    expect(screen.getByText('No check-in for 2h 14m.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it.each(['warning', 'danger'] as const)('%s uses role="alert"', (tone) => {
    renderWithProviders(<Alert tone={tone}>Body</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Body');
  });

  it.each(['success', 'info'] as const)('%s uses role="status"', (tone) => {
    renderWithProviders(<Alert tone={tone}>Body</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Body');
  });

  it('renders the Icon before the title', () => {
    renderWithProviders(
      <Alert tone="info" title="Heads up" Icon={ClockIcon}>
        Body
      </Alert>
    );
    const svg = screen.getByRole('status').querySelector('svg')!;
    expect(svg.compareDocumentPosition(screen.getByText('Heads up'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it('renders no heading for an empty title', () => {
    renderWithProviders(
      <Alert tone="info" title="">
        Body
      </Alert>
    );
    expect(screen.getByRole('status').querySelector('span')).toBeNull();
  });

  it('applies className to the root', () => {
    renderWithProviders(
      <Alert tone="info" className="extra">
        Body
      </Alert>
    );
    expect(screen.getByRole('status')).toHaveClass('extra');
  });

  it('is 8px inside a Card on a Page and its action Button is 4px', () => {
    renderWithProviders(
      <Page>
        <Card>
          <Alert tone="warning" action={<Button>Retry</Button>}>
            Body
          </Alert>
        </Card>
      </Page>
    );
    expect(radiusOf(screen.getByRole('alert'))).toBe('8px');
    expect(radiusOf(screen.getByRole('button', { name: 'Retry' }))).toBe('4px');
  });

  it('is 16px directly on a Page', () => {
    renderWithProviders(
      <Page>
        <Alert tone="warning">Body</Alert>
      </Page>
    );
    expect(radiusOf(screen.getByRole('alert'))).toBe('16px');
  });

  it('counts as depth 0 without any provider', () => {
    renderWithProviders(
      <Alert tone="warning" action={<Button>Retry</Button>}>
        Body
      </Alert>
    );
    expect(radiusOf(screen.getByRole('alert'))).toBe('16px');
    expect(radiusOf(screen.getByRole('button', { name: 'Retry' }))).toBe('8px');
  });

  it("uses the tone's chip background", () => {
    renderWithProviders(<Alert tone="warning">Body</Alert>);
    const probe = document.createElement('div');
    probe.style.backgroundColor = lightTheme.color.chip.warning.bg;
    expect(getComputedStyle(screen.getByRole('alert')).backgroundColor).toBe(
      probe.style.backgroundColor
    );
  });
});
