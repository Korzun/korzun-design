import { act, fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useLayer } from './index.js';

type HarnessProps = {
  id: string;
  active?: boolean;
  onEscape?: () => void;
  onOutsidePointerDown?: () => void;
};

const Harness = ({ id, active = true, onEscape, onOutsidePointerDown }: HarnessProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayer(active, {
    onEscape,
    contains: (node) => ref.current?.contains(node) ?? false,
    onOutsidePointerDown,
  });
  return <div ref={ref} data-testid={id} />;
};

const escape = () => {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  act(() => {
    document.body.dispatchEvent(event);
  });
  return event;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useLayer', () => {
  describe('Escape', () => {
    it("Escape calls only the top layer's onEscape and preventDefaults", () => {
      const a = vi.fn();
      const b = vi.fn();
      render(
        <>
          <Harness id="a" onEscape={a} />
          <Harness id="b" onEscape={b} />
        </>
      );
      const event = escape();
      expect(b).toHaveBeenCalledTimes(1);
      expect(a).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
    });

    it('Escape already defaultPrevented reaches no layer', () => {
      const a = vi.fn();
      render(<Harness id="a" onEscape={a} />);
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      event.preventDefault();
      act(() => {
        document.body.dispatchEvent(event);
      });
      expect(a).not.toHaveBeenCalled();
    });

    it('ignores keys other than Escape', () => {
      const a = vi.fn();
      render(<Harness id="a" onEscape={a} />);
      fireEvent.keyDown(document.body, { key: 'Enter' });
      expect(a).not.toHaveBeenCalled();
    });

    it('a pass-through top layer swallows nothing', () => {
      const a = vi.fn();
      render(
        <>
          <Harness id="a" onEscape={a} />
          <Harness id="b" />
        </>
      );
      const event = escape();
      expect(a).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it('deactivating the top layer hands Escape to the next', () => {
      const a = vi.fn();
      const b = vi.fn();
      const { rerender } = render(
        <>
          <Harness id="a" onEscape={a} />
          <Harness id="b" onEscape={b} />
        </>
      );
      rerender(
        <>
          <Harness id="a" onEscape={a} />
          <Harness id="b" onEscape={b} active={false} />
        </>
      );
      escape();
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).not.toHaveBeenCalled();
    });

    it('unmounting a layer removes it', () => {
      const a = vi.fn();
      const b = vi.fn();
      const { rerender } = render(
        <>
          <Harness id="a" onEscape={a} />
          <Harness id="b" onEscape={b} />
        </>
      );
      rerender(
        <>
          <Harness id="a" onEscape={a} />
        </>
      );
      escape();
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).not.toHaveBeenCalled();
    });
  });

  describe('pointer-down', () => {
    it('mousedown inside the top layer closes nothing', () => {
      const a = vi.fn();
      const b = vi.fn();
      const { getByTestId } = render(
        <>
          <Harness id="a" onOutsidePointerDown={a} />
          <Harness id="b" onOutsidePointerDown={b} />
        </>
      );
      fireEvent.mouseDown(getByTestId('b'));
      expect(a).not.toHaveBeenCalled();
      expect(b).not.toHaveBeenCalled();
    });

    it('mousedown inside a lower layer closes only the layers above it', () => {
      const a = vi.fn();
      const b = vi.fn();
      const c = vi.fn();
      const { getByTestId } = render(
        <>
          <Harness id="a" onOutsidePointerDown={a} />
          <Harness id="b" onOutsidePointerDown={b} />
          <Harness id="c" onOutsidePointerDown={c} />
        </>
      );
      fireEvent.mouseDown(getByTestId('b'));
      expect(c).toHaveBeenCalledTimes(1);
      expect(b).not.toHaveBeenCalled();
      expect(a).not.toHaveBeenCalled();
    });

    it('mousedown outside everything reaches every layer, top first', () => {
      const order: string[] = [];
      render(
        <>
          <Harness id="a" onOutsidePointerDown={() => order.push('a')} />
          <Harness id="b" onOutsidePointerDown={() => order.push('b')} />
          <Harness id="c" onOutsidePointerDown={() => order.push('c')} />
        </>
      );
      fireEvent.mouseDown(document.body);
      expect(order).toEqual(['c', 'b', 'a']);
    });
  });

  it('re-rendering a lower layer with new callbacks keeps its position and uses the new callback', () => {
    const oldA = vi.fn();
    const newA = vi.fn();
    const b = vi.fn();
    const order: string[] = [];
    const { rerender } = render(
      <>
        <Harness id="a" onEscape={oldA} onOutsidePointerDown={() => order.push('old a')} />
        <Harness id="b" onEscape={b} onOutsidePointerDown={() => order.push('b')} />
      </>
    );
    rerender(
      <>
        <Harness id="a" onEscape={newA} onOutsidePointerDown={() => order.push('new a')} />
        <Harness id="b" onEscape={b} onOutsidePointerDown={() => order.push('b')} />
      </>
    );
    escape();
    expect(b).toHaveBeenCalledTimes(1);
    expect(newA).not.toHaveBeenCalled();
    fireEvent.mouseDown(document.body);
    expect(order).toEqual(['b', 'new a']);
    rerender(
      <>
        <Harness id="a" onEscape={newA} />
        <Harness id="b" onEscape={b} active={false} />
      </>
    );
    escape();
    expect(newA).toHaveBeenCalledTimes(1);
    expect(oldA).not.toHaveBeenCalled();
  });

  it('no document listener while the stack is empty', () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const { rerender, unmount } = render(<Harness id="a" active={false} onEscape={vi.fn()} />);
    const ours = (spy: typeof add) =>
      spy.mock.calls.filter(([type]) => type === 'keydown' || type === 'mousedown');
    expect(ours(add)).toHaveLength(0);
    rerender(<Harness id="a" onEscape={vi.fn()} />);
    expect(ours(add).map(([type]) => type)).toEqual(['keydown', 'mousedown']);
    unmount();
    expect(ours(remove).map(([type]) => type)).toEqual(['keydown', 'mousedown']);
  });
});
