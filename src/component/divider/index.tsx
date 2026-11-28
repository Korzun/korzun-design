import cx from 'classnames';
import { createContext, useContext, type PropsWithChildren, type ReactNode } from 'react';

import { useSurfaceDepth } from '../surface/index.js';
import { useStyle } from './style.js';

/** Where a divider's label or actions sit on the line. */
export type DividerAlign = 'left' | 'center' | 'right';

export type DividerProps = {
  /** Optional label, one word or two: it does not wrap. Without a label and without actions the divider is a plain full-width line. `null`, `undefined` and `false` count as absent. */
  children?: ReactNode;
  /** Where the label sits. `'left'` and `'right'` hug that edge with a short stub of line poking past; `'center'` leaves equal line on both sides. */
  align?: DividerAlign;
  /** Optional controls rendered on the line (e.g. a bulk-action button); keep them one text line tall. `null`, `undefined` and `false` count as absent. */
  actions?: ReactNode;
  /** Where the actions sit. When it equals `align`, label and actions share one group, label first. */
  actionsAlign?: DividerAlign;
  /** Reach the edges of the Card or Dialog body the divider sits in, cancelling the body's padding. Defaults to `true` directly inside a Card or Dialog body and `false` anywhere else, where the line spans its container. `true` does nothing outside a Card or Dialog. */
  bleed?: boolean;
};

/** The padding a body puts around its content, and the surface depth inside it. */
type Body = { padding: string; depth: number | undefined };

const BodyContext = createContext<Body | null>(null);

/**
 * Internal. Marks a padded body (Card, Dialog) so a Divider directly inside it
 * cancels `padding` and meets the box's edges. It applies only at `depth`, the
 * depth inside that body: a CardRow, Alert, Surface or nested Card in between
 * changes the depth, so a divider in there spans its own box instead.
 */
export const DividerBodyProvider = ({ padding, depth, children }: PropsWithChildren<Body>) => (
  <BodyContext.Provider value={{ padding, depth }}>{children}</BodyContext.Provider>
);

const isPresent = (node: ReactNode): boolean =>
  node !== undefined && node !== null && node !== false;

/**
 * A horizontal rule splitting content into sections, optionally labelled. Directly inside a Card
 * or Dialog body it reaches the box's edges.
 */
export const Divider = ({
  children,
  align = 'left',
  actions,
  actionsAlign = 'right',
  bleed,
}: DividerProps) => {
  const body = useContext(BodyContext);
  const depth = useSurfaceDepth();
  const inBody = body !== null && body.depth === depth;
  const style = useStyle({
    bleed: body && (bleed ?? inBody) ? body.padding : null,
  });

  const hasLabel = isPresent(children);
  const hasActions = isPresent(actions);

  if (!hasLabel && !hasActions) {
    return (
      <div className={style.root} role="separator">
        <span className={style.line} />
      </div>
    );
  }

  // Bucket the label and actions into positions; within a bucket the label renders first.
  const groups: Record<DividerAlign, ReactNode[]> = {
    left: [],
    center: [],
    right: [],
  };
  if (hasLabel) {
    groups[align].push(
      <span key="label" className={style.label}>
        {children}
      </span>
    );
  }
  if (hasActions) {
    groups[actionsAlign].push(
      <span key="actions" className={style.actions}>
        {actions}
      </span>
    );
  }

  const slot = (pos: DividerAlign) =>
    groups[pos].length > 0 ? <span className={style.group}>{groups[pos]}</span> : null;

  return (
    <div className={style.root} role="separator">
      <span className={cx(style.line, groups.left.length > 0 && style.stub)} />
      {slot('left')}
      <span className={style.line} />
      {slot('center')}
      <span className={style.line} />
      {slot('right')}
      <span className={cx(style.line, groups.right.length > 0 && style.stub)} />
    </div>
  );
};
