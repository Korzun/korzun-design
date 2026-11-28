import cx from 'classnames';

import { type ProgressCircleTone, useStyle } from './style.js';

export type { ProgressCircleTone };

export type ProgressCircleProps = {
  /** Progress from 0 to `max`. Clamped to that range; a value that is not a finite number (`NaN`, `undefined`, `Infinity`) counts as 0. */
  value: number;
  /** The value that means done. The default, 1, takes a fraction (`0.42`); pass `100` for a percentage or `12` for 12 chapters. */
  max?: number;
  /** Accessible name of the progressbar: say what progress it is (`Reading progress for ${title}`), because a bare "42%" means nothing out of context. */
  ariaLabel: string;
  /** How the value is written. `'%'` (the default) shows the percentage of `max`, rounded to a whole number. Anything else shows the value itself followed by `unit`, verbatim: `unit=" of 12"` shows "3 of 12", `unit=""` the bare number. Screen readers hear the same text. */
  unit?: string;
  /** Where the value is written: `'outside'` beside the circle, `'inside'` centred in it (suits `variant="outline"`, and sizes of 40 or more), or `'none'` (screen readers still hear it). The text is never "Not started" or "Completed"; see the Reading progress recipe for those. */
  label?: 'outside' | 'inside' | 'none';
  /** `'filled'` is a pie: a sector inside a thin ring. `'outline'` is border-only: an arc over a faint track, with the middle empty. */
  variant?: 'filled' | 'outline';
  /** Colour of the progress: `'brand'` (default), a status colour (`'success'`, `'warning'`, `'danger'`, `'info'`) or `'neutral'` grey. */
  tone?: ProgressCircleTone;
  /** Width and height of the circle in px. An outside label keeps its `fontSize.sm`; an inside one scales with the circle. */
  size?: number;
};

const C = 50;
const R_SECTOR = 36; // filled: the sector
const R_RING = 44; // filled: the ring around it; outline: the track and arc

const sectorPath = (fraction: number): string => {
  const angle = fraction * 2 * Math.PI - Math.PI / 2;
  const x = C + R_SECTOR * Math.cos(angle);
  const y = C + R_SECTOR * Math.sin(angle);
  const largeArc = fraction > 0.5 ? 1 : 0;
  return `M ${C} ${C} L ${C} ${C - R_SECTOR} A ${R_SECTOR} ${R_SECTOR} 0 ${largeArc} 1 ${x} ${y} Z`;
};

/** One decimal at most, so 2.5 chapters shows "2.5" and 3 shows "3". */
const formatValue = (n: number) => String(Math.round(n * 10) / 10);

/**
 * A progress circle: a pie (`filled`) or an arc (`outline`) in a tone, with
 * the value written beside it, inside it, or not at all.
 */
export const ProgressCircle = ({
  value,
  max = 1,
  ariaLabel,
  unit = '%',
  label = 'outside',
  variant = 'filled',
  tone = 'brand',
  size = 40,
}: ProgressCircleProps) => {
  const style = useStyle();
  const top = Number.isFinite(max) && max > 0 ? max : 1;
  const clamped = Number.isFinite(value) ? Math.min(top, Math.max(0, value)) : 0;
  const fraction = clamped / top;
  const text = unit === '%' ? `${Math.round(fraction * 100)}%` : `${formatValue(clamped)}${unit}`;
  // A long inside label (custom units) is squeezed to fit the circle.
  const squeeze = text.length > 4;

  return (
    <div
      className={cx(style.root, style[`tone-${tone}`])}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={top}
      aria-valuenow={clamped}
      aria-valuetext={text}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className={style.svg} aria-hidden>
        {variant === 'filled' ? (
          <>
            {fraction >= 1 ? (
              <circle
                cx={C}
                cy={C}
                r={R_SECTOR}
                className={style.sector}
                data-testid="progress-sector"
              />
            ) : (
              fraction > 0 && (
                <path
                  d={sectorPath(fraction)}
                  className={style.sector}
                  data-testid="progress-sector"
                />
              )
            )}
            <circle cx={C} cy={C} r={R_RING} className={style.ring} />
          </>
        ) : (
          <>
            <circle cx={C} cy={C} r={R_RING} className={style.track} />
            {fraction > 0 && (
              <circle
                cx={C}
                cy={C}
                r={R_RING}
                className={style.arc}
                pathLength={100}
                strokeDasharray={`${fraction * 100} 100`}
                transform={`rotate(-90 ${C} ${C})`}
                data-testid="progress-arc"
              />
            )}
          </>
        )}
        {label === 'inside' && (
          <text
            x={C}
            y={C}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={26}
            textLength={squeeze ? 64 : undefined}
            lengthAdjust={squeeze ? 'spacingAndGlyphs' : undefined}
            className={cx(style.inside, variant === 'filled' && style.halo)}
          >
            {text}
          </text>
        )}
      </svg>
      {label === 'outside' && (
        <span className={style.label} aria-hidden>
          {text}
        </span>
      )}
    </div>
  );
};
