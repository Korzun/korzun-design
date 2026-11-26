/** Basic
 * Keep it mounted and pass the error as `children`: it is announced when text
 * appears and renders nothing when `children` is `undefined`.
 */
import { ErrorMessage, Inline, Stack } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [error, setError] = useState<string | undefined>('Could not save the book.');
  return (
    <Stack gap="sm">
      <Inline>
        <Button onClick={() => setError('Could not save the book.')}>Show error</Button>
        <Button onClick={() => setError(undefined)}>Clear error</Button>
      </Inline>
      <ErrorMessage>{error}</ErrorMessage>
    </Stack>
  );
}
