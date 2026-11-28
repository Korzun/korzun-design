/** Preview
 * @viewport mobile
 */
import { PageActionsMenu } from '@korzun/design/control';
import { createUseStyles } from '@korzun/design/theme';
import { useEffect, useRef } from 'react';

// Tall enough for the open list, so the centred thumbnail keeps it in frame.
const useStyle = createUseStyles({ box: { height: 190 } });

export default function Preview() {
  const styles = useStyle();
  const box = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  // Opens the menu once on mount (the ref survives Strict Mode's second effect run).
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    box.current?.querySelector('button')?.click();
    // Opening focuses the first item; drop that ring, the thumbnail is not interactive.
    requestAnimationFrame(() => (document.activeElement as HTMLElement | null)?.blur());
  }, []);
  return (
    <div ref={box} className={styles.box}>
      <PageActionsMenu
        items={[
          { label: 'Edit', onClick: () => {} },
          { label: 'Download', onClick: () => {} },
          { label: 'Share', onClick: () => {} },
        ]}
      />
    </div>
  );
}
