/** Which side of the anchor the popover prefers. */
export type PopoverSide = 'bottom' | 'top';
/** Horizontal alignment of the popover against the anchor. */
export type PopoverAlign = 'start' | 'center' | 'end';
/** Viewport-relative rectangle, as from getBoundingClientRect. */
export type Rect = { top: number; bottom: number; left: number; right: number; width: number };
/** Resolved popover position; `side` is the side actually used after flipping. */
export type Placement = { top: number; left: number; width: number | undefined; side: PopoverSide };

/**
 * Pure placement: picks the side (flipping when the preferred side does not
 * fit and the other has more room), aligns horizontally, and clamps to the
 * viewport horizontally.
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
  const top = used === 'bottom' ? anchor.bottom + gap : anchor.top - gap - h;

  let left: number;
  if (align === 'start') left = anchor.left;
  else if (align === 'center') left = anchor.left + anchor.width / 2 - w / 2;
  else left = anchor.right - w;

  left =
    w > viewport.width - 2 * gap ? gap : Math.max(gap, Math.min(left, viewport.width - w - gap));

  return { top, left, width: matchWidth ? anchor.width : undefined, side: used };
}
