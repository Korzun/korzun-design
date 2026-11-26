/** Preview */
import { CardRow, Stack, Text } from '@korzun/design/component';

const uploads = ['middlemarch.epub', 'persuasion.epub', 'villette.epub'];

export default function Preview() {
  return (
    <div style={{ width: 240 }}>
      <Stack>
        {uploads.map((fileName) => (
          <CardRow key={fileName}>
            <Text>{fileName}</Text>
          </CardRow>
        ))}
      </Stack>
    </div>
  );
}
