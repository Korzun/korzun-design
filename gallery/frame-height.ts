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
  for (const child of doc.body.children) {
    if (!child.contains(wrapper)) height = Math.max(height, bottom(child));
  }
  for (const dialog of doc.querySelectorAll<HTMLElement>('dialog[open]')) {
    const full = dialogHeight(dialog);
    const top = dialog.getBoundingClientRect().top + view.scrollY;
    const below = Math.max(pad, parseFloat(view.getComputedStyle(dialog).marginBottom) || 0);
    const gap = Math.max(2 * pad, viewportGap(dialog, view));
    height = Math.max(height, top + full + below, full + gap);
    for (const child of dialog.children) {
      if (view.getComputedStyle(child).position === 'fixed') {
        height = Math.max(height, bottom(child));
      }
    }
  }
  return Math.ceil(height);
};
