import cx from 'classnames';

import { type TagTone, useStyle } from './style.js';

export type { TagTone };

export interface TagProps {
  /** The label. */
  children: React.ReactNode;
  /** Makes it a button (focusable, Enter/Space, pointer cursor). Receives no event. */
  onClick?: () => void;
  /** `sm` renders a compact chip that fits within a normal text line height. Default `'md'`. */
  size?: 'sm' | 'md';
  /** Colour, from the theme's `color.chip` tokens (default `'subject'`). `neutral` is a quiet grey. */
  tone?: TagTone;
}

/** A small coloured chip for a category, status, or value. Optionally clickable. */
export const Tag = ({ children, onClick, size = 'md', tone = 'subject' }: TagProps) => {
  const style = useStyle();
  return (
    <span
      className={cx(
        style.root,
        style[`tone-${tone}`],
        size === 'sm' && style.sm,
        onClick !== undefined && style.clickable
      )}
      onClick={onClick}
      role={onClick !== undefined ? 'button' : undefined}
      tabIndex={onClick !== undefined ? 0 : undefined}
      onKeyDown={
        onClick !== undefined
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </span>
  );
};
