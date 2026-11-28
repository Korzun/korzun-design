/** Preview */
import { CardRow, Space, Text } from '@korzun/design/component';

const uploads = ['middlemarch.epub', 'persuasion.epub', 'villette.epub'];

export default function Preview() {
  return (
    <div style={{ width: 240 }}>
      <Space direction="vertical">
        {uploads.map((fileName) => (
          <CardRow key={fileName}>
            <Text>{fileName}</Text>
          </CardRow>
        ))}
      </Space>
    </div>
  );
}
