import cx from 'classnames';
import { PropsWithChildren, ReactNode, ReactElement, useCallback, useState } from 'react';

import { ChevronCircleIcon } from '../../icon/index.js';
import { useStyle } from './style.js';

export type CardProps = PropsWithChildren<{
  /** On the outer element. Override with `'&&'` specificity, never `!important`. */
  className?: string;
  /** Starts a collapsible card collapsed. Defaults to **true**: pass `false` to start open. Uncontrolled. */
  defaultCollapsed?: boolean;
  /** Grey footer bar, right-aligned. Clicks don't bubble to `onClick`. Hidden while collapsed. */
  footer?: ReactNode;
  /** Right side of the header. Clicks and keys here don't bubble to `onClick` or the collapse toggle. */
  headerAction?: ReactNode | ReactElement[];
  /** Header becomes a `role="button"` toggle (Enter/Space) with a chevron. Collapsed content unmounts. */
  isCollapsible?: boolean;
  /** Whole-card click. The card is not focusable; Enter/Space bubbling from any focused child fires it. */
  onClick?: () => void;
  /** Header click. Ignored when `isCollapsible` (the header toggles instead); its presence renders a header. */
  onClickHeader?: () => void;
  /** `'large'` (default): `space.xl` body padding. `'small'`: 1px body padding, for list rows. */
  size?: 'small' | 'large';
  /** Small faint text after the title. */
  subTitle?: string;
  /** Header title. */
  title?: string | ReactNode;
}>;

/** The bordered surface each feature on a screen lives in: optional header, padded body, optional footer. */
export const Card = ({
  children,
  className,
  defaultCollapsed = true,
  footer,
  headerAction,
  isCollapsible = false,
  onClick,
  onClickHeader,
  size = 'large',
  subTitle,
  title,
}: CardProps) => {
  const style = useStyle();
  const [isExpanded, setIsExpanded] = useState<boolean>(!defaultCollapsed);
  const handleToggle = useCallback(() => setIsExpanded((prev) => !prev), []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (onClick) {
          onClick();
        }
      }
    },
    [onClick]
  );

  const handleHeaderKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isCollapsible) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle, isCollapsible]
  );

  const visibleChildren = isCollapsible ? (isExpanded ? children : null) : children;

  return (
    <div
      className={cx(style.root, style[size], className, {
        [style.clickable]: onClick !== undefined,
      })}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {(title || subTitle || headerAction || onClickHeader || isCollapsible) && (
        <div
          className={cx(style.header, {
            [style.collapsed]: !visibleChildren,
            [style.clickable]: onClickHeader !== undefined || isCollapsible,
          })}
          onClick={isCollapsible ? handleToggle : (onClickHeader ?? undefined)}
          onKeyDown={handleHeaderKeyDown}
          role={isCollapsible ? 'button' : undefined}
          tabIndex={isCollapsible ? 0 : undefined}
          aria-expanded={isCollapsible ? isExpanded : undefined}
        >
          {(title || subTitle) && (
            <div className={style.titleGroup}>
              {title &&
                (isCollapsible ? (
                  <div className={style.titleWrapper}>
                    <ChevronCircleIcon
                      className={cx(
                        style.chevron,
                        isExpanded ? style.chevronExpanded : style.chevronCollapsed
                      )}
                    />
                    <div className={style.title}>{title}</div>
                  </div>
                ) : (
                  <div className={style.title}>{title}</div>
                ))}
              {subTitle && <div className={style.subTitle}>{subTitle}</div>}
            </div>
          )}
          <div className={style.spacer} />
          {headerAction && (
            <div
              className={style.headerAction}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {headerAction}
            </div>
          )}
        </div>
      )}
      {visibleChildren && <div className={cx(style.content, style[size])}>{visibleChildren}</div>}
      {footer && (!isCollapsible || isExpanded) && (
        <div
          className={style.footer}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
