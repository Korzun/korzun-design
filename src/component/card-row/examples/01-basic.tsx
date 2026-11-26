/** Basic
 * A stack of compact rows on the page. With `onClick` a row gets a pointer cursor and fires on
 * click; a row without it is plain content.
 */
import { CardRow, Stack, Text } from '@korzun/design/component';
import { useState } from 'react';

const uploads = ['middlemarch.epub', 'persuasion.epub', 'villette.epub'];

export default function Basic() {
  const [opened, setOpened] = useState<string | undefined>();
  return (
    <Stack>
      {uploads.map((fileName) => (
        <CardRow key={fileName} onClick={() => setOpened(fileName)}>
          {fileName}
        </CardRow>
      ))}
      <CardRow>Not clickable</CardRow>
      <Text tone="muted">Opened: {opened ?? 'nothing yet'}</Text>
    </Stack>
  );
}
