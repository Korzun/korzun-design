import { useEffect, useState } from 'react';

/**
 * The id of the section in view: the last of `ids` whose element's top is at
 * or above `offset + 1` px from the top of the window. Above the first
 * section it is the first; scrolled to the bottom of a page that scrolls, the
 * last. An id with no element is skipped. `undefined` when none of the ids
 * has an element. Recomputed on scroll and resize, at most once a frame.
 */
export const useCurrentSection = (ids: string[], offset: number): string | undefined => {
  const [current, setCurrent] = useState<string | undefined>(undefined);
  // The ids as one string, so a new array with the same ids keeps the listeners.
  const key = ids.join('\n');

  useEffect(() => {
    const list = key === '' ? [] : key.split('\n');
    const compute = () => {
      const present = list.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, el }] : [];
      });
      if (present.length === 0) return undefined;
      const { scrollHeight } = document.documentElement;
      const scrolls = scrollHeight > window.innerHeight;
      if (scrolls && window.scrollY + window.innerHeight >= scrollHeight - 1) {
        return present[present.length - 1]!.id;
      }
      let found = present[0]!.id;
      for (const { id, el } of present) {
        if (el.getBoundingClientRect().top <= offset + 1) found = id;
      }
      return found;
    };

    let frame = 0;
    let pending = false;
    const onChange = () => {
      if (pending) return;
      pending = true;
      frame = requestAnimationFrame(() => {
        pending = false;
        setCurrent(compute());
      });
    };
    // The first reading too waits for a frame, after the page around it has laid out.
    onChange();
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange);
    return () => {
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
      cancelAnimationFrame(frame);
    };
  }, [key, offset]);

  return current;
};
