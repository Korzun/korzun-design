import cx from 'classnames';

import { useDepthClassKey } from '../surface/index.js';
import { type ChipTone, useStyle } from './style.js';

export type { ChipTone };

export interface ChipProps {
  /** The label. */
  children: React.ReactNode;
  /** Makes it a button: `role="button"`, focusable, pointer cursor, Enter/Space activate it, and hover deepens the tone. Receives no event. */
  onClick?: () => void;
  /** `sm` is compact (tight line height) and fits inside a normal text line, so rows keep the same height with or without chips. */
  size?: 'sm' | 'md';
  /** Colour, from the theme's `color.chip` tokens. Status tones report a state; label tones name a kind of thing, and `status` is a legacy label tone despite its name. See [Choosing a tone](#choosing-a-tone). */
  tone?: ChipTone;
}

/** A small coloured chip for a category, status, or value. Optionally clickable. */
export const Chip = ({ children, onClick, size = 'md', tone = 'subject' }: ChipProps) => {
  const style = useStyle();
  const depthKey = useDepthClassKey();
  return (
    <span
      className={cx(
        style.root,
        style[`tone-${tone}`],
        size === 'sm' && style.sm,
        onClick !== undefined && style.clickable,
        depthKey && style[depthKey]
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
