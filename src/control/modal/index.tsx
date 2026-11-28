import cx from 'classnames';
import { type ReactNode, useCallback, useId } from 'react';

import { DividerBodyProvider } from '../../component/divider/index.js';
import { SurfaceDepthProvider } from '../../component/surface/index.js';
import { useTheme } from '../../theme/index.js';
import { useModal } from '../use-modal/index.js';
import { useStyle } from './style.js';

export type ModalProps = {
  /** Controls visibility. Keep the Modal mounted and toggle this. */
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
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  canDismiss = true,
  className,
}: ModalProps) {
  const styles = useStyle();
  const theme = useTheme();
  const titleId = useId();
  const ref = useModal(open, onClose, canDismiss);
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
          <div className={styles.body}>
            <DividerBodyProvider padding={theme.space.xxl} depth={1}>
              {children}
            </DividerBodyProvider>
          </div>
          {footer != null && footer !== false && footer !== '' && (
            <div className={styles.footer} data-modal-footer="">
              {footer}
            </div>
          )}
        </SurfaceDepthProvider>
      </div>
    </dialog>
  );
}
