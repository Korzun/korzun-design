import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { Anchor, type AnchorItem } from './index.js';

const items: AnchorItem[] = [
  { id: 'intro', title: 'Intro' },
  { id: 'setup', title: 'Setup', level: 2 },
  { id: 'usage', title: 'Usage', level: 3 },
];

// The target sections, outside the Anchor, with a stubbed top each.
const tops: Record<string, number> = {};
const addTargets = (ids: string[]) => {
  for (const id of ids) {
    const el = document.createElement('h2');
    el.id = id;
    el.textContent = id;
    el.getBoundingClientRect = () => ({ top: tops[id] ?? 0 }) as DOMRect;
    document.body.appendChild(el);
  }
};
const setTops = (values: number[], ids = ['intro', 'setup', 'usage']) => {
  ids.forEach((id, i) => (tops[id] = values[i]!));
};
const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
};
const current = () =>
  screen
    .getAllByRole('link')
    .filter((a) => a.getAttribute('aria-current') === 'location')
    .map((a) => a.textContent);

// `0.5rem` or `calc(1.125rem)` (jsdom folds the calc), in rem.
const rem = (value: string) => parseFloat(value.replace(/^calc\(/, ''));

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
  vi.stubGlobal('scrollTo', vi.fn());
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: 5000,
  });
  addTargets(['intro', 'setup', 'usage']);
  setTops([0, 500, 1000]);
});

afterEach(() => {
  vi.unstubAllGlobals();
  for (const id of ['intro', 'setup', 'usage']) document.getElementById(id)?.remove();
  window.location.hash = '';
});

