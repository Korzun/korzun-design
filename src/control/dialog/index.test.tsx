import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { Inline } from '../../component/inline/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { Button } from '../button/index.js';
import { Dialog } from './index.js';

let showModal: Mock<() => void>;
let close: Mock<() => void>;

beforeEach(() => {
  showModal = vi.fn<() => void>();
  close = vi.fn<() => void>();
  HTMLDialogElement.prototype.showModal = showModal;
  HTMLDialogElement.prototype.close = close;
});

const cancel = (container: HTMLElement) =>
  fireEvent(container.querySelector('dialog')!, new Event('cancel', { cancelable: true }));

const radiusOf = (name: string) =>
  getComputedStyle(screen.getByText(name).closest('[role="button"]')!).borderRadius;

describe('Dialog', () => {
  it('calls showModal when mounted open', () => {
    renderWithProviders(<Dialog open onClose={() => {}} title="T" />);
    expect(showModal).toHaveBeenCalledOnce();
  });

  it('calls close when open turns false', () => {
    const { rerender } = renderWithProviders(<Dialog open onClose={() => {}} title="T" />);
    rerender(<Dialog open={false} onClose={() => {}} title="T" />);
    expect(close).toHaveBeenCalled();
  });

  it('Escape calls onClose', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(<Dialog open onClose={onClose} title="T" />);
    cancel(container);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('a backdrop press and release calls onClose', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(<Dialog open onClose={onClose} title="T" />);
    const dialog = container.querySelector('dialog')!;
    fireEvent.mouseDown(dialog);
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('canDismiss={false} blocks Escape and backdrop', () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <Dialog open onClose={onClose} title="T" canDismiss={false} />
    );
    cancel(container);
    const dialog = container.querySelector('dialog')!;
    fireEvent.mouseDown(dialog);
    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('blocks Escape after canDismiss flips to false while open', () => {
    const onClose = vi.fn();
    const { container, rerender } = renderWithProviders(
      <Dialog open onClose={onClose} title="T" canDismiss />
    );
    rerender(<Dialog open onClose={onClose} title="T" canDismiss={false} />);
    cancel(container);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('names the dialog by its title', () => {
    // jsdom drops the name when the labelled dialog is closed (display: none), so open it as a browser would.
    showModal.mockImplementation(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    renderWithProviders(<Dialog open onClose={() => {}} title="Fixes waiting" />);
    expect(screen.getByRole('dialog', { name: 'Fixes waiting', hidden: true })).toBeInTheDocument();
  });

  it('draws no footer bar without footer, and one with it', () => {
    const { container, rerender } = renderWithProviders(
      <Dialog open onClose={() => {}} title="T">
        Body
      </Dialog>
    );
    expect(container.querySelector('[data-dialog-footer]')).toBeNull();
    rerender(
      <Dialog open onClose={() => {}} title="T" footer={<span>Foot</span>}>
        Body
      </Dialog>
    );
    expect(container.querySelector('[data-dialog-footer]')).toHaveTextContent('Foot');
  });

  it('footer Buttons default to the modal radius', () => {
    renderWithProviders(
      <>
        <Button radius="modal">Standalone modal</Button>
        <Button radius="inset">Standalone inset</Button>
        <Button>Standalone default</Button>
        <Dialog
          open
          onClose={() => {}}
          title="T"
          footer={
            <>
              <Button>Foot default</Button>
              <Button radius="inset">Foot inset</Button>
            </>
          }
        >
          <Button>Body default</Button>
        </Dialog>
      </>
    );
    expect(radiusOf('Foot default')).toBe(radiusOf('Standalone modal'));
    expect(radiusOf('Foot inset')).toBe(radiusOf('Standalone inset'));
    expect(radiusOf('Body default')).toBe(radiusOf('Standalone default'));
    expect(radiusOf('Standalone modal')).not.toBe(radiusOf('Standalone default'));
  });

  it('nested footer Button still gets the modal radius', () => {
    renderWithProviders(
      <>
        <Button radius="modal">Standalone modal</Button>
        <Dialog
          open
          onClose={() => {}}
          title="T"
          footer={
            <Inline>
              <Button>Nested</Button>
            </Inline>
          }
        />
      </>
    );
    expect(radiusOf('Nested')).toBe(radiusOf('Standalone modal'));
  });

  it.each([false, '', null])('renders no footer bar for footer=%j', (footer) => {
    const { container } = renderWithProviders(
      <Dialog open onClose={() => {}} title="T" footer={footer as React.ReactNode} />
    );
    expect(container.querySelector('[data-dialog-footer]')).toBeNull();
  });

  it('a Dialog nested in a footer does not leak the modal radius to its body', () => {
    renderWithProviders(
      <>
        <Button>Standalone default</Button>
        <Dialog
          open
          onClose={() => {}}
          title="Outer"
          footer={
            <Dialog open onClose={() => {}} title="Inner">
              <Button>Inner body</Button>
            </Dialog>
          }
        />
      </>
    );
    expect(radiusOf('Inner body')).toBe(radiusOf('Standalone default'));
  });

  it('a click inside does not bubble to a clickable parent', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    renderWithProviders(
      <div onClick={spy}>
        <Dialog open onClose={() => {}} title="T">
          <p>Inside</p>
        </Dialog>
      </div>
    );
    await user.click(screen.getByText('Inside'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('applies className to the dialog', () => {
    const { container } = renderWithProviders(
      <Dialog open onClose={() => {}} title="T" className="custom" />
    );
    expect(container.querySelector('dialog')).toHaveClass('custom');
  });
});
