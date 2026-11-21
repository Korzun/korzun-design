import { act, fireEvent, screen } from '@testing-library/react';
import { useRef, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { Popover, type PopoverProps } from './index.js';

type RectInit = { top: number; bottom: number; left: number; right: number; width: number };

const DEFAULT_ANCHOR: RectInit = { top: 100, bottom: 130, left: 100, right: 300, width: 200 };
const CONTENT = { width: 200, height: 150 };

let anchorRect: RectInit = DEFAULT_ANCHOR;
const originalWidth = window.innerWidth;
const originalHeight = window.innerHeight;

const toDomRect = (r: RectInit) =>
  ({
    ...r,
    height: r.bottom - r.top,
    x: r.left,
    y: r.top,
    toJSON: () => r,
  }) as DOMRect;

beforeEach(() => {
  anchorRect = DEFAULT_ANCHOR;
  window.innerWidth = 1000;
  window.innerHeight = 800;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.dataset.testid === 'anchor') return toDomRect(anchorRect);
    return toDomRect({
      top: 0,
      bottom: CONTENT.height,
      left: 0,
      right: CONTENT.width,
      width: CONTENT.width,
    });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  window.innerWidth = originalWidth;
  window.innerHeight = originalHeight;
});

type HarnessProps = Partial<Omit<PopoverProps, 'anchorRef' | 'children'>> & {
  children?: ReactNode;
};

const Harness = ({ open = true, children, ...rest }: HarnessProps) => {
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={anchor} data-testid="anchor">
        anchor
      </div>
      <button type="button">outside</button>
      <Popover anchorRef={anchor} open={open} {...rest}>
        {children ?? <div>content</div>}
      </Popover>
    </>
  );
};

const wrapper = () => screen.getByText('content').parentElement as HTMLElement;

const escape = (target: EventTarget) => {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
};

describe('Popover', () => {
  describe('placement', () => {
    it('keeps the default position: below, left-aligned, anchor width', () => {
      renderWithProviders(<Harness />);
      const el = wrapper();
      expect(el.style.top).toBe('134px');
      expect(el.style.left).toBe('100px');
      expect(el.style.width).toBe('200px');
      expect(el).toHaveAttribute('data-side', 'bottom');
      expect(el.style.visibility).not.toBe('hidden');
    });

    it('opens above with side="top"', () => {
      anchorRect = { top: 400, bottom: 430, left: 100, right: 300, width: 200 };
      renderWithProviders(<Harness side="top" />);
      const el = wrapper();
      expect(el.style.top).toBe('246px');
      expect(el).toHaveAttribute('data-side', 'top');
    });

    it('flips above when there is no room below', () => {
      anchorRect = { top: 700, bottom: 730, left: 100, right: 300, width: 200 };
      renderWithProviders(<Harness />);
      expect(wrapper()).toHaveAttribute('data-side', 'top');
    });

    it('re-measures on scroll, including the flip decision', () => {
      renderWithProviders(<Harness />);
      expect(wrapper()).toHaveAttribute('data-side', 'bottom');
      anchorRect = { top: 700, bottom: 730, left: 100, right: 300, width: 200 };
      act(() => {
        fireEvent.scroll(window);
      });
      expect(wrapper()).toHaveAttribute('data-side', 'top');
    });
  });

  describe('Escape', () => {
    it('calls onClose', () => {
      const onClose = vi.fn();
      renderWithProviders(<Harness onClose={onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('ignores an Escape a control already handled', () => {
      const onClose = vi.fn();
      renderWithProviders(
        <Harness onClose={onClose}>
          <div>content</div>
          <button type="button" onKeyDown={(e) => e.key === 'Escape' && e.preventDefault()}>
            inner
          </button>
        </Harness>
      );
      escape(screen.getByRole('button', { name: 'inner' }));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('prevents default so an enclosing dialog stays open', () => {
      renderWithProviders(<Harness onClose={vi.fn()} />);
      expect(escape(document.body).defaultPrevented).toBe(true);
    });

    it('adds no listener when closed', () => {
      const onClose = vi.fn();
      renderWithProviders(<Harness open={false} onClose={onClose} />);
      expect(escape(document.body).defaultPrevented).toBe(false);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('adds no listener without onClose', () => {
      renderWithProviders(<Harness />);
      expect(escape(document.body).defaultPrevented).toBe(false);
    });
  });

  describe('outside click', () => {
    it('calls onClose on a mousedown outside', () => {
      const onClose = vi.fn();
      renderWithProviders(<Harness onClose={onClose} />);
      fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('ignores a mousedown inside the content or on the anchor', () => {
      const onClose = vi.fn();
      renderWithProviders(<Harness onClose={onClose} />);
      fireEvent.mouseDown(screen.getByText('content'));
      fireEvent.mouseDown(screen.getByTestId('anchor'));
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
