import cx from 'classnames';
import { ReactNode, RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { SurfaceDepthProvider } from '../../component/surface/index.js';
import { useLayer } from '../layer-stack/index.js';
import {
  computePosition,
  type Placement,
  type PopoverAlign,
  type PopoverSide,
} from './position.js';
import { useStyle } from './style.js';

export type { PopoverAlign, PopoverSide } from './position.js';

/** A popover gap: pixels, or a CSS length in `px` or `rem`. TypeScript rejects other units. */
export type PopoverGap = number | `${number}px` | `${number}rem`;

export type PopoverProps = {
  /** Element the popover aligns to (placed below or above it, per `side`). */
  anchorRef: RefObject<HTMLElement | null>;
  /** Whether the popover is rendered; when `false` it renders nothing. Fully controlled: it never closes itself. */
  open: boolean;
  /** Your surface: give it its own background, border, and radius. */
  children: ReactNode;
  /** Applied to the fixed wrapper; win specificity with `'&&'`, never `!important`. */
  className?: string;
  /**
   * Space between the anchor and the popover: a number of pixels, or a CSS
   * length string in `px` or `rem` (`'6px'`, `'0.375rem'`), resolved at each
   * measurement. Also the margin kept from the viewport's left and right edges
   * when `matchWidth` is false. Theme space values (`theme.space.sm`) are
   * assignable as they are.
   */
  gap?: PopoverGap;
  /** Sets the popover's width to the anchor's width. `false` lets the content size itself and keeps it inside the viewport's left and right edges. */
  matchWidth?: boolean;
  /** Preferred side; flips to the other side when this one has no room. */
  side?: PopoverSide;
  /** Horizontal alignment to the anchor's left edge, centre, or right edge. */
  align?: PopoverAlign;
  /**
   * Called on a pointer-down outside both the anchor and the popover content,
   * and on an Escape keydown no control has already handled; it receives no
   * event. Escape and outside pointer-down close the innermost open layer
   * first (see [Layers](#layers)). Omit to opt out of both.
   */
  onClose?: () => void;
};

// A `rem` string against the root font size; a `px` string as pixels.
const resolveGap = (gap: PopoverGap): number => {
  if (typeof gap === 'number') return gap;
  const value = parseFloat(gap);
  if (!gap.endsWith('rem')) return value;
  return value * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/**
 * Renders `children` in a portal on `document.body` (or, when the anchor sits
 * inside an open `<dialog>` at the moment it opens, into that dialog so it
 * shows in the top layer), positioned with `fixed` coordinates against
 * `anchorRef`. This lets dropdowns escape ancestors that clip overflow (e.g.
 * cards with rounded corners) without those ancestors having to opt out of
 * clipping.
 *
 * Opens on `side` (default below) and flips when that side has no room; aligns
 * per `align` and clamps horizontally to the viewport (only without
 * `matchWidth`). The wrapper carries `data-side` with the side actually used,
 * and `data-preferred-side` with `side`, so a flip can be told from a choice.
 * On the top side it is anchored by CSS `bottom`, so it stays attached as its
 * content changes height. The first render is transparent (`opacity: 0`, still
 * focusable) until measured, then it re-measures on scroll (capture phase),
 * window resize, and content resize (`ResizeObserver`, where available).
 *
 * With `onClose`, it joins the layer stack: Escape and outside pointer-down
 * close the innermost open layer first. Escape is ignored when the keydown was
 * already `defaultPrevented`, and is `preventDefault`ed so an enclosing
 * `<dialog>` does not also cancel. No focus management.
 *
 * The content is two surface levels in, so Buttons and Selects inside it are
 * `radius.sm`, wherever the anchor sits.
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
        gap: resolveGap(gap),
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

  // Gated on `target`, so it registers one commit after each opening: a
  // Modal opening in the same commit as a popover inside it still sits below it.
  useLayer(open && !!onClose && !!target, {
    onEscape: onClose,
    contains: (node) => !!(anchorRef.current?.contains(node) || contentRef.current?.contains(node)),
    onOutsidePointerDown: onClose,
  });

  if (!open || !target) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={cx(style.popover, className)}
      data-side={placement?.side}
      data-preferred-side={side}
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
      <SurfaceDepthProvider depth={2}>{children}</SurfaceDepthProvider>
    </div>,
    target
  );
};
