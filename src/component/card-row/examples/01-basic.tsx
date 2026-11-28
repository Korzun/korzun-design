/** Basic
 * A stack of compact rows on the page. With `onClick` a row gets a pointer cursor and fires on
 * click, but it cannot be focused, so each row also holds a link `Button` with an `ariaLabel`:
 * the keyboard-reachable way to the same action. A row without `onClick` is plain content.
 */
import { CardRow, Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { useState } from 'react';

const uploads = ['middlemarch.epub', 'persuasion.epub', 'villette.epub'];

export default function Basic() {
  const [opened, setOpened] = useState<string | undefined>();
  return (
    <Space direction="vertical">
      {uploads.map((fileName) => (
        <CardRow key={fileName} onClick={() => setOpened(fileName)}>
          <Space justify="between">
            <Text>{fileName}</Text>
            <Button type="link" ariaLabel={`Open ${fileName}`} onClick={() => setOpened(fileName)}>
              Open
            </Button>
          </Space>
        </CardRow>
      ))}
      <CardRow>
        <Text>Not clickable</Text>
      </CardRow>
      <Text tone="muted">Opened: {opened ?? 'nothing yet'}</Text>
    </Space>
  );
}
