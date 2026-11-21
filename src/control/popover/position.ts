/** Which side of the anchor the popover prefers. */
export type PopoverSide = 'bottom' | 'top';
/** Horizontal alignment of the popover against the anchor. */
export type PopoverAlign = 'start' | 'center' | 'end';
/** Viewport-relative rectangle, as from getBoundingClientRect. */
export type Rect = { top: number; bottom: number; left: number; right: number; width: number };
/**
 * Resolved popover position; `side` is the side actually used after flipping.
 * Exactly one of `top` / `bottom` is set: the bottom side is anchored by its
 * top edge (CSS `top`), the top side by its bottom edge (CSS `bottom`, measured
 * from the viewport's bottom), so content that grows or shrinks while open
 * stays attached to the anchor.
 */
export type Placement = {
  top: number | undefined;
  bottom: number | undefined;
  left: number;
  width: number | undefined;
  side: PopoverSide;
};

/**
 * Pure placement: picks the side (flipping when the preferred side does not
 * fit and the other has more room), aligns horizontally, and clamps to the
 * viewport horizontally unless `matchWidth` (then it lines up with the anchor).
 */
export function computePosition({
  anchor,
  content,
  viewport,
  side,
  align,
  gap,
  matchWidth,
}: {
  anchor: Rect;
  content: { width: number; height: number };
  viewport: { width: number; height: number };
  side: PopoverSide;
  align: PopoverAlign;
  gap: number;
  matchWidth: boolean;
}): Placement {
  const w = matchWidth ? anchor.width : content.width;
  const h = content.height;

  const roomBelow = viewport.height - anchor.bottom - gap;
  const roomAbove = anchor.top - gap;
  const room = (s: PopoverSide) => (s === 'bottom' ? roomBelow : roomAbove);
  const other: PopoverSide = side === 'bottom' ? 'top' : 'bottom';
  const used = room(side) >= h || room(other) <= room(side) ? side : other;
  const top = used === 'bottom' ? anchor.bottom + gap : undefined;
  const bottom = used === 'top' ? viewport.height - anchor.top + gap : undefined;

  let left: number;
  if (align === 'start') left = anchor.left;
  else if (align === 'center') left = anchor.left + anchor.width / 2 - w / 2;
  else left = anchor.right - w;

  if (!matchWidth) {
    left =
      w > viewport.width - 2 * gap ? gap : Math.max(gap, Math.min(left, viewport.width - w - gap));
  }

  return { top, bottom, left, width: matchWidth ? anchor.width : undefined, side: used };
}
