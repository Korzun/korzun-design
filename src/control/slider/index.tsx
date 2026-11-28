import cx from 'classnames';
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
  useRef,
  useState,
} from 'react';

import { clampRange, nearest, nextPoint, snapPoints } from './snap.js';
import { useStyle } from './style.js';

/** A stop on the track: a tick at `value`, with an optional label under it. */
export type SliderDetent = {
  /** Where the detent sits, between `min` and `max`. Any value: detents need not be evenly spaced. */
  value: number;
  /** Shown under the tick, centred on it (or lined up with the track end at `min` or `max`). */
  label?: ReactNode;
};

/** What a custom `thumb` is drawn for. */
export type SliderThumbState = {
  /** The value the thumb shows: the snapped value under the pointer while dragging. */
  value: number;
  /** A pointer is dragging the thumb. */
  dragging: boolean;
  /** The thumb has keyboard focus. */
  focused: boolean;
  /** The slider is disabled. */
  disabled: boolean;
};

export type SliderProps = {
  /** The value, between `min` and `max`. Controlled: the thumb shows this, so update it from `onChange`. Out-of-range values are clamped; a value that is not a finite number shows as `min`. */
  value: number;
  /** Receives the new snapped value (not an event) each time it changes: during a drag, on a track press, and on each key press. */
  onChange: (value: number) => void;
  /** Receives the final value once an interaction ends: on pointer release, and right after `onChange` for a key press. Save here rather than in `onChange` to avoid a request per pixel. */
  onChangeEnd?: (value: number) => void;
  /** The lowest value. */
  min?: number;
  /** The highest value. A `max` not above `min` is treated as `min + 1`. */
  max?: number;
  /** A number snaps to `min + k·step` (and to every detent). `null` snaps to the detents only, which suits uneven stops such as chapters; with no detents it then snaps to the two ends. */
  step?: number | null;
  /** Stops drawn as ticks, filled up to the value, each with an optional label. A detent at exactly `min` or `max` draws no tick, but its label shows. Labels may overlap when detents crowd; space them yourself. */
  detents?: SliderDetent[];
  /** Under the start of the track ("Not started", "0"). */
  startLabel?: ReactNode;
  /** Under the end of the track ("Completed", "100"). */
  endLabel?: ReactNode;
  /** Draws your own thumb in place of the default circle. The slider keeps the focusable, at least 24px target around it, centred on the value, so the node is only the visible part. */
  thumb?: (state: SliderThumbState) => ReactNode;
  /** Accessible name of the slider: say what it sets ("Reading progress for Middlemarch"). */
  ariaLabel: string;
  /** Turns the value into words for screen readers (`(v) => \`Chapter ${n}\``); without it they hear the number. */
  ariaValueText?: (value: number) => string;
  /** Ignores pointer and keys, leaves the tab order, and greys the default thumb. */
  disabled?: boolean;
  /** Submits the value with a surrounding `<form>`, through a hidden input. Not submitted while `disabled`, like a native field. */
  name?: string;
  /** On the outer element. Override with `'&&'` specificity, never `!important`. */
  className?: string;
  /** The outer element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * A single-value slider: a track with a draggable, keyboard-operable thumb,
 * optional detents at any positions (with labels), start and end labels, and
 * an optional custom thumb.
 */
export const Slider = ({
  value,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  detents = [],
  startLabel,
  endLabel,
  thumb,
  ariaLabel,
  ariaValueText,
  disabled = false,
  name,
  className,
  ref,
}: SliderProps) => {
  const style = useStyle();
  const [focused, setFocused] = useState(false);
  // The pointer's position (0–100) while dragging; null at rest.
  const [dragPct, setDragPct] = useState<number | null>(null);
  const reported = useRef<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [lo, hi] = clampRange(min, max);
  const current = Number.isFinite(value) ? Math.min(hi, Math.max(lo, value)) : lo;
  const points = snapPoints(
    lo,
    hi,
    step,
    detents.map((d) => d.value)
  );
  const pct = (v: number) => ((v - lo) / (hi - lo)) * 100;

  const valueAt = (p: number) => lo + (p / 100) * (hi - lo);
  // Turning disabled mid-drag ends the drag: nothing more is reported, and the
  // next pointer event clears the leftover position.
  const dragging = dragPct !== null && !disabled;
  const snappedDrag = dragging ? nearest(points, valueAt(dragPct)) : current;

  const pctAt = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return 0;
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  };

  const track = (clientX: number) => {
    const p = pctAt(clientX);
    setDragPct(p);
    const snapped = nearest(points, valueAt(p));
    if (snapped !== reported.current) {
      reported.current = snapped;
      onChange(snapped);
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    thumbRef.current?.focus();
    reported.current = current;
    track(e.clientX);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled && dragPct !== null) setDragPct(null);
    if (!dragging) return;
    track(e.clientX);
  };

  const endDrag = (finished: boolean) => {
    const wasDragging = dragging;
    const last = reported.current;
    setDragPct(null);
    if (!wasDragging) return;
    reported.current = null;
    if (finished && last !== null) onChangeEnd?.(last);
  };

  const commit = (next: number) => {
    if (next === current) return;
    onChange(next);
    onChangeEnd?.(next);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const byDetent = step === null;
    const page = (dir: 1 | -1) => {
      const next = nextPoint(points, current, dir);
      if (byDetent) return next;
      // 10% of the range, but never less than one step: with a coarse step
      // the 10% target would snap straight back to the current value.
      const target = nearest(points, Math.min(hi, Math.max(lo, current + dir * (hi - lo) * 0.1)));
      return dir === 1 ? Math.max(target, next) : Math.min(target, next);
    };
    const next: Record<string, () => number> = {
      ArrowRight: () => nextPoint(points, current, 1),
      ArrowUp: () => nextPoint(points, current, 1),
      ArrowLeft: () => nextPoint(points, current, -1),
      ArrowDown: () => nextPoint(points, current, -1),
      PageUp: () => page(1),
      PageDown: () => page(-1),
      Home: () => points[0]!,
      End: () => points[points.length - 1]!,
    };
    const move = next[e.key];
    if (!move) return;
    e.preventDefault();
    commit(move());
  };

  const state: SliderThumbState = { value: snappedDrag, dragging, focused, disabled };
  const shownPct = dragging ? dragPct : pct(current);
  const ticks = detents.filter((d) => d.value > lo && d.value < hi);
  const labelled = detents.filter((d) => d.label !== undefined && d.value >= lo && d.value <= hi);

  return (
    <div
      ref={ref}
      className={cx(style.root, disabled && style.disabled, dragging && style.dragging, className)}
      data-testid="slider"
    >
      <div
        ref={railRef}
        className={style.rail}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => endDrag(true)}
        onPointerCancel={() => endDrag(false)}
        data-testid="slider-rail"
      >
        <div className={style.track} />
        <div className={style.fill} style={{ width: `${shownPct}%` }} />
        {ticks.map((d, i) => (
          <div
            // By position in the list: detents may share a value.
            key={i}
            className={style.tick}
            style={{ left: `${pct(d.value)}%` }}
            data-active={d.value <= snappedDrag ? '' : undefined}
            data-testid="slider-tick"
          />
        ))}
        <div
          ref={thumbRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-valuemin={lo}
          aria-valuemax={hi}
          aria-valuenow={current}
          aria-valuetext={ariaValueText?.(current)}
          aria-orientation="horizontal"
          aria-disabled={disabled || undefined}
          className={style.thumb}
          style={{ left: `${shownPct}%` }}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          data-testid="slider-thumb"
        >
          {thumb ? thumb(state) : <span className={style.knob} data-testid="slider-knob" />}
        </div>
      </div>
      {(startLabel !== undefined || endLabel !== undefined || labelled.length > 0) && (
        <div className={style.labels}>
          <span>{startLabel}</span>
          {labelled.map((d, i) => (
            <span
              key={i}
              className={cx(
                style.detentLabel,
                d.value === lo && style.atStart,
                d.value === hi && style.atEnd
              )}
              style={{ left: `${pct(d.value)}%` }}
            >
              {d.label}
            </span>
          ))}
          <span>{endLabel}</span>
        </div>
      )}
      {name !== undefined && (
        <input type="hidden" name={name} value={current} disabled={disabled} />
      )}
    </div>
  );
};
