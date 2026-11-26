// Full height of a dialog's box, even while max-height clamps it and it scrolls.
const dialogHeight = (dialog: HTMLElement) => {
  const border = dialog.offsetHeight - dialog.clientHeight;
  const rect = dialog.getBoundingClientRect().height;
  return Math.max(rect, dialog.scrollHeight + border);
};

// What a `max-height: calc(100% - Npx)` leaves free of the viewport: N.
const viewportGap = (dialog: HTMLElement, view: Window) => {
  const m = /^calc\(100% - ([\d.]+)px\)$/.exec(view.getComputedStyle(dialog).maxHeight);
  return m ? Number(m[1]) : 0;
};

// Elements that never paint a box: the dev server keeps its module <script>
// in the body, and a zero rect at the top would read as an overlay at 0.
const NON_RENDERING = new Set(['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT', 'META']);

// Overlays outside the flow: body children that do not hold the wrapper (a
// portalled popover) and render a box, and fixed children of an open dialog
// (a popover in it).
const overlays = (wrapper: HTMLElement): Element[] => {
  const doc = wrapper.ownerDocument;
  const view = doc.defaultView ?? window;
  const found = [...doc.body.children].filter(
    (child) =>
      !child.contains(wrapper) &&
      !NON_RENDERING.has(child.tagName) &&
      view.getComputedStyle(child).display !== 'none'
  );
  for (const dialog of doc.querySelectorAll<HTMLElement>('dialog[open]')) {
    for (const child of dialog.children) {
      if (view.getComputedStyle(child).position === 'fixed') found.push(child);
    }
  }
  return found;
};

/**
 * The height an example frame needs so nothing it shows is clipped: its flow
 * wrapper, plus whatever is open outside the flow. A popover portalled to the
 * body (or fixed inside an open dialog) counts to its bottom edge; an open
 * `<dialog>` sits in the top layer clamped to the viewport (`max-height:
 * calc(100% - …)`), so it counts by its full content height: from its top,
 * plus its bottom margin, and never less than that height plus the clamp's gap.
 * Overlays get the wrapper's bottom padding as breathing room. Growing the
 * frame to fit converges: a top-anchored dialog or a popover below its trigger
 * does not move as the frame grows, and a centred one moves half as far.
 */
export const contentHeight = (wrapper: HTMLElement): number => {
  const doc = wrapper.ownerDocument;
  const view = doc.defaultView ?? window;
  const pad = parseFloat(view.getComputedStyle(wrapper).paddingBottom) || 0;
  const bottom = (el: Element) => el.getBoundingClientRect().bottom + view.scrollY + pad;
  let height = wrapper.getBoundingClientRect().height;
  for (const el of overlays(wrapper)) {
    if (!bottomAnchored(el)) height = Math.max(height, bottom(el));
  }
  for (const dialog of doc.querySelectorAll<HTMLElement>('dialog[open]')) {
    const full = dialogHeight(dialog);
    const top = dialog.getBoundingClientRect().top + view.scrollY;
    const below = Math.max(pad, parseFloat(view.getComputedStyle(dialog).marginBottom) || 0);
    const gap = Math.max(2 * pad, viewportGap(dialog, view));
    height = Math.max(height, top + full + below, full + gap);
  }
  return Math.ceil(height);
};

// A popover on the top side is placed by CSS `bottom` and ends at its trigger,
// inside the wrapper; its rect also slides with the viewport until it
// re-measures, so counting its bottom would feed the frame's own resize back
// into the height.
const bottomAnchored = (el: Element) =>
  el instanceof HTMLElement && el.style.bottom !== '' && el.style.top === '';

/**
 * The highest top edge (document coordinates) of any overlay open outside the
 * flow, or null when none is. Negative when an overlay sticks out above the
 * frame: a list that flipped upward, or a `side="top"` menu near the top.
 */
export const overlayTop = (wrapper: HTMLElement): number | null => {
  const view = wrapper.ownerDocument.defaultView ?? window;
  const tops = overlays(wrapper).map((el) => el.getBoundingClientRect().top + view.scrollY);
  return tops.length ? Math.min(...tops) : null;
};

/**
 * Extra top padding the flow wrapper gets while an overlay is open, so one
 * that opens above its trigger fits in the frame. `staleTop` is the overlay
 * top measured when the room last grew: the popover re-measures only after
 * the frame moves its anchor, so until its top changes the room stays as is.
 */
export type Headroom = { value: number; staleTop: number | null };

/**
 * The next headroom for an overlay top (from `overlayTop`) and the wrapper's
 * padding `pad`. Zero with nothing open, so a closed frame keeps its height.
 * While open it only grows, by what the overlay still sticks out above `pad`,
 * which converges whether the overlay moves with its anchor (a popover) or by
 * half as much (one in a centred dialog), and never oscillates.
 */
export const nextHeadroom = (prev: Headroom, top: number | null, pad: number): Headroom => {
  if (top === null) return { value: 0, staleTop: null };
  if (top === prev.staleTop) return prev;
  if (top >= pad - 0.5)
    return prev.staleTop === null ? prev : { value: prev.value, staleTop: null };
  return { value: Math.ceil(prev.value + pad - top), staleTop: top };
};
