import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Page } from '../../component/page/index.js';
import { renderWithProviders } from '../../test-utils.js';
import { Button } from '../button/index.js';
import { Dialog } from '../dialog/index.js';
import { Popover, type PopoverProps } from './index.js';

type RectInit = { top: number; bottom: number; left: number; right: number; width: number };

const DEFAULT_ANCHOR: RectInit = { top: 100, bottom: 130, left: 100, right: 300, width: 200 };
const DEFAULT_CONTENT = { width: 200, height: 150 };

let anchorRect: RectInit = DEFAULT_ANCHOR;
let contentSize = DEFAULT_CONTENT;
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
  contentSize = DEFAULT_CONTENT;
  window.innerWidth = 1000;
  window.innerHeight = 800;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.dataset.testid === 'anchor') return toDomRect(anchorRect);
    return toDomRect({
      top: 0,
      bottom: contentSize.height,
      left: 0,
      right: contentSize.width,
      width: contentSize.width,
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
  it('a Button inside the popover is 4px even when its anchor sits directly on a Page', () => {
    renderWithProviders(
      <Page>
        <Harness>
          <Button>Inside</Button>
        </Harness>
      </Page>
    );
    expect(getComputedStyle(screen.getByRole('button', { name: 'Inside' })).borderRadius).toBe(
      '4px'
    );
  });

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

    it('opens above with side="top", anchored by its bottom edge', () => {
      anchorRect = { top: 400, bottom: 430, left: 100, right: 300, width: 200 };
      renderWithProviders(<Harness side="top" />);
      const el = wrapper();
      expect(el.style.bottom).toBe('404px');
      expect(el.style.top).toBe('');
      expect(el).toHaveAttribute('data-side', 'top');
    });

    it('names the side it was asked for in data-preferred-side, flipped or not', () => {
      renderWithProviders(<Harness />);
      expect(wrapper()).toHaveAttribute('data-preferred-side', 'bottom');
      cleanup();
      renderWithProviders(<Harness side="top" />);
      expect(wrapper()).toHaveAttribute('data-preferred-side', 'top');
    });

    it('aligns end with matchWidth={false}', () => {
      contentSize = { width: 100, height: 150 };
      renderWithProviders(<Harness align="end" matchWidth={false} />);
      const el = wrapper();
      expect(el.style.left).toBe('200px');
      expect(el.style.width).toBe('');
    });

    it('does not hide the first render from focus: an autoFocus child gets focus', () => {
      renderWithProviders(
        <Harness>
          <div>content</div>
          <input aria-label="search" autoFocus />
        </Harness>
      );
      expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'search' }));
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

  describe('content resize', () => {
    type Observer = {
      callback: () => void;
      observe: ReturnType<typeof vi.fn>;
      disconnect: ReturnType<typeof vi.fn>;
    };
    let observers: Observer[];
    const original = window.ResizeObserver;

    beforeEach(() => {
      observers = [];
      window.ResizeObserver = class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
        constructor(public callback: () => void) {
          observers.push(this);
        }
      } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
      window.ResizeObserver = original;
    });

    const resize = () =>
      act(() => {
        observers.forEach((o) => o.callback());
      });

    it('observes the content and keeps a top-side popover attached as it grows', () => {
      anchorRect = { top: 400, bottom: 430, left: 100, right: 300, width: 200 };
      renderWithProviders(<Harness side="top" />);
      const el = wrapper();
      expect(observers.some((o) => o.observe.mock.calls.some(([t]) => t === el))).toBe(true);
      contentSize = { width: 200, height: 300 };
      resize();
      expect(el.style.bottom).toBe('404px');
      expect(el.style.top).toBe('');
      expect(el).toHaveAttribute('data-side', 'top');
    });

    it('re-measures on a content resize, including the flip decision', () => {
      anchorRect = { top: 470, bottom: 500, left: 100, right: 300, width: 200 };
      renderWithProviders(<Harness />);
      expect(wrapper()).toHaveAttribute('data-side', 'bottom');
      contentSize = { width: 200, height: 350 };
      resize();
      expect(wrapper()).toHaveAttribute('data-side', 'top');
    });

    it('disconnects on close', () => {
      const { rerender } = renderWithProviders(<Harness />);
      expect(observers.length).toBeGreaterThan(0);
      rerender(<Harness open={false} />);
      expect(observers.every((o) => o.disconnect.mock.calls.length > 0)).toBe(true);
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

    it('calls preventDefault on the Escape keydown (what keeps a native dialog from cancelling)', () => {
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

  describe('nested popovers', () => {
    const Nested = ({ onOuter, onInner }: { onOuter: () => void; onInner: () => void }) => {
      const outer = useRef<HTMLDivElement>(null);
      const inner = useRef<HTMLDivElement>(null);
      return (
        <>
          <div ref={outer} data-testid="anchor">
            anchor
          </div>
          <Popover anchorRef={outer} open onClose={onOuter}>
            <div ref={inner}>outer content</div>
            <Popover anchorRef={inner} open onClose={onInner}>
              <div>inner content</div>
            </Popover>
          </Popover>
        </>
      );
    };

    it('nested popovers: Escape closes the inner one only', () => {
      const onOuter = vi.fn();
      const onInner = vi.fn();
      renderWithProviders(<Nested onOuter={onOuter} onInner={onInner} />);
      expect(escape(document.body).defaultPrevented).toBe(true);
      expect(onInner).toHaveBeenCalledTimes(1);
      expect(onOuter).not.toHaveBeenCalled();
    });

    it('nested popovers: a mousedown in the inner content closes neither', () => {
      const onOuter = vi.fn();
      const onInner = vi.fn();
      renderWithProviders(<Nested onOuter={onOuter} onInner={onInner} />);
      fireEvent.mouseDown(screen.getByText('inner content'));
      expect(onInner).not.toHaveBeenCalled();
      expect(onOuter).not.toHaveBeenCalled();
    });
  });

  describe('gap', () => {
    afterEach(() => {
      document.documentElement.style.fontSize = '';
    });

    it('gap accepts a rem string', () => {
      document.documentElement.style.fontSize = '16px';
      renderWithProviders(<Harness gap="0.375rem" />);
      expect(wrapper().style.top).toBe(`${DEFAULT_ANCHOR.bottom + 6}px`);
    });

    it('gap accepts a px string', () => {
      renderWithProviders(<Harness gap="10px" />);
      expect(wrapper().style.top).toBe(`${DEFAULT_ANCHOR.bottom + 10}px`);
    });

    it('gap rejects other units at the type level', () => {
      // `tsc --noEmit` (in lint) enforces the @ts-expect-error lines.
      // @ts-expect-error em is not a supported unit
      const em = <Harness gap="1em" />;
      // @ts-expect-error a bare unitless string is not a number
      const unitless = <Harness gap="6" />;
      expect([em, unitless]).toHaveLength(2);
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

  describe('portal target', () => {
    const InDialog = ({ open, dialogOpen = true }: { open: boolean; dialogOpen?: boolean }) => {
      const anchor = useRef<HTMLDivElement>(null);
      return (
        <dialog open={dialogOpen}>
          <div ref={anchor} data-testid="anchor" />
          <Popover anchorRef={anchor} open={open}>
            <div>content</div>
          </Popover>
        </dialog>
      );
    };

    it('portals into an open dialog that contains the anchor', () => {
      const { rerender } = renderWithProviders(<InDialog open={false} />);
      rerender(<InDialog open />);
      expect(screen.getByText('content').closest('dialog')).toBe(document.querySelector('dialog'));
    });

    it('mounting open inside a dialog mounts the child once, in the dialog', () => {
      const mounts = vi.fn();
      const Child = () => {
        useEffect(() => mounts(), []);
        return <div>content</div>;
      };
      const Mounted = () => {
        const anchor = useRef<HTMLDivElement>(null);
        return (
          <dialog open>
            <div ref={anchor} data-testid="anchor" />
            <Popover anchorRef={anchor} open>
              <Child />
            </Popover>
          </dialog>
        );
      };
      renderWithProviders(<Mounted />);
      expect(screen.getByText('content').closest('dialog')).toBe(document.querySelector('dialog'));
      expect(mounts).toHaveBeenCalledTimes(1);
    });

    it('portals to document.body outside a dialog', () => {
      renderWithProviders(<Harness />);
      expect(wrapper().parentElement).toBe(document.body);
    });

    it('portals to document.body when the containing dialog is closed', () => {
      const { rerender } = renderWithProviders(<InDialog open={false} dialogOpen={false} />);
      rerender(<InDialog open dialogOpen={false} />);
      expect(wrapper().parentElement).toBe(document.body);
    });

    describe('inside a Dialog', () => {
      beforeEach(() => {
        HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
          this.setAttribute('open', '');
        });
        HTMLDialogElement.prototype.close = vi.fn();
      });

      const InModal = ({
        open,
        onDialogClose,
        onClose,
      }: {
        open: boolean;
        onDialogClose: () => void;
        onClose: () => void;
      }) => {
        const anchor = useRef<HTMLDivElement>(null);
        return (
          <Dialog open onClose={onDialogClose} title="T">
            <div ref={anchor} data-testid="anchor" />
            <Popover anchorRef={anchor} open={open} onClose={onClose}>
              <div>content</div>
            </Popover>
          </Dialog>
        );
      };

      const setup = () => {
        const onDialogClose = vi.fn();
        const onClose = vi.fn();
        const { rerender } = renderWithProviders(
          <InModal open={false} onDialogClose={onDialogClose} onClose={onClose} />
        );
        rerender(<InModal open onDialogClose={onDialogClose} onClose={onClose} />);
        return { onDialogClose, onClose };
      };

      it('Escape closes the popover and not the Dialog', () => {
        const { onDialogClose, onClose } = setup();
        expect(screen.getByText('content').closest('dialog')).toHaveAttribute('open');
        const event = escape(document);
        expect(onClose).toHaveBeenCalledOnce();
        // jsdom never turns keydown into a native cancel; defaultPrevented is
        // what stops a real browser's dialog cancel.
        expect(event.defaultPrevented).toBe(true);
        expect(onDialogClose).not.toHaveBeenCalled();
      });

      // jsdom does not model the backdrop path (the dialog's own mousedown+click
      // target); this checks only that content events do not reach onClose.
      it('clicking popover content does not close the Dialog', () => {
        const { onDialogClose, onClose } = setup();
        fireEvent.mouseDown(screen.getByText('content'));
        fireEvent.click(screen.getByText('content'));
        expect(onDialogClose).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
      });

      it('mounted open together with its Dialog, Escape still closes the popover first', () => {
        const onDialogClose = vi.fn();
        const onClose = vi.fn();
        renderWithProviders(<InModal open onDialogClose={onDialogClose} onClose={onClose} />);
        expect(escape(document).defaultPrevented).toBe(true);
        expect(onClose).toHaveBeenCalledOnce();
      });
    });
  });
});
