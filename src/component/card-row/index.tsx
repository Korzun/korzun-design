import cx from 'classnames';
import { ReactNode, useCallback } from 'react';

import { depthClass, SurfaceDepthProvider, useSurfaceDepth } from '../surface/index.js';
import { useStyle } from './style.js';

export type CardRowProps = {
  /** Row content. It sits one surface level deeper than the row. */
  children?: ReactNode;
  /**
   * Adds a pointer cursor; fires on click and Enter/Space. The row has no `role` or `tabIndex`, so
   * keys only reach it from a focused child, and Space still scrolls the page. For a
   * keyboard-reachable action, put a real control such as a link `Button` inside.
   */
  onClick?: () => void;
};

/** A compact bordered row; its corners follow where it sits. */
export const CardRow = ({ children, onClick }: CardRowProps) => {
  const styles = useStyle();
  const depth = useSurfaceDepth() ?? 0;

  const handleBookKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (onClick) {
          onClick();
        }
      }
    },
    [onClick]
  );

  return (
    <div
      className={cx(styles.root, styles[`depth${depthClass(depth)}`], {
        [styles.clickable]: onClick !== undefined,
      })}
      onClick={onClick}
      onKeyDown={handleBookKeyDown}
    >
      <SurfaceDepthProvider depth={depth + 1}>{children}</SurfaceDepthProvider>
    </div>
  );
};
