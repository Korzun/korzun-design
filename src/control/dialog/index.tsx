import cx from 'classnames';
import { type ReactNode, useCallback, useId } from 'react';

import { SurfaceDepthProvider } from '../../component/surface/index.js';
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
  /** Action row. No footer bar is drawn when omitted. */
  footer?: ReactNode;
  /** When `false`, Escape and backdrop clicks are ignored; pass `!loading` while a request runs. */
  canDismiss?: boolean;
  /** Extra class on the `<dialog>` element. Win specificity with `'&&'`, never `!important`. */
  className?: string;
};

/**
 * Modal dialog on a native `<dialog>`: title, body, optional footer. Always
 * mounted; controlled by `open`. Everything inside is one surface level in, so Buttons are 8px.
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
        <SurfaceDepthProvider depth={1}>
          <div id={titleId} className={styles.header}>
            {title}
          </div>
          <div className={styles.body}>{children}</div>
          {footer != null && footer !== false && footer !== '' && (
            <div className={styles.footer} data-dialog-footer="">
              {footer}
            </div>
          )}
        </SurfaceDepthProvider>
      </div>
    </dialog>
  );
}
