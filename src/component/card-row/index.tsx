import cx from 'classnames';
import { PropsWithChildren, useCallback } from 'react';

import { depthClass, SurfaceDepthProvider, useSurfaceDepth } from '../surface/index.js';
import { useStyle } from './style.js';

export type CardRowProps = PropsWithChildren<{
  /**
   * Adds a pointer cursor; fires on click and Enter/Space. The row is not focusable, so keys only
   * reach it from a focused child.
   */
  onClick?: () => void;
}>;

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
