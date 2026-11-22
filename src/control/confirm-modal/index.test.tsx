// client/src/control/confirm-modal/index.test.tsx
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { Button } from '../button/index.js';
import { ConfirmModal } from './index.js';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('ConfirmModal', () => {
  it('renders the title and children', () => {
    const { container } = renderWithProviders(
      <ConfirmModal isOpen title="Delete book">
        <p>Are you sure?</p>
      </ConfirmModal>
    );
    expect(container.textContent).toContain('Delete book');
    expect(container.textContent).toContain('Are you sure?');
  });

  it('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithProviders(<ConfirmModal isOpen onConfirm={onConfirm} confirmText="Yes, delete" />);
    await user.click(screen.getByRole('button', { name: 'Yes, delete', hidden: true }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithProviders(<ConfirmModal isOpen onCancel={onCancel} cancelText="No, keep it" />);
    await user.click(screen.getByRole('button', { name: 'No, keep it', hidden: true }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('renders default button labels when no custom text is given', () => {
    renderWithProviders(<ConfirmModal isOpen />);
    expect(screen.getByRole('button', { name: 'Confirm', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel', hidden: true })).toBeInTheDocument();
  });

  it('dismisses on Escape (cancel event) when idle', () => {
    const onCancel = vi.fn();
    const { container } = renderWithProviders(<ConfirmModal isOpen onCancel={onCancel} />);
    fireEvent(container.querySelector('dialog')!, new Event('cancel', { cancelable: true }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('ignores Escape while the action is loading', () => {
    const onCancel = vi.fn();
    const { container } = renderWithProviders(<ConfirmModal isOpen loading onCancel={onCancel} />);
    fireEvent(container.querySelector('dialog')!, new Event('cancel', { cancelable: true }));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('disables the confirm button when confirmDisabled is set', () => {
    renderWithProviders(<ConfirmModal isOpen confirmDisabled />);
    expect(screen.getByRole('button', { name: 'Confirm', hidden: true })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('does not call onConfirm when confirmDisabled and the button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithProviders(<ConfirmModal isOpen onConfirm={onConfirm} confirmDisabled />);
    await user.click(screen.getByRole('button', { name: 'Confirm', hidden: true }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('leaves the confirm button enabled by default', () => {
    renderWithProviders(<ConfirmModal isOpen />);
    expect(screen.getByRole('button', { name: 'Confirm', hidden: true })).not.toHaveAttribute(
      'aria-disabled'
    );
  });

  it('is named by its title', () => {
    // jsdom drops the name when the labelled dialog is closed (display: none), so open it as a browser would.
    vi.mocked(HTMLDialogElement.prototype.showModal).mockImplementationOnce(function (
      this: HTMLDialogElement
    ) {
      this.setAttribute('open', '');
    });
    renderWithProviders(<ConfirmModal isOpen title="Delete book" />);
    expect(screen.getByRole('dialog', { name: 'Delete book', hidden: true })).toBeInTheDocument();
  });

  it('footer buttons keep the modal radius', () => {
    renderWithProviders(
      <>
        <ConfirmModal isOpen />
        <Button type="text" radius="modal">
          Standalone
        </Button>
      </>
    );
    const radiusOf = (name: string) =>
      getComputedStyle(screen.getByText(name).closest('[role="button"]')!).borderRadius;
    expect(radiusOf('Cancel')).toBe(radiusOf('Standalone'));
  });
});
