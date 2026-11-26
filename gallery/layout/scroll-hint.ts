import { useEffect, type RefObject } from 'react';

/** Whether `el` scrolls sideways and has content hidden past its right edge. */
export const hasMoreRight = (el: Element): boolean =>
  el.scrollWidth - el.clientWidth - el.scrollLeft > 1;

/**
 * Marks each sideways-scrolling `pre` (the element itself, or every `pre`
 * inside it) with `data-scroll-more` while content is hidden past its right
 * edge, for the `scrollHint` style. Rechecks on scroll and resize, and when
 * `content` (what was rendered into it) changes.
 */
export const useScrollHint = (ref: RefObject<HTMLElement | null>, content: unknown): void => {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const blocks = (): Element[] =>
      root.matches('pre') ? [root] : [...root.querySelectorAll('pre')];
    const update = (el: Element) => el.toggleAttribute('data-scroll-more', hasMoreRight(el));
    const updateAll = () => blocks().forEach(update);
    updateAll();
    // Scroll does not bubble; a capturing listener on the root hears every block.
    const onScroll = (event: Event) => {
      if (event.target instanceof Element && event.target.matches('pre')) update(event.target);
    };
    root.addEventListener('scroll', onScroll, { capture: true, passive: true });
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateAll);
      observer.observe(root);
      blocks().forEach((el) => observer!.observe(el));
    }
    return () => {
      root.removeEventListener('scroll', onScroll, { capture: true });
      observer?.disconnect();
    };
  }, [ref, content]);
};
