/** Preview
 * @viewport desktop
 */
import { PageActionsBar } from '@korzun/design/control';

export default function Preview() {
  return (
    <PageActionsBar
      items={[
        { label: 'Read', onClick: () => {}, primary: true, align: 'leading' },
        { label: 'Edit', onClick: () => {}, primary: true },
        { label: 'Download', onClick: () => {} },
        { label: 'Delete', onClick: () => {}, danger: true, separatorBefore: true },
      ]}
    />
  );
}
