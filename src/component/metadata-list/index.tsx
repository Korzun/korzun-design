import { Metadata as MetadataComponent } from '../metadata/index.js';
import { useStyle } from './style.js';

/** One labelled value in a `MetadataList`. */
export type Metadata = {
  /** Label, shown faint and CSS-capitalized. Keep it unique within a list (it is part of the key). */
  title: string;
  /** The value. Truncated with an ellipsis at `theme.size.metadataValue`; never wraps. */
  value: string | React.ReactNode;
};
export type MetadataListProps = {
  /** The pairs, in order. Every entry renders, even with an empty value: filter first. */
  metadata: Metadata[];
};

/** A wrapping row of small labelled values, typically a `Card` body describing one record. */
export const MetadataList = ({ metadata }: MetadataListProps) => {
  const styles = useStyle();
  const metadataElements = metadata.map(({ title, value }) => (
    <MetadataComponent key={title + value} title={title}>
      {value}
    </MetadataComponent>
  ));

  return <div className={styles.root}>{metadataElements}</div>;
};
