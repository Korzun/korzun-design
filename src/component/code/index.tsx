import cx from 'classnames';
import type { ReactNode } from 'react';

import { useSurfaceDepth } from '../surface/index.js';
import { useStyle } from './style.js';

export type CodeProps = {
  /** The code to show, a name or a short expression. It stays on the text's line and breaks only when it cannot fit. */
  children?: ReactNode;
  /** Extra class on the `<code>` element, merged after the component's own. */
  className?: string;
};

/**
 * Inline code: a short name or expression in mono type, sized to the text
 * around it, on a tinted chip.
 */
export const Code = ({ children, className }: CodeProps) => {
  const styles = useStyle();
  const onPage = (useSurfaceDepth() ?? 0) === 0;
  return <code className={cx(styles.root, onPage && styles.pageEdge, className)}>{children}</code>;
};
