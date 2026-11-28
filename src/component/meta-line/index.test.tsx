import { afterEach, describe, expect, it, vi } from 'vitest';

import { metaItems, renderWithProviders } from '../../test-utils.js';
import { lightTheme } from '../../theme/theme.js';
import { MetaLine } from './index.js';

const renderLine = renderWithProviders;

/** The flex list inside the root: it carries the gaps and the separator variable. */
const listOf = (container: HTMLElement) =>
  container.firstElementChild!.firstElementChild as HTMLElement;

const channels = (color: string): number[] => {
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const full = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  }
  return (color.match(/[\d.]+/g) ?? []).map(Number).slice(0, 3);
};

describe('MetaLine', () => {
  it('renders each datum in its own item, in order', () => {
    const { container } = renderLine(<MetaLine items={['Frank Herbert', 'Book 3', '42%']} />);
    expect(metaItems(container)).toEqual(['Frank Herbert', 'Book 3', '42%']);
  });

  it('keeps the separators out of the DOM text', () => {
    const { container } = renderLine(
      <MetaLine items={['Frank Herbert', 'Book 3']} separator="·" />
    );
    expect(container.textContent).toBe('Frank HerbertBook 3');
    expect(container.textContent).not.toContain('·');
  });

  it('accepts element items alongside strings', () => {
    const { getAllByTestId, getByLabelText } = renderLine(
      <MetaLine
        items={[
          'Frank Herbert',
          <span key="r" aria-label="Rated Great">
            Great
          </span>,
        ]}
      />
    );
    expect(getByLabelText('Rated Great')).toBeInTheDocument();
    expect(getAllByTestId('meta-item')).toHaveLength(2);
  });

  it('skips null, undefined and false items', () => {
    const { container } = renderLine(
      <MetaLine items={[null, 'Frank Herbert', undefined, false, '42%']} />
    );
    expect(metaItems(container)).toEqual(['Frank Herbert', '42%']);
  });

  it('renders nothing at all when there is no datum to show', () => {
    // `renderWithProviders` wraps `ui` in one container div of its own.
    const { container } = renderLine(<MetaLine items={[]} />);
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });

  it('passes className through to the outer element', () => {
    const { container } = renderLine(<MetaLine items={['x']} className="muted" />);
    expect(container.firstElementChild).toHaveClass('muted');
  });

  it('with no separator, items are spaced by gaps and draw no separator', () => {
    const { container } = renderLine(<MetaLine items={['Slug', 'Cover']} />);
    const list = listOf(container);
    expect(getComputedStyle(list).columnGap).toBe(lightTheme.space.lg);
    expect(getComputedStyle(list).rowGap).toBe(lightTheme.space.sm);
    expect(list.style.getPropertyValue('--meta-separator')).toBe('');
  });

  it('separator draws that character between items, outside the DOM text', () => {
    const { container } = renderLine(<MetaLine items={['a', 'b']} separator="|" />);
    expect(container.textContent).toBe('ab');
    expect(listOf(container).style.getPropertyValue('--meta-separator')).toBe('"|"');
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('\n');
    expect(css).toContain('content: var(--meta-separator)');
  });

  it.each([
    ['"', String.raw`"\""`],
    ['\\', String.raw`"\\"`],
    ['\n', String.raw`"\a "`],
  ])('escapes the separator %j for CSS', (separator, literal) => {
    const { container } = renderLine(<MetaLine items={['a', 'b']} separator={separator} />);
    expect(listOf(container).style.getPropertyValue('--meta-separator')).toBe(literal);
  });

  it('renders a pair as a faint, capitalized label followed by its value', () => {
    const { container, getByText } = renderLine(
      <MetaLine items={[{ label: 'cover fit', value: 'Contain' }]} />
    );
    expect(metaItems(container)).toEqual(['cover fit Contain']);
    const label = getComputedStyle(getByText('cover fit'));
    expect(channels(label.color)).toEqual(channels(lightTheme.color.text.faint));
    expect(label.textTransform).toBe('capitalize');
  });

  it('skips a pair whose value is null, undefined or false, keeps 0 and empty string', () => {
    const { container } = renderLine(
      <MetaLine
        items={[
          { label: 'a', value: null },
          { label: 'b', value: undefined },
          { label: 'c', value: false },
          { label: 'd', value: 0 },
          { label: 'e', value: '' },
        ]}
      />
    );
    expect(metaItems(container)).toEqual(['d 0', 'e ']);
  });

  it('mixes plain items and pairs in order', () => {
    const { container } = renderLine(
      <MetaLine items={['Frank Herbert', { label: 'format', value: 'EPUB' }, '42%']} />
    );
    expect(metaItems(container)).toEqual(['Frank Herbert', 'format EPUB', '42%']);
  });

  it('pairs sharing a label or holding elements do not warn about keys', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderLine(
      <MetaLine
        items={[
          { label: 'tag', value: <b>One</b> },
          { label: 'tag', value: <b>Two</b> },
        ]}
      />
    );
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("treats separator='' as unset: gaps, no separator variable", () => {
    const { container } = renderLine(<MetaLine items={['a', 'b']} separator="" />);
    const list = listOf(container);
    expect(getComputedStyle(list).columnGap).toBe(lightTheme.space.lg);
    expect(list.style.getPropertyValue('--meta-separator')).toBe('');
  });

  it('mixes plain items and pairs with a separator, keeping order and no separator text', () => {
    const { container } = renderLine(
      <MetaLine
        items={['Frank Herbert', { label: 'format', value: 'EPUB' }, '42%']}
        separator="·"
      />
    );
    expect(metaItems(container)).toEqual(['Frank Herbert', 'format EPUB', '42%']);
    expect(container.textContent).not.toContain('·');
  });

  it('clips with logical properties so right-to-left lines clip the right edge', () => {
    renderLine(<MetaLine items={['a', 'b']} separator="|" />);
    const css = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('\n');
    expect(css).toContain('margin-inline-start: -1em');
    expect(css).not.toContain('margin-left: -1em');
  });

  describe('multi-character separator warning', () => {
    afterEach(() => vi.restoreAllMocks());

    it("warns once per distinct separator for '->'", () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderLine(<MetaLine items={['a', 'b']} separator="->" />);
      renderLine(<MetaLine items={['a', 'b']} separator="->" />);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('"->"');
    });

    it('never throws when there is no process global', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      // Mount first: the theme provider reads `process` itself, outside this component.
      const { rerender } = renderLine(<MetaLine items={['a', 'b']} separator="·" />);
      vi.stubGlobal('process', undefined);
      try {
        expect(() => rerender(<MetaLine items={['a', 'b']} separator="=>" />)).not.toThrow();
      } finally {
        vi.unstubAllGlobals();
      }
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it.each(['·', '👍🏽', ''])('does not warn for %j', (separator) => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderLine(<MetaLine items={['a', 'b']} separator={separator} />);
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
