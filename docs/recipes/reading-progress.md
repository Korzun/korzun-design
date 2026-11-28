---
title: Reading progress
description: A book's progress as "Not started", a ProgressCircle, or "Completed".
category: Recipe
---

# Reading progress

Words for the two ends and a circle for everything between: "Not started"
before the first page, "Completed" after the last, and a `ProgressCircle` with
its percentage in between. Copy the `ReadingProgress` component into your app
and pass it a 0–1 `value` and the book's `title`.

<!-- generated:examples -->

## Examples

### Reading progress

A list of books, each with its progress: "Not started" before the first page, "Completed" after the last, and a ProgressCircle in between.

```tsx
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
```

<!-- /generated:examples -->

## Wiring it up

- `value` is a fraction from 0 to 1. Divide a 0–100 API percentage by 100
  first, or pass `max={100}` to the circle and change the two checks.
- The end states are plain text, so screen readers read them as they are; the
  circle in between is a named progressbar.
- Change the words or the end states to suit the thing in progress ("Queued",
  "Done", or a check icon at the end).
