import cx from 'classnames';
import { PropsWithChildren, useCallback } from 'react';

import { useStyle } from './style.js';

export type CardRowProps = PropsWithChildren<{
  /**
   * Adds a pointer cursor; fires on click and Enter/Space. The row is not focusable, so keys only
   * reach it from a focused child.
   */
  onClick?: () => void;
}>;

/** A compact bordered row for stacking items inside a `Card` body. Optionally clickable. */
export const CardRow = ({ children, onClick }: CardRowProps) => {
  const styles = useStyle();

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
      className={cx(styles.root, { [styles.clickable]: onClick !== undefined })}
      onClick={onClick}
      onKeyDown={handleBookKeyDown}
    >
      {children}
    </div>
  );
};
