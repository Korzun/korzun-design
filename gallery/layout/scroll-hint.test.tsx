import { act, fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';

import { hasMoreRight, useScrollHint } from './scroll-hint.js';

// jsdom does no layout: give an element the scroll metrics a browser would.
const metrics = (el: Element, scrollWidth: number, clientWidth: number) => {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth });
};

describe('hasMoreRight', () => {
  it('is true only while content is hidden past the right edge', () => {
    const el = document.createElement('pre');
    metrics(el, 600, 356);
    expect(hasMoreRight(el)).toBe(true);
    el.scrollLeft = 244;
    expect(hasMoreRight(el)).toBe(false);
    metrics(el, 356, 356);
    el.scrollLeft = 0;
    expect(hasMoreRight(el)).toBe(false);
  });
});

const Blocks = ({ html }: { html: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollHint(ref, html);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
};

describe('useScrollHint', () => {
  beforeEach(() => {
    // Wide blocks overflow a 356px column; short ones fit.
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.textContent!.length > 10 ? 600 : 100;
    });
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(356);
  });
  afterEach(() => vi.restoreAllMocks());

  it('marks each pre that scrolls sideways, and clears the mark at the end', () => {
    const { container } = render(<Blocks html="<pre>a long line of code</pre><pre>short</pre>" />);
    const [wide, narrow] = container.querySelectorAll('pre');
    expect(wide).toHaveAttribute('data-scroll-more');
    expect(narrow).not.toHaveAttribute('data-scroll-more');
    act(() => {
      wide!.scrollLeft = 244;
      fireEvent.scroll(wide!);
    });
    expect(wide).not.toHaveAttribute('data-scroll-more');
  });

  it('rechecks when the content changes', () => {
    const { container, rerender } = render(<Blocks html="<pre>short</pre>" />);
    expect(container.querySelector('pre')).not.toHaveAttribute('data-scroll-more');
    rerender(<Blocks html="<pre>now a much longer line</pre>" />);
    expect(container.querySelector('pre')).toHaveAttribute('data-scroll-more');
  });
});
