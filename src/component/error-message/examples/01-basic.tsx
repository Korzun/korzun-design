/** Basic
 * Keep it mounted and pass the error as `children`: it is announced when text
 * appears and renders nothing when `children` is `undefined`.
 */
import { ErrorMessage, Space } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [error, setError] = useState<string | undefined>('Could not save the book.');
  return (
    <Space direction="vertical" gap="sm">
      <Space>
        <Button onClick={() => setError('Could not save the book.')}>Show error</Button>
        <Button onClick={() => setError(undefined)}>Clear error</Button>
      </Space>
      <ErrorMessage>{error}</ErrorMessage>
    </Space>
  );
}
