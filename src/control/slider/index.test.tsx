import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test-utils.js';
import { Slider, type SliderProps } from './index.js';

const renderSlider = (props: Partial<SliderProps> = {}) => {
  const onChange = vi.fn();
  const onChangeEnd = vi.fn();
  const utils = renderWithProviders(
    <Slider
      value={30}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
      ariaLabel="Volume"
      {...props}
    />
  );
  return { ...utils, onChange, onChangeEnd, slider: screen.getByRole('slider') };
};

const thumbLeft = () => screen.getByTestId('slider-thumb').style.left;

const CHAPTERS = [{ value: 12 }, { value: 40 }, { value: 80 }];

describe('Slider', () => {
  it('is a named slider with its range and value', () => {
    renderSlider();
    const el = screen.getByRole('slider', { name: 'Volume' });
    expect(el).toHaveAttribute('aria-valuemin', '0');
    expect(el).toHaveAttribute('aria-valuemax', '100');
    expect(el).toHaveAttribute('aria-valuenow', '30');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('ariaValueText names the value for screen readers', () => {
    const { slider } = renderSlider({ ariaValueText: (v) => `Chapter ${v}` });
    expect(slider).toHaveAttribute('aria-valuetext', 'Chapter 30');
  });

  it('places the thumb at the value', () => {
    renderSlider();
    expect(thumbLeft()).toBe('30%');
  });

  it.each([
    [150, '100', '100%'],
    [-20, '0', '0%'],
    [Number.NaN, '0', '0%'],
  ])('clamps value %s', (value, now, left) => {
    const { slider } = renderSlider({ value });
    expect(slider).toHaveAttribute('aria-valuenow', now);
    expect(thumbLeft()).toBe(left);
  });

  it('a range with max not above min does not divide by zero', () => {
    renderSlider({ min: 5, max: 5, value: 5 });
    expect(thumbLeft()).toBe('0%');
  });

  it('Tab focuses it', async () => {
    const { slider } = renderSlider();
    await userEvent.setup().tab();
    expect(slider).toHaveFocus();
  });

  it.each([
    ['{ArrowRight}', 31],
    ['{ArrowUp}', 31],
    ['{ArrowLeft}', 29],
    ['{ArrowDown}', 29],
    ['{PageUp}', 40],
    ['{PageDown}', 20],
    ['{Home}', 0],
    ['{End}', 100],
  ])('%s calls onChange and onChangeEnd with %s', async (key, expected) => {
    const user = userEvent.setup();
    const { onChange, onChangeEnd } = renderSlider();
    await user.tab();
    await user.keyboard(key);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expected);
    expect(onChangeEnd).toHaveBeenCalledExactlyOnceWith(expected);
  });

  it('a value between snap points moves to the next one in that direction', async () => {
    const user = userEvent.setup();
    const { onChange } = renderSlider({ value: 37, step: 5 });
    await user.tab();
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowLeft}');
    expect(onChange.mock.calls).toEqual([[40], [35]]);
  });

  it.each([
    ['{ArrowRight}', 12, 40],
    ['{PageUp}', 12, 40],
    ['{End}', 12, 80],
    ['{ArrowLeft}', 80, 40],
    ['{PageDown}', 80, 40],
    ['{Home}', 80, 12],
  ])('step null: %s from %s moves between detents only, to %s', async (key, value, expected) => {
    const user = userEvent.setup();
    const { onChange } = renderSlider({ step: null, detents: CHAPTERS, value });
    await user.tab();
    await user.keyboard(key);
    expect(onChange).toHaveBeenLastCalledWith(expected);
  });

  it('a key that would not change the value calls nothing', async () => {
    const user = userEvent.setup();
    const { onChange, onChangeEnd } = renderSlider({ value: 100 });
    await user.tab();
    await user.keyboard('{End}{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
    expect(onChangeEnd).not.toHaveBeenCalled();
  });

  it('is controlled: the value shown does not move until the prop does', async () => {
    const user = userEvent.setup();
    const { slider } = renderSlider();
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '30');
    expect(thumbLeft()).toBe('30%');
  });

  it('draws a tick per detent inside the range, active at or below the value', () => {
    renderSlider({ detents: CHAPTERS, value: 40 });
    const ticks = screen.getAllByTestId('slider-tick');
    expect(ticks).toHaveLength(3);
    expect(ticks.map((t) => t.hasAttribute('data-active'))).toEqual([true, true, false]);
    expect(ticks.map((t) => t.style.left)).toEqual(['12%', '40%', '80%']);
  });

  it('a detent at either end draws no tick, but its label shows', () => {
    renderSlider({
      detents: [{ value: 0, label: 'Zero' }, { value: 50 }, { value: 100, label: 'Full' }],
    });
    expect(screen.getAllByTestId('slider-tick')).toHaveLength(1);
    expect(screen.getByText('Zero')).toBeInTheDocument();
    expect(screen.getByText('Full')).toBeInTheDocument();
  });

  it('shows detent, start and end labels', () => {
    renderSlider({
      detents: [{ value: 50, label: 'Half' }],
      startLabel: 'Not started',
      endLabel: 'Completed',
    });
    expect(screen.getByText('Half')).toBeInTheDocument();
    expect(screen.getByText('Not started')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('a custom thumb replaces the default knob and gets its state', () => {
    const { slider } = renderSlider({
      thumb: (s) => <span>{`v${s.value} ${s.dragging} ${s.focused} ${s.disabled}`}</span>,
    });
    expect(slider).toHaveTextContent('v30 false false false');
    expect(screen.queryByTestId('slider-knob')).not.toBeInTheDocument();
  });

  it('the custom thumb hears about focus', async () => {
    const { slider } = renderSlider({ thumb: (s) => <span>{s.focused ? 'on' : 'off'}</span> });
    await userEvent.setup().tab();
    expect(slider).toHaveTextContent('on');
  });

  it('disabled: marked disabled, out of the tab order, keys do nothing', async () => {
    const user = userEvent.setup();
    const { slider, onChange } = renderSlider({ disabled: true });
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(slider).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    await user.tab();
    expect(slider).not.toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('submits its value under name', () => {
    const { container } = renderWithProviders(
      <form>
        <Slider value={30} onChange={() => {}} ariaLabel="Progress" name="progress" />
      </form>
    );
    const form = container.querySelector('form')!;
    expect(new FormData(form).get('progress')).toBe('30');
  });

  it('passes className and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    renderWithProviders(
      <Slider value={30} onChange={() => {}} ariaLabel="Volume" className="extra" ref={ref} />
    );
    const root = screen.getByTestId('slider');
    expect(root).toHaveClass('extra');
    expect(ref.current).toBe(root);
  });
});

describe('Slider dragging', () => {
  const setup = (props: Partial<SliderProps> = {}) => {
    const utils = renderSlider(props);
    const rail = screen.getByTestId('slider-rail');
    rail.getBoundingClientRect = () =>
      ({ left: 0, width: 200, top: 0, height: 40, right: 200, bottom: 40 }) as DOMRect;
    rail.setPointerCapture = () => {};
    rail.releasePointerCapture = () => {};
    rail.hasPointerCapture = () => true;
    return { ...utils, rail };
  };
  const at = (clientX: number) => ({ clientX, pointerId: 1, button: 0 });

  it('pressing the track jumps to the snapped value under the pointer, then drags', () => {
    const { rail, onChange, onChangeEnd } = setup();
    fireEvent.pointerDown(rail, at(100));
    fireEvent.pointerMove(rail, at(63.4));
    fireEvent.pointerUp(rail, at(63.4));
    expect(onChange.mock.calls).toEqual([[50], [32]]);
    expect(onChangeEnd).toHaveBeenCalledExactlyOnceWith(32);
  });

  it('reports each snapped value once, not every pixel', () => {
    const { rail, onChange } = setup();
    fireEvent.pointerDown(rail, at(100));
    fireEvent.pointerMove(rail, at(100.4));
    fireEvent.pointerMove(rail, at(100.6));
    expect(onChange.mock.calls).toEqual([[50]]);
  });

  it('while dragging the thumb follows the pointer exactly, unanimated; after, the value', () => {
    const { rail } = setup();
    fireEvent.pointerDown(rail, at(63.4));
    expect(thumbLeft()).toBe('31.7%');
    expect(screen.getByTestId('slider').className).toMatch(/dragging/);
    fireEvent.pointerUp(rail, at(63.4));
    expect(thumbLeft()).toBe('30%');
    expect(screen.getByTestId('slider').className).not.toMatch(/dragging/);
  });

  it('clamps a pointer past either end', () => {
    const { rail, onChange } = setup();
    fireEvent.pointerDown(rail, at(-50));
    fireEvent.pointerMove(rail, at(400));
    expect(onChange.mock.calls).toEqual([[0], [100]]);
  });

  it('step null snaps to detents, and ticks colour from the snapped value', () => {
    const { rail, onChange } = setup({ step: null, detents: CHAPTERS, value: 80 });
    fireEvent.pointerDown(rail, at(50));
    expect(onChange).toHaveBeenLastCalledWith(12);
    const active = screen.getAllByTestId('slider-tick').map((t) => t.hasAttribute('data-active'));
    expect(active).toEqual([true, false, false]);
  });

  it('pointer cancel ends the drag without onChangeEnd and returns to the value', () => {
    const { rail, onChangeEnd } = setup();
    fireEvent.pointerDown(rail, at(100));
    fireEvent.pointerCancel(rail, at(100));
    expect(onChangeEnd).not.toHaveBeenCalled();
    expect(thumbLeft()).toBe('30%');
  });

  it('disabled: pressing does nothing', () => {
    const { rail, onChange, onChangeEnd } = setup({ disabled: true });
    fireEvent.pointerDown(rail, at(100));
    fireEvent.pointerUp(rail, at(100));
    expect(onChange).not.toHaveBeenCalled();
    expect(onChangeEnd).not.toHaveBeenCalled();
  });

  it('becoming disabled mid-drag ends the drag silently', () => {
    const onChange = vi.fn();
    const onChangeEnd = vi.fn();
    const { rerender } = renderWithProviders(
      <Slider value={30} onChange={onChange} onChangeEnd={onChangeEnd} ariaLabel="Volume" />
    );
    const rail = screen.getByTestId('slider-rail');
    rail.getBoundingClientRect = () => ({ left: 0, width: 200 }) as DOMRect;
    rail.setPointerCapture = () => {};
    fireEvent.pointerDown(rail, at(100));
    rerender(
      <Slider
        value={30}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        ariaLabel="Volume"
        disabled
      />
    );
    fireEvent.pointerMove(rail, at(150));
    fireEvent.pointerUp(rail, at(150));
    expect(onChange.mock.calls).toEqual([[50]]);
    expect(onChangeEnd).not.toHaveBeenCalled();
    expect(thumbLeft()).toBe('30%');
  });

  it('pressing focuses the thumb, and a custom thumb hears it is dragging', () => {
    const { rail, slider } = setup({ thumb: (s) => <span>{s.dragging ? 'drag' : 'rest'}</span> });
    fireEvent.pointerDown(rail, at(100));
    expect(slider).toHaveFocus();
    expect(slider).toHaveTextContent('drag');
    fireEvent.pointerUp(rail, at(100));
    expect(slider).toHaveTextContent('rest');
  });
});

describe('Slider edge cases', () => {
  it.each([
    ['{PageUp}', 0, 20],
    ['{PageDown}', 40, 20],
  ])('%s with a coarse step from %s still moves one step, to %s', async (key, value, expected) => {
    const user = userEvent.setup();
    const { onChange } = renderSlider({ value, step: 20 });
    await user.tab();
    await user.keyboard(key);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expected);
  });

  it('detents sharing a value do not warn about keys', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderSlider({
      detents: [
        { value: 40, label: 'a' },
        { value: 40, label: 'b' },
      ],
    });
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it.each([
    ['max Infinity', { max: Infinity }],
    ['min NaN', { min: Number.NaN }],
    ['max NaN', { max: Number.NaN }],
  ])('%s renders finite positions without hanging', (_name, props) => {
    renderSlider(props);
    expect(thumbLeft()).toMatch(/^\d+(\.\d+)?%$/);
  });

  it('a disabled slider does not submit, like a disabled native field', () => {
    const { container } = renderWithProviders(
      <form>
        <Slider value={30} onChange={() => {}} ariaLabel="Progress" name="progress" disabled />
      </form>
    );
    expect(new FormData(container.querySelector('form')!).get('progress')).toBeNull();
  });
});
