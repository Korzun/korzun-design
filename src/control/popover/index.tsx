import cx from 'classnames';
import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import {
  computePosition,
  type Placement,
  type PopoverAlign,
  type PopoverSide,
} from './position.js';
import { useStyle } from './style.js';

export type { PopoverAlign, PopoverSide } from './position.js';

export type PopoverProps = {
  /** Element the popover aligns to (placed below or above it, per `side`). */
  anchorRef: RefObject<HTMLElement | null>;
  /** Whether the popover is rendered. */
  open: boolean;
  /** Your surface: give it its own background, border, and radius. */
  children: ReactNode;
  /** Applied to the fixed wrapper; win specificity with `'&&'`, never `!important`. */
  className?: string;
  /** Vertical gap between the anchor and the popover, in pixels; also the viewport edge margin when `matchWidth` is false. */
  gap?: number;
  /** Match the popover width to the anchor width (default true). */
  matchWidth?: boolean;
  /** Preferred side; flips to the other side when this one has no room. */
  side?: PopoverSide;
  /** Horizontal alignment to the anchor's left edge, centre, or right edge. */
  align?: PopoverAlign;
  /**
   * Called on a pointer-down outside both the anchor and the popover content,
   * and on an Escape keydown no control has already handled. Omit to opt out.
   */
  onClose?: () => void;
};

/**
 * Renders `children` in a portal on `document.body` (or, when the anchor sits
 * inside an open `<dialog>` at the moment it opens, into that dialog so it
 * shows in the top layer), positioned with `fixed` coordinates against `anchorRef`. This lets dropdowns escape ancestors that
 * clip overflow (e.g. cards with rounded corners) without those ancestors
 * having to opt out of clipping.
 *
 * Opens on `side` (default below) and flips when that side has no room; aligns
 * per `align` and clamps horizontally to the viewport (only without
 * `matchWidth`). The wrapper carries `data-side` with the side actually used.
 * On the top side it is anchored by CSS `bottom`, so it stays attached as its
 * content changes height. The first render is transparent (`opacity: 0`, still
 * focusable) until measured, then it re-measures on scroll (capture phase),
 * window resize, and content resize (`ResizeObserver`, where available).
 *
 * With `onClose`, Escape closes it unless the keydown was already
 * `defaultPrevented`; it calls `preventDefault` so an enclosing `<dialog>`
 * does not also cancel. No focus management.
 */
export const Popover = ({
  anchorRef,
  open,
  children,
  className,
  gap = 4,
  matchWidth = true,
  side = 'bottom',
  align = 'start',
  onClose,
}: PopoverProps) => {
  const style = useStyle();
  const contentRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [target, setTarget] = useState<Element | null>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const content = contentRef.current;
    if (!anchor || !content) return;
    const rect = anchor.getBoundingClientRect();
    // Measure at the width it will render with, so wrapped height is right.
    if (matchWidth) content.style.width = `${rect.width}px`;
    const size = content.getBoundingClientRect();
    setPlacement(
      computePosition({
        anchor: rect,
        content: { width: size.width, height: size.height },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        side,
        align,
        gap,
        matchWidth,
      })
    );
  }, [anchorRef, gap, matchWidth, side, align]);

  // Resolved once per opening: inside an open <dialog> (modal or not) a body
  // portal would sit behind its top layer.
  useLayoutEffect(() => {
    if (!open) return;
    setTarget(anchorRef.current?.closest('dialog[open]') ?? document.body);
    return () => setTarget(null);
  }, [open, anchorRef]);

  useLayoutEffect(() => {
    if (!open || !target) return;
    updatePosition();
    const handle = () => updatePosition();
    // Capture-phase scroll so nested scroll containers reposition too.
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handle) : undefined;
    if (observer && contentRef.current) observer.observe(contentRef.current);
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
      observer?.disconnect();
      setPlacement(null);
    };
  }, [open, target, updatePosition]);

  useEffect(() => {
    if (!open || !onClose) return;
    const handleMouseDown = (event: MouseEvent) => {
      const pressed = event.target as Node;
      if (anchorRef.current?.contains(pressed)) return;
      if (contentRef.current?.contains(pressed)) return;
      onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      // preventDefault on keydown is what stops a native <dialog> from cancelling.
      event.preventDefault();
      onClose();
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open || !target) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={cx(style.popover, className)}
      data-side={placement?.side}
      style={
        placement
          ? {
              top: placement.top,
              bottom: placement.bottom,
              left: placement.left,
              width: placement.width,
            }
          : // Never painted: the layout effect measures and re-renders first.
            // Opacity, not visibility, so an autoFocus child can take focus.
            { top: 0, left: 0, opacity: 0 }
      }
    >
      {children}
    </div>,
    target
  );
};
