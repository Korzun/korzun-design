import { PropsWithChildren, useCallback } from 'react';

import { IconProps } from '../../icon/index.js';
import { Button } from '../button/index.js';
import { useModalDialog } from '../use-modal-dialog/index.js';
import { useStyle } from './style.js';

export type ConfirmModalProps = PropsWithChildren<{
  /** Cancel button label. Default `'Cancel'`. */
  cancelText?: string;
  /** Disables only the Confirm button (e.g. until a checkbox is ticked). */
  confirmDisabled?: boolean;
  /** Confirm button label. Default `'Confirm'`. */
  confirmText?: string;
  /** Red Confirm button; also tints `icon` red. */
  danger?: boolean;
  /** Icon component shown before the title (`icon={AlertOctagonIcon}`), not an element. */
  icon?: React.ComponentType<IconProps>;
  /** Controls visibility. Keep the modal mounted and toggle this. */
  isOpen?: boolean;
  /** Spinner on Confirm; disables both buttons and blocks Escape and backdrop dismissal. */
  loading?: boolean;
  /** Called by Cancel, Escape, and a backdrop click; receives no event. Close the modal here. */
  onCancel?: () => void;
  /** Receives no event and does not close the modal: set `isOpen` to `false` yourself. */
  onConfirm?: () => void;
  /** Header text. Default `'Confirm action'`. */
  title?: string;
}>;

/**
 * Ready-made yes/no modal on a native `<dialog>`: title, body (`children`),
 * Cancel and Confirm. Always mounted; controlled by `isOpen`.
 */
export function ConfirmModal({
  cancelText = 'Cancel',
  children,
  confirmDisabled = false,
  confirmText = 'Confirm',
  danger = false,
  icon: Icon,
  isOpen = false,
  loading = false,
  onCancel = () => {},
  onConfirm = () => {},
  title = 'Confirm action',
}: ConfirmModalProps) {
  const styles = useStyle();

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);
  // Escape dismisses the modal, except while the action is in flight — the
  // Cancel button is disabled then, so Escape is gated to match.
  const modalRef = useModalDialog(isOpen, handleCancel, !loading);
  const handleClickDialog = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <dialog ref={modalRef} className={styles.root} onClick={handleClickDialog}>
      <div className={styles.dialog} onClick={handleClickDialog}>
        <div className={styles.header}>
          {Icon && (
            <div className={styles.icon}>
              <Icon className={danger ? styles.iconDanger : undefined} />
            </div>
          )}
          {title}
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <Button onClick={handleCancel} disabled={loading} type="text" radius="modal">
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={confirmDisabled || loading}
            loading={loading}
            type="primary"
            danger={danger}
            radius="modal"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
