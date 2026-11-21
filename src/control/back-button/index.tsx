import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { ChevronIcon } from '../../icon/index.js';
import { useStyle } from './style.js';

export interface BackButtonProps {
  /**
   * Path to navigate to. Pushes a new history entry (it does not go back in
   * history), asking the destination to restore its scroll position.
   */
  to: string;
}

/**
 * Round glass "Back" button that navigates to `to`. Mobile-only (hidden at
 * 641px and up); needs a react-router router. Prefer `Page back="…"`.
 */
export function BackButton({ to }: BackButtonProps) {
  const styles = useStyle();
  const navigate = useNavigate();

  // This is a forward push (a new history entry), not a real POP, so tell the scroll
  // manager to restore the destination's remembered position instead of jumping to top.
  const handleClick = useCallback(
    () => navigate(to, { state: { restoreScroll: true } }),
    [navigate, to]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigate(to, { state: { restoreScroll: true } });
      }
    },
    [navigate, to]
  );

  return (
    <div
      className={styles.root}
      role="button"
      tabIndex={0}
      aria-label="Back"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <ChevronIcon className={styles.icon} width={20} height={20} aria-hidden="true" />
    </div>
  );
}
