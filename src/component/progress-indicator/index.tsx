import { useStyle } from './style.js';

export type ProgressIndicatorProps = {
  /** A **fraction from 0 to 1**, not a percentage (`0.42` shows "42%"). Clamped to 0–1, so `42` shows "Completed". */
  value: number;
  /** Accessible name of the progressbar: say what progress it is (`Reading progress for ${title}`), because a bare "42%" means nothing out of context. Not used at exactly 0 or 1, where no progressbar renders. */
  ariaLabel: string;
  /** Width and height of the SVG in px. The label's font size is fixed (`fontSize.sm`) and does not scale. */
  size?: number;
};

const CX = 50;
const CY = 50;
const R_INNER = 36; // track and sector
const R_RING = 44; // outer ring (gap between inner edge and R_INNER is ~5 units)

const sectorPath = (pct: number): string => {
  const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
  const x = CX + R_INNER * Math.cos(angle);
  const y = CY + R_INNER * Math.sin(angle);
  const largeArc = pct > 50 ? 1 : 0;
  return `M ${CX} ${CY} L ${CX} ${CY - R_INNER} A ${R_INNER} ${R_INNER} 0 ${largeArc} 1 ${x} ${y} Z`;
};

/** A small pie-style progress mark plus a "Not started" / "N%" / "Completed" label. */
export const ProgressIndicator = ({ value, ariaLabel, size = 40 }: ProgressIndicatorProps) => {
  const style = useStyle();
  const clamped = Math.min(100, Math.max(0, value * 100));

  return (
    <div className={style.root}>
      {clamped > 0 && clamped < 100 && (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          role="progressbar"
          aria-label={ariaLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(clamped)}
        >
          <circle cx={CX} cy={CY} r={R_INNER} className={style.track} />
          <path d={sectorPath(clamped)} className={style.sector} />
          <circle cx={CX} cy={CY} r={R_RING} className={style.ring} />
        </svg>
      )}
      <span className={style.label}>
        {clamped === 0 ? 'Not started' : clamped === 100 ? 'Completed' : `${Math.round(clamped)}%`}
      </span>
    </div>
  );
};
