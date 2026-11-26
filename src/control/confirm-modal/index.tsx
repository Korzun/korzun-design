import { type ReactNode, useCallback } from 'react';

import { IconProps } from '../../icon/index.js';
import { Button } from '../button/index.js';
import { Dialog } from '../dialog/index.js';
import { useStyle } from './style.js';

export type ConfirmModalProps = {
  /** Cancel button label. */
  cancelText?: string;
  /** Body content, in secondary text colour. */
  children?: ReactNode;
  /** Disables only the Confirm button (e.g. until a checkbox is ticked). */
  confirmDisabled?: boolean;
  /** Confirm button label. */
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
  /** Header text. */
  title?: string;
};

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

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      canDismiss={!loading}
      title={
        <>
          {Icon && (
            <div className={styles.icon}>
              <Icon className={danger ? styles.iconDanger : undefined} />
            </div>
          )}
          {title}
        </>
      }
      footer={
        <>
          <Button onClick={handleCancel} disabled={loading} type="text">
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={confirmDisabled || loading}
            loading={loading}
            type="primary"
            danger={danger}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      {children}
    </Dialog>
  );
}
