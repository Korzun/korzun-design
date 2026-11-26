/** Loading and disabled
 * `loading` swaps the icons for a spinner and blocks clicks; `disabled` greys the
 * button out. Both take the button out of the tab order.
 */
import { Inline } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function LoadingAndDisabled() {
  const [uploading, setUploading] = useState(false);
  return (
    <Inline wrap>
      <Button
        type="primary"
        prefix={UploadIcon}
        loading={uploading}
        onClick={() => setUploading(true)}
      >
        {uploading ? 'Uploading' : 'Upload'}
      </Button>
      <Button type="text" disabled={!uploading} onClick={() => setUploading(false)}>
        Cancel upload
      </Button>
      <Button disabled>Disabled</Button>
    </Inline>
  );
}
