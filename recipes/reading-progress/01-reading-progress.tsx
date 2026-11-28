/**
 * Reading progress
 *
 * A list of books, each with its progress: "Not started" before the first page, "Completed" after the last, and a ProgressCircle in between.
 */
import { Card, ProgressCircle, Space, Text } from '@korzun/design/component';

// Copy this component into your app.
function ReadingProgress({ value, title }: { value: number; title: string }) {
  // A cleared field or a missing value reads as not started.
  if (!Number.isFinite(value) || value <= 0) {
    return <Text tone="muted">Not started</Text>;
  }
  if (value >= 1) {
    return <Text tone="muted">Completed</Text>;
  }
  return <ProgressCircle value={value} size={16} ariaLabel={`Reading progress for ${title}`} />;
}

const BOOKS = [
  { title: 'Middlemarch', progress: 0.42 },
  { title: 'Persuasion', progress: 1 },
  { title: 'Villette', progress: 0 },
  { title: 'North and South', progress: 0.08 },
];

export default function ReadingProgressRecipe() {
  return (
    <Card title="Reading">
      <Space direction="vertical" gap="sm">
        {BOOKS.map((book) => (
          <Space key={book.title} justify="between">
            <Text weight="semibold">{book.title}</Text>
            <ReadingProgress value={book.progress} title={book.title} />
          </Space>
        ))}
      </Space>
    </Card>
  );
}
