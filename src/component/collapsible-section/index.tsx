import { ReactNode, useCallback, useState } from 'react';

import { useStyle } from './style.js';

export type CollapsibleSectionProps = {
  /** Rendered at the header's right end. An array of keyed elements; one that does not stop click propagation (anything but a library `Button`) also toggles the section. */
  actions?: ReactNode[];
  /** Shown only while open; unmounted when closed. */
  children?: ReactNode;
  /** Controlled open state. Omit for uncontrolled, which starts closed (there is no `defaultOpen`). */
  open?: boolean;
  /** Faint text after the title, e.g. a count ("3 items"). */
  subTitle?: string;
  /** Header label, rendered uppercase via CSS. */
  title: string;
  /** Called on every header click/Enter/Space. Receives no value: flip your own state. */
  onOpenToggle?: () => void;
};

/** A disclosure section with no card chrome. Children are unmounted while closed. */
export function CollapsibleSection({
  children,
  title,
  subTitle,
  actions = [],
  open: externalOpen,
  onOpenToggle = () => {},
}: CollapsibleSectionProps) {
  const styles = useStyle();

  const [localOpen, setLocalOpen] = useState(false);
  const open = externalOpen ?? localOpen;
  const handleOpenToggle = useCallback(() => {
    setLocalOpen((prev) => !prev);
    onOpenToggle();
  }, [onOpenToggle]);

  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleOpenToggle();
      }
    },
    [handleOpenToggle]
  );

  return (
    <div className={styles.root}>
      <div
        className={styles.header}
        role="button"
        tabIndex={0}
        onClick={handleOpenToggle}
        onKeyDown={handleOnKeyDown}
      >
        <span className={styles.chevron}>{open ? '▼' : '▶'}</span>
        <span className={styles.label}>{title}</span>
        {subTitle && <span className={styles.count}>{subTitle}</span>}
        <span className={styles.spacer} />
        {actions}
      </div>
      {open && children}
    </div>
  );
}
