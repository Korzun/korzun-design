/** Loading
 * `loading` swaps the icons for a spinner, softens the colour and blocks clicks;
 * the button leaves the tab order until it finishes. Every type has a loading
 * look, `danger` included. Press Upload to watch one go through it.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { UploadIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Loading() {
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState(0);
  const upload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploads((n) => n + 1);
    }, 1500);
  };
  return (
    <Space direction="vertical" align="start">
      <Space wrap>
        <Button type="primary" loading>
          Primary
        </Button>
        <Button loading>Default</Button>
        <Button type="dashed" loading>
          Dashed
        </Button>
        <Button type="text" loading>
          Text
        </Button>
        <Button type="link" loading>
          Link
        </Button>
      </Space>
      <Space wrap>
        <Button danger loading>
          Danger
        </Button>
        <Button type="primary" danger loading>
          Primary danger
        </Button>
      </Space>
      <Space wrap>
        <Button type="primary" prefix={UploadIcon} loading={uploading} onClick={upload}>
          {uploading ? 'Uploading' : 'Upload'}
        </Button>
        <Text tone="muted">Uploaded {uploads} times</Text>
      </Space>
    </Space>
  );
}
