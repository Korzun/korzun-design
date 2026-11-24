import cx from 'classnames';
import type { ComponentType, ReactNode } from 'react';

import type { IconProps } from '../../icon/index.js';
import { depthClass, SurfaceDepthProvider, useSurfaceDepth } from '../surface/index.js';
import { useStyle } from './style.js';

export type AlertTone = 'warning' | 'danger' | 'success' | 'info';

export interface AlertProps {
  /** Colour family. `warning` and `danger` are announced (`role="alert"`); `success` and `info` are polite (`role="status"`). */
  tone: AlertTone;
  /** Short semibold heading above the body. */
  title?: ReactNode;
  /** Body text. */
  children?: ReactNode;
  /** Icon shown before the title, in the tone's text colour. There is no default icon per tone. */
  Icon?: ComponentType<IconProps>;
  /** Content on the right, usually a Button; wraps under the text when narrow. */
  action?: ReactNode;
  /** Extra class on the root. Override with `'&&'` specificity, never `!important`. */
  className?: string;
}

/** A tinted box for a status message, with an optional title, icon and action. Its corners follow where it sits. */
export const Alert = ({ tone, title, children, Icon, action, className }: AlertProps) => {
  const styles = useStyle();
  const depth = useSurfaceDepth() ?? 0;
  const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={cx(styles.root, styles[`depth${depthClass(depth)}`], styles[tone], className)}
    >
      <SurfaceDepthProvider depth={depth + 1}>
        <div className={styles.text}>
          {(title != null || Icon) && (
            <div className={styles.heading}>
              {Icon && <Icon className={styles.icon} aria-hidden="true" />}
              {title != null && <span>{title}</span>}
            </div>
          )}
          {children != null && <div className={styles.body}>{children}</div>}
        </div>
        {action != null && <div className={styles.action}>{action}</div>}
      </SurfaceDepthProvider>
    </div>
  );
};
