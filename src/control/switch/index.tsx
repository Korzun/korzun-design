import cx from 'classnames';
import { ReactNode, useCallback, useEffect, useId, useState } from 'react';

import { useDepthClassKey } from '../../component/surface/index.js';
import { SpinnerIcon } from '../../icon/index.js';
import { SwitchRadius, SwitchRadiusValue, useStyle } from './style.js';

/**
 * How long a save may run before the switch admits to it.
 *
 * Every mutation behind a switch in this app is local — a preference row, a
 * push subscription — and normally settles in well under this. Showing the
 * spinner the instant a click fires would therefore flash it for two or three
 * frames on nearly every interaction, which reads as a glitch rather than as
 * feedback. Waiting means the common path shows nothing at all, and only a
 * genuinely slow save (a busy server, a dropped connection) ever draws one.
 */
const SPINNER_DELAY_MS = 150;

/**
 * True once `active` has been continuously true for `delayMs`, false the
 * moment it clears.
 *
 * The delay is PURELY VISUAL. Both the click guard and `aria-busy` below read
 * the undelayed prop instead, because suppressing the spinner for 150ms must
 * not also open a 150ms window in which a second click fires a second
 * mutation, nor hide the state from a screen reader that has no flicker to be
 * spared.
 */
function useDelayedFlag(active: boolean, delayMs: number): boolean {
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    if (!active) {
      setElapsed(false);
      return;
    }
    const timer = setTimeout(() => setElapsed(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);
  return elapsed;
}

export type { SwitchRadiusValue };

export type SwitchProps = {
  /**
   * Accessible name for a switch with no visible `label`, because something
   * outside it already carries the name (a grid's row and column headers). It
   * wins over `label`. Without either, `name` is announced.
   */
  ariaLabel?: string;
  /** Controlled on/off state. */
  checked: boolean;
  /** Helper text under the label, linked by `aria-describedby`. */
  description?: ReactNode;
  /** Fades the switch to 40% and removes it from the tab order. */
  disabled?: boolean;
  /** Visible label and accessible name (`ariaLabel` wins over it). */
  label?: string;
  /**
   * `'default'`: track then label, inline. `'horizontal'`: a full-width shaded
   * row (`bg.cardHeader`, corners by surface depth) with label and description on the left and
   * the track on the right; the whole row toggles, description included.
   */
  layout?: 'default' | 'horizontal';
  /**
   * A save driven by this switch is in flight. Clicks are ignored at once and
   * `aria-busy` is set; the thumb becomes a spinner only after 150ms, so fast
   * saves do not flash. The switch keeps its colour and shows the position it
   * is saving.
   */
  loading?: boolean;
  /** Not a form field (no hidden input); only the last-resort accessible name. */
  name: string;
  /** Receives the new value, not an event. Not called while `disabled` or `loading`. */
  onChange: (checked: boolean) => void;
  /**
   * The corner shape of the track. Leave it for a switch in a shaded row
   * (`layout="horizontal"` or a field row), where the track is concentric with
   * the row; `'pill'` suits a Card header or any spot with no nearby corner.
   * See [Choosing a radius](#choosing-a-radius).
   *
   * @default 'inset'
   */
  radius?: SwitchRadiusValue;
};

/**
 * Controlled on/off toggle with an optional label and description. Enter and
 * Space toggle; clicks don't propagate to a clickable parent row.
 */
export const Switch = ({
  ariaLabel,
  checked,
  description,
  disabled = false,
  label,
  layout = 'default',
  loading = false,
  name,
  onChange,
  radius = SwitchRadius.Inset as SwitchRadiusValue,
}: SwitchProps) => {
  const style = useStyle();
  const depthKey = useDepthClassKey();
  const showSpinner = useDelayedFlag(loading, SPINNER_DELAY_MS);
  // Per-instance id so the description's aria target stays unique even when two
  // switches sharing a `name` mount at once (e.g. the device create + edit forms).
  const generatedId = useId();
  const descriptionId = description ? generatedId : undefined;

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!disabled && !loading) onChange(!checked);
    },
    [checked, disabled, loading, onChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        if (!disabled && !loading) onChange(!checked);
      }
    },
    [checked, disabled, loading, onChange]
  );

  // The description is helper text, not a toggle target — clicking it should
  // not flip the switch.
  const handleDescriptionClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  // The radius class lands on the track rather than the root because it styles
  // the track and its thumb, and the track is the one element both layouts
  // below render identically.
  const track = (
    <div
      className={cx(style.track, style[radius], {
        [style.checked]: checked,
        [style.disabled]: disabled,
        [style.loading]: showSpinner,
      })}
    >
      {showSpinner && radius === SwitchRadius.Inset ? (
        // A squared switch gets a squared ring: the round spinner clashed with
        // its corners. `aria-hidden` because `aria-busy` on the switch itself
        // already carries this to assistive tech, and from the undelayed prop.
        <div aria-hidden className={cx(style.thumb, style.ring)} data-testid="switch-ring" />
      ) : showSpinner ? (
        <SpinnerIcon aria-hidden={true} className={style.spinner} />
      ) : (
        <div className={style.thumb} />
      )}
    </div>
  );

  const descriptionEl = description ? (
    <div
      id={descriptionId}
      className={style.description}
      // In the horizontal layout the whole shaded row is a toggle target, so let
      // description clicks bubble up. Elsewhere the description stays inert helper text.
      onClick={layout === 'horizontal' ? undefined : handleDescriptionClick}
    >
      {description}
    </div>
  ) : null;

  const commonProps = {
    role: 'switch' as const,
    'aria-checked': checked,
    'aria-label': ariaLabel ?? label ?? name,
    'aria-describedby': descriptionId,
    'aria-disabled': disabled,
    'aria-busy': loading,
    tabIndex: disabled ? -1 : 0,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  // Horizontal keeps the toggle in its own right-hand column so the description,
  // stacked under the label in the content column, never runs beneath it.
  if (layout === 'horizontal') {
    return (
      <div
        {...commonProps}
        className={cx(style.root, style.horizontal, depthKey && style[depthKey])}
      >
        <div className={style.content}>
          {label && <span className={style.label}>{label}</span>}
          {descriptionEl}
        </div>
        {track}
      </div>
    );
  }

  return (
    <div {...commonProps} className={style.root}>
      <div className={style.row}>
        {track}
        {label && <span className={style.label}>{label}</span>}
      </div>
      {descriptionEl}
    </div>
  );
};
