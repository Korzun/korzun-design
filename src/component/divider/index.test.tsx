import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { Dialog } from '../../control/dialog/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/index.js';
import { CardRow } from '../card-row/index.js';
import { Card } from '../card/index.js';
import { Surface } from '../surface/index.js';
import { Divider } from './index.js';

describe('Divider', () => {
  it('renders a separator with no label by default', () => {
    renderWithProviders(<Divider />);
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    expect(sep.textContent).toBe('');
  });

  it('renders the optional label text when provided', () => {
    renderWithProviders(<Divider>Cover</Divider>);
    expect(screen.getByText('Cover')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveTextContent('Cover');
  });

  it.each(['left', 'center', 'right'] as const)('renders the label with align=%s', (align) => {
    renderWithProviders(<Divider align={align}>Cover</Divider>);
    expect(screen.getByText('Cover')).toBeInTheDocument();
  });

  it('renders actions alongside the label on the divider', () => {
    renderWithProviders(<Divider actions={<button>Apply all</button>}>Suggested fixes</Divider>);
    expect(screen.getByText('Suggested fixes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply all' })).toBeInTheDocument();
  });

  it('renders actions on their own when there is no label', () => {
    renderWithProviders(<Divider actions={<button>Apply all</button>} />);
    expect(screen.getByRole('button', { name: 'Apply all' })).toBeInTheDocument();
  });

  it('stacks label before actions when they share a position', () => {
    renderWithProviders(
      <Divider align="left" actions={<button>Go</button>} actionsAlign="left">
        Label
      </Divider>
    );
    // Label renders before the action within the same group.
    expect(screen.getByRole('separator')).toHaveTextContent('LabelGo');
  });
});

const margin = (el: Element) => getComputedStyle(el).marginLeft;

describe('Divider bleed', () => {
  beforeAll(() => {
    // jsdom has no modal dialogs.
    HTMLDialogElement.prototype.showModal = () => {};
    HTMLDialogElement.prototype.close = () => {};
  });

  it('spans its container outside a Card or Dialog', () => {
    renderWithProviders(<Divider />);
    expect(margin(screen.getByRole('separator'))).toBe('0px');
  });

  it('cancels a large Card body padding (space.xl)', () => {
    renderWithProviders(
      <Card title="T">
        <Divider />
      </Card>
    );
    expect(margin(screen.getByRole('separator'))).toBe(`-${lightTheme.space.xl}`);
  });

  it('cancels a small Card body padding', () => {
    renderWithProviders(
      <Card size="small">
        <Divider />
      </Card>
    );
    expect(margin(screen.getByRole('separator'))).toBe('-1px');
  });

  it('cancels a Dialog body padding (space.xxl)', () => {
    renderWithProviders(
      <Dialog open title="T" onClose={() => {}}>
        <Divider />
      </Dialog>
    );
    expect(margin(screen.getByRole('separator', { hidden: true }))).toBe(
      `-${lightTheme.space.xxl}`
    );
  });

  it.each([
    ['a CardRow', (d: React.ReactNode) => <CardRow>{d}</CardRow>],
    ['a Surface', (d: React.ReactNode) => <Surface>{d}</Surface>],
  ])('stays inside %s in a Card', (_, wrap) => {
    renderWithProviders(<Card title="T">{wrap(<Divider />)}</Card>);
    expect(margin(screen.getByRole('separator'))).toBe('0px');
  });

  it('bleed={false} opts out inside a Card; bleed does nothing outside one', () => {
    renderWithProviders(
      <>
        <Card title="T">
          <Divider bleed={false}>In</Divider>
        </Card>
        <Divider bleed>Out</Divider>
      </>
    );
    const [inCard, outside] = screen.getAllByRole('separator');
    expect(margin(inCard)).toBe('0px');
    expect(margin(outside)).toBe('0px');
  });
});
