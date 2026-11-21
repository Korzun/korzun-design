import { PropsWithChildren } from 'react';

import { useStyle } from './style.js';

export type MetadataProps = PropsWithChildren<{
  /** Label, shown faint and CSS-capitalized. */
  title: string;
}>;

/** One title/value pair: the building block of `MetadataList`. */
export const Metadata = ({ children, title }: MetadataProps) => {
  const styles = useStyle();

  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{children}</div>
    </div>
  );
};
