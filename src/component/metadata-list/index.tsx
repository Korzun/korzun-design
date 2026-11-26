import { Metadata as MetadataComponent } from '../metadata/index.js';
import { useStyle } from './style.js';

/** One labelled value in a `MetadataList`. */
export type Metadata = {
  /** The label, shown faint and capitalized by CSS: `'cover fit'` displays as “Cover Fit”. It is part of the React key, so keep it unique within a list. */
  title: string;
  /** The value. It is cut off with an ellipsis at `theme.size.metadataValue` (`15rem`) and never wraps, with no tooltip. With an element as value the key becomes `Title[object Object]`, so entries that share a title and hold elements collide. */
  value: string | React.ReactNode;
};
export type MetadataListProps = {
  /** The pairs, in order. Every entry renders, even one whose value is `null` or `undefined` (its title shows with an empty value), so filter the array first. */
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
