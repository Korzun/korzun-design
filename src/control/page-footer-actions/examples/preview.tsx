/** Preview */
import { PageFooterActions } from '@korzun/design/control';

export default function Preview() {
  return (
    <PageFooterActions
      items={[
        { label: 'Cancel', onClick: () => {} },
        { label: 'Save', onClick: () => {}, emphasis: true },
      ]}
    />
  );
}
