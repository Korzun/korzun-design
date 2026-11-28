/** Preview */
import { Button, Menu, type MenuTriggerProps } from '@korzun/design/control';
import { createUseStyles } from '@korzun/design/theme';
import { useEffect, useRef } from 'react';

// Tall enough for the open list, so the centred thumbnail keeps it in frame.
const useStyle = createUseStyles({ box: { height: 170 } });

// Opens the menu once on mount (the ref survives Strict Mode's second effect run).
function OpenTrigger(props: MenuTriggerProps) {
  const { onClick } = props;
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    onClick();
    // Opening focuses the first item; drop that ring, the thumbnail is not interactive.
    requestAnimationFrame(() => (document.activeElement as HTMLElement | null)?.blur());
  }, [onClick]);
  return <Button {...props}>Sort by</Button>;
}

export default function Preview() {
  const styles = useStyle();
  return (
    <div className={styles.box}>
      <Menu
        trigger={(p) => <OpenTrigger {...p} />}
        items={[
          { label: 'Title', onClick: () => {} },
          { label: 'Author', onClick: () => {} },
          { label: 'Date added', onClick: () => {} },
        ]}
      />
    </div>
  );
}
