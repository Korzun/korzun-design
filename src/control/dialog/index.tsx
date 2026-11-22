import cx from 'classnames';
import { type ReactNode, useCallback, useId } from 'react';

import { ButtonRadiusContext } from '../button/radius-context.js';
import { ButtonRadius } from '../button/style.js';
import { useModalDialog } from '../use-modal-dialog/index.js';
import { useStyle } from './style.js';

export type DialogProps = {
  /** Controls visibility. Keep the Dialog mounted and toggle this. */
  open: boolean;
  /** Called on Escape and a backdrop click (unless `canDismiss` is false); receives no event. Close the dialog here. */
  onClose: () => void;
  /** Header content; also the dialog's accessible name. */
  title: ReactNode;
  /** Body content, in secondary text colour. */
  children?: ReactNode;
  /** Action row. Buttons inside default to `radius="modal"`. No footer bar is drawn when omitted. */
  footer?: ReactNode;
  /** When `false`, Escape and backdrop clicks are ignored (pass `!loading`). Default `true`. */
  canDismiss?: boolean;
  /** Extra class on the `<dialog>` element. */
  className?: string;
};

/**
 * Modal dialog on a native `<dialog>`: title, body, optional footer. Always
 * mounted; controlled by `open`. Footer Buttons default to the modal radius.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  canDismiss = true,
  className,
}: DialogProps) {
  const styles = useStyle();
  const titleId = useId();
  const ref = useModalDialog(open, onClose, canDismiss);
  const stopClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <dialog
      ref={ref}
      className={cx(styles.root, className)}
      aria-labelledby={titleId}
      onClick={stopClick}
    >
      <div className={styles.dialog} onClick={stopClick}>
        <div id={titleId} className={styles.header}>
          {title}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && (
          <div className={styles.footer} data-dialog-footer="">
            <ButtonRadiusContext.Provider value={ButtonRadius.Modal}>
              {footer}
            </ButtonRadiusContext.Provider>
          </div>
        )}
      </div>
    </dialog>
  );
}
