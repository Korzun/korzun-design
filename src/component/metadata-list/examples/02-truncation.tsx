/** Long values
 * A value wider than its cap is cut off with an ellipsis and never wraps, so keep values short. Titles are capitalized by CSS: “cover fit” displays as “Cover Fit”.
 */
import { MetadataList } from '@korzun/design/component';

export default function Truncation() {
  return (
    <MetadataList
      metadata={[
        { title: 'cover fit', value: 'Contain' },
        { title: 'Path', value: '/library/science-fiction/frank-herbert/children-of-dune.epub' },
      ]}
    />
  );
}
