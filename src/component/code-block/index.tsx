import cx from 'classnames';
import { useRef, type ReactNode } from 'react';

import { depthClass, SurfaceDepthProvider, useSurfaceDepth } from '../surface/index.js';
import { CopyCodeButton } from './copy.js';
import { useScrollHint } from './scroll-hint.js';
import { useStyle } from './style.js';

export type CodeBlockProps = {
  /** The code as plain text. It is what Copy puts on the clipboard, and what shows when there are no `children`. */
  code: string;
  /** What to show in place of `code`, such as syntax-highlighted spans. Copy still copies `code`. */
  children?: ReactNode;
  /** Adds a Copy button beside the code. */
  copyable?: boolean;
  /** The Copy button's accessible name; it reads "Copy". */
  copyLabel?: string;
  /** Wraps long lines instead of scrolling them sideways. */
  wrap?: boolean;
  /** Extra class on the root, merged after the component's own. */
  className?: string;
};

/**
 * A block of code in mono type on a tinted box: it scrolls sideways (or wraps),
 * can show highlighted children, and can offer a Copy button.
 */
export const CodeBlock = ({
  code,
  children,
  copyable = false,
  copyLabel = 'Copy code',
  wrap = false,
  className,
}: CodeBlockProps) => {
  const styles = useStyle();
  const depth = useSurfaceDepth() ?? 0;
  const preRef = useRef<HTMLPreElement>(null);
  useScrollHint(preRef, children ?? code);
  return (
    <div
      className={cx(
        styles.root,
        styles[`depth${depthClass(depth)}`],
        depth === 0 && styles.pageEdge,
        className
      )}
    >
      <pre ref={preRef} className={cx(styles.pre, wrap && styles.wrap)}>
        {children ?? code}
      </pre>
      {copyable && (
        <div className={styles.action}>
          <SurfaceDepthProvider depth={depth + 1}>
            <CopyCodeButton text={code} label={copyLabel} />
          </SurfaceDepthProvider>
        </div>
      )}
    </div>
  );
};