describe('Anchor', () => {
  it('renders a labelled nav with one link per item, titles as text', () => {
    renderWithProviders(<Anchor items={items} />);
    const nav = screen.getByRole('navigation', { name: 'On this page' });
    const list = within(nav).getByRole('list');
    const links = within(list).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#intro', '#setup', '#usage']);
    expect(links.map((a) => a.textContent)).toEqual(['Intro', 'Setup', 'Usage']);
  });

  it('takes ariaLabel and className on the nav', () => {
    renderWithProviders(<Anchor items={items} ariaLabel="Contents" className="extra" />);
    expect(screen.getByRole('navigation', { name: 'Contents' })).toHaveClass('extra');
  });

  it('renders nothing for empty items', () => {
    renderWithProviders(<Anchor items={[]} />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('indents deeper levels further', () => {
    renderWithProviders(<Anchor items={items} />);
    const [one, two, three] = screen
      .getAllByRole('link')
      .map((a) => rem(getComputedStyle(a).paddingInlineStart));
    expect(two).toBeGreaterThan(one!);
    expect(three).toBeGreaterThan(two!);
  });

  it('marks the last section whose top has passed the offset as current', () => {
    renderWithProviders(<Anchor items={items} />);
    setTops([-400, -10, 300]);
    scrollTo(600);
    expect(current()).toEqual(['Setup']);
    const intro = screen.getByRole('link', { name: 'Intro' });
    expect(intro).not.toHaveAttribute('aria-current');
  });

  it('marks the first section current above it', () => {
    setTops([100, 500, 1000]);
    renderWithProviders(<Anchor items={items} />);
    expect(current()).toEqual(['Intro']);
  });

  it('marks the last section current at the bottom of the page', () => {
    renderWithProviders(<Anchor items={items} />);
    setTops([-3000, -2000, 200]);
    scrollTo(4200);
    expect(current()).toEqual(['Usage']);
  });

  it('counts a section as passed once its top is within offset + 1px', () => {
    setTops([-400, 60, 300]);
    const { unmount } = renderWithProviders(<Anchor items={items} />);
    expect(current()).toEqual(['Intro']);
    unmount();
    renderWithProviders(<Anchor items={items} offset={64} />);
    expect(current()).toEqual(['Setup']);
    setTops([-400, 66, 300]);
    scrollTo(10);
    expect(current()).toEqual(['Intro']);
    setTops([-400, 65, 300]);
    scrollTo(11);
    expect(current()).toEqual(['Setup']);
  });

  it('lists an item whose element is missing but never makes it current', () => {
    const withMissing = [...items.slice(0, 2), { id: 'gone', title: 'Gone' }];
    setTops([-400, -10]);
    renderWithProviders(<Anchor items={withMissing} />);
    expect(screen.getByRole('link', { name: 'Gone' })).toHaveAttribute('href', '#gone');
    scrollTo(4200);
    expect(current()).toEqual(['Setup']);
  });

  it('scrolls the target below the offset on click, focuses it and keeps the URL', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 200 });
    renderWithProviders(<Anchor items={items} offset={64} />);
    await user.click(screen.getByRole('link', { name: 'Setup' }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 200 + 500 - 64, behavior: 'smooth' });
    expect(window.location.hash).toBe('');
    const target = document.getElementById('setup')!;
    expect(target).toHaveAttribute('tabindex', '-1');
    expect(target).toHaveFocus();
  });

  it('keeps a target tabindex it already has', async () => {
    const user = userEvent.setup();
    document.getElementById('usage')!.setAttribute('tabindex', '0');
    renderWithProviders(<Anchor items={items} />);
    await user.click(screen.getByRole('link', { name: 'Usage' }));
    expect(document.getElementById('usage')).toHaveAttribute('tabindex', '0');
  });

  it('jumps without smooth scrolling under prefers-reduced-motion', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    renderWithProviders(<Anchor items={items} />);
    await user.click(screen.getByRole('link', { name: 'Usage' }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: 'auto' });
  });

  it('removes its scroll and resize listeners on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderWithProviders(<Anchor items={items} />);
    unmount();
    const types = remove.mock.calls.map(([type]) => type);
    expect(types).toContain('scroll');
    expect(types).toContain('resize');
    remove.mockRestore();
  });

  describe.each([
    ['offset', { offset: 64 }],
    ['items', { items: items.slice(0, 2) }],
  ] as const)('rerendered with new %s', (_name, change) => {
    it('removes the old listeners and cancels a pending frame', () => {
      // A frame that never runs, so one is pending when the props change.
      vi.stubGlobal('requestAnimationFrame', () => 42);
      const cancel = vi.fn();
      vi.stubGlobal('cancelAnimationFrame', cancel);
      const remove = vi.spyOn(window, 'removeEventListener');
      const { rerender } = renderWithProviders(<Anchor items={items} />);
      expect(remove).not.toHaveBeenCalledWith('scroll', expect.anything());
      rerender(<Anchor items={items} {...change} />);
      const types = remove.mock.calls.map(([type]) => type);
      expect(types).toContain('scroll');
      expect(types).toContain('resize');
      expect(cancel).toHaveBeenCalledWith(42);
      remove.mockRestore();
    });
  });

  describe('minimap', () => {
    const nav = () => screen.getByRole('navigation', { name: 'On this page' });

    it('renders the same links, titles hidden at rest, and one dash per item', () => {
      renderWithProviders(<Anchor items={items} variant="minimap" />);
      const links = screen.getAllByRole('link');
      expect(links.map((a) => a.textContent)).toEqual(['Intro', 'Setup', 'Usage']);
      expect(nav()).not.toHaveAttribute('data-open');
      const list = within(nav()).getByRole('list');
      expect(getComputedStyle(list).position).toBe('absolute');
      expect(getComputedStyle(list).width).toBe('1px');
      expect(getComputedStyle(list).overflow).toBe('hidden');
      expect(nav().querySelectorAll('[data-anchor-dash]')).toHaveLength(3);
    });

    it('marks the current dash', () => {
      setTops([-400, -10, 300]);
      renderWithProviders(<Anchor items={items} variant="minimap" />);
      const dashes = Array.from(nav().querySelectorAll('[data-anchor-dash]'));
      expect(dashes.map((d) => d.getAttribute('data-current'))).toEqual([null, 'true', null]);
    });

    it('opens on focus within and closes when focus leaves', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <>
          <Anchor items={items} variant="minimap" />
          <button type="button">After</button>
        </>
      );
      await user.tab();
      expect(screen.getByRole('link', { name: 'Intro' })).toHaveFocus();
      expect(nav()).toHaveAttribute('data-open', 'true');
      await user.tab();
      expect(nav()).toHaveAttribute('data-open', 'true');
      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      expect(nav()).not.toHaveAttribute('data-open');
    });

    it('opens on hover and closes when the pointer leaves', () => {
      renderWithProviders(<Anchor items={items} variant="minimap" />);
      fireEvent.mouseEnter(nav());
      expect(nav()).toHaveAttribute('data-open', 'true');
      fireEvent.mouseLeave(nav());
      expect(nav()).not.toHaveAttribute('data-open');
    });

    it('closes a hover-opened panel on Escape', () => {
      renderWithProviders(<Anchor items={items} variant="minimap" />);
      fireEvent.mouseEnter(nav());
      expect(nav()).toHaveAttribute('data-open', 'true');
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(nav()).not.toHaveAttribute('data-open');
    });

    it('stays open on Escape while focus is inside, so the focused link stays visible', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Anchor items={items} variant="minimap" />);
      fireEvent.mouseEnter(nav());
      await user.tab();
      await user.keyboard('{Escape}');
      expect(screen.getByRole('link', { name: 'Intro' })).toHaveFocus();
      expect(nav()).toHaveAttribute('data-open', 'true');
      expect(getComputedStyle(within(nav()).getByRole('list')).width).not.toBe('1px');
      // The Escape cleared the hover: leaving focus now closes it.
      fireEvent.blur(screen.getByRole('link', { name: 'Intro' }), { relatedTarget: document.body });
      expect(nav()).not.toHaveAttribute('data-open');
    });

    it('scrolls to an item when its dash is clicked', () => {
      renderWithProviders(<Anchor items={items} variant="minimap" />);
      fireEvent.click(nav().querySelectorAll('[data-anchor-dash]')[2]!);
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: 'smooth' });
    });

    it('opens no panel in the list look', () => {
      renderWithProviders(<Anchor items={items} />);
      fireEvent.mouseEnter(nav());
      expect(nav()).not.toHaveAttribute('data-open');
      expect(nav().querySelectorAll('[data-anchor-dash]')).toHaveLength(0);
    });
  });
});
