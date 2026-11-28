import cx from 'classnames';
import { useEffect, useState, type FocusEvent, type MouseEvent } from 'react';

import { Space } from '../../component/space/index.js';
import { Text } from '../../component/text/index.js';
import { useStyle } from './style.js';
import { useCurrentSection } from './use-current-section.js';

/** One section of the page outline. */
export type AnchorItem = {
  /** The `id` of the section's element on the page, usually its heading. The link's `href` is `#id`. */
  id: string;
  /** The text of the link. */
  title: string;
  /**
   * Nesting depth: each level past 1 indents the link, and in the minimap shortens its dash.
   * @default 1
   */
  level?: 1 | 2 | 3;
};

export type AnchorProps = {
  /** The sections, in page order. An item whose element is not on the page is listed but never current. */
  items: AnchorItem[];
  /** `'list'` is an indented list of titles; `'minimap'` is a column of dashes that opens the list in a panel on hover or focus. See [Choosing a look](#choosing-a-look). */
  variant?: 'list' | 'minimap';
  /** Height in px of sticky chrome above the content. A click scrolls the section to this far below the top of the window, and a section counts as current once its top passes it. */
  offset?: number;
  /** Accessible name of the `nav`. */
  ariaLabel?: string;
  /** Extra class on the `nav`. Override with `'&&'` specificity, never `!important`. */
  className?: string;
};

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A page outline: a `nav` of links to the page's sections that marks the one
 * in view and scrolls to one on click, without changing the URL.
 */
export const Anchor = ({
  items,
  variant = 'list',
  offset = 0,
  ariaLabel = 'On this page',
  className,
}: AnchorProps) => {
  const styles = useStyle();
  const current = useCurrentSection(
    items.map((item) => item.id),
    offset
  );
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const minimap = variant === 'minimap';
  const open = minimap && (hovered || focused);

  // Escape dismisses a panel the pointer opened. A panel focus opened stays:
  // closing it would hide the focused link, and its focus ring with it.
  useEffect(() => {
    if (!hovered) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setHovered(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hovered]);

  if (items.length === 0) return null;

  const jump = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    window.scrollTo({
      top: window.scrollY + target.getBoundingClientRect().top - offset,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    // A modified click opens the link as the browser would (a new tab, a copy).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // The URL stays as it is: an app with hash routing would read `#id` as a route.
    event.preventDefault();
    jump(id);
  };

  const minimapHandlers = minimap
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onFocus: () => setFocused(true),
        onBlur: (event: FocusEvent<HTMLElement>) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        },
      }
    : {};

  return (
    <nav
      aria-label={ariaLabel}
      className={cx(styles.root, minimap && styles.minimap, open && styles.open, className)}
      data-open={open ? 'true' : undefined}
      {...minimapHandlers}
    >
      {minimap && (
        // The dashes are a picture of the list below; the links carry the names.
        <Space
          direction="vertical"
          gap="sm"
          align="end"
          aria-hidden="true"
          className={styles.dashes}
        >
          {items.map(({ id, level = 1 }) => (
            <span
              key={id}
              data-anchor-dash=""
              data-current={id === current ? 'true' : undefined}
              className={cx(styles.dash, styles[`dash${level}`], id === current && styles.current)}
              onClick={() => jump(id)}
            />
          ))}
        </Space>
      )}
      {/* Open, the shell is the panel's box plus the gap and the dash column beside it,
          so the pointer stays inside the nav on its way from the dashes to any part of the panel. */}
      <div className={open ? styles.shell : undefined}>
        <Space
          as="ul"
          direction="vertical"
          gap="none"
          className={cx(styles.list, minimap ? (open ? styles.panel : styles.hidden) : styles.rail)}
        >
          {items.map(({ id, title, level = 1 }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={id === current ? 'location' : undefined}
                className={cx(
                  styles.link,
                  styles[`level${level}`],
                  id === current && styles.current
                )}
                onClick={(event) => onLinkClick(event, id)}
              >
                <Text size="sm">{title}</Text>
              </a>
            </li>
          ))}
        </Space>
      </div>
    </nav>
  );
};
