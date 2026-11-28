import { createContext, useContext, type PropsWithChildren, type ReactNode } from 'react';

import { useTheme } from '../../theme/index.js';
import type { Theme } from '../../theme/theme.js';

const SurfaceDepthContext = createContext<number | undefined>(undefined);

/** The surface depth above this point: 0 on the page, 1 in a Card or Dialog, and so on. `undefined` with no Page, Dialog, Card, CardRow, Alert or Surface above it. */
export const useSurfaceDepth = (): number | undefined => useContext(SurfaceDepthContext);

/** Internal. Marks everything inside as sitting at `depth`. */
export const SurfaceDepthProvider = ({ depth, children }: PropsWithChildren<{ depth: number }>) => (
  <SurfaceDepthContext.Provider value={depth}>{children}</SurfaceDepthContext.Provider>
);

/** The corner radius for a depth: 0 is `lg`, 1 is `md`, 2 and deeper are `sm`. */
export const radiusForDepth = (radius: Theme['radius'], depth: number): string =>
  depth <= 0 ? radius.lg : depth === 1 ? radius.md : radius.sm;

/** Clamps a depth to the 0, 1, 2 range used to look up style classes. */
export const depthClass = (depth: number): 0 | 1 | 2 => Math.min(depth, 2) as 0 | 1 | 2;

/**
 * Internal. The style class key for the current depth (`depth0`, `depth1`,
 * `depth2`), or `undefined` with no surface above, where a component keeps its
 * own default corners.
 */
export const useDepthClassKey = (): 'depth0' | 'depth1' | 'depth2' | undefined => {
  const depth = useSurfaceDepth();
  return depth === undefined ? undefined : `depth${depthClass(depth)}`;
};

export interface SurfaceProps {
  /** The hand-made box's contents, not the box itself. They sit one level deeper than the surface around it, so a Button or Select inside takes the next corner radius down. */
  children?: ReactNode;
}

/**
 * A hand-made box that holds library controls: everything inside sits one
 * level deeper than the surface around it.
 */
export const Surface = ({ children }: SurfaceProps) => {
  const depth = useSurfaceDepth() ?? 0;
  return <SurfaceDepthProvider depth={depth + 1}>{children}</SurfaceDepthProvider>;
};

/** The corner radius that matches the current depth, for a box at the current depth. Call it from the component that draws the box, outside that box's own `Surface`. */
export const useSurfaceRadius = (): string => {
  const theme = useTheme();
  return radiusForDepth(theme.radius, useSurfaceDepth() ?? 0);
};
