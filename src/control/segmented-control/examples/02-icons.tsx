/** Icons
 * An option with an `Icon` draws it above its label, which becomes a small
 * caption. `showLabels={false}` drops the captions and leaves icons only; the
 * `label` stays each segment's accessible name. `Icon` takes a component
 * (`ThumbDownIcon`), not an element.
 */
import { Stack, Text } from '@korzun/design/component';
import { SegmentedControl } from '@korzun/design/control';
import { HandLoveYouIcon, HandOkIcon, ThumbDownIcon } from '@korzun/design/icon';
import { useState } from 'react';

const RATINGS = [
  { value: 'bad', label: 'Bad', Icon: ThumbDownIcon },
  { value: 'ok', label: 'Okay', Icon: HandOkIcon },
  { value: 'great', label: 'Great', Icon: HandLoveYouIcon },
] as const;

export default function Icons() {
  const [rating, setRating] = useState<(typeof RATINGS)[number]['value']>('ok');
  return (
    <Stack align="start">
      <Text tone="muted">With captions</Text>
      <SegmentedControl label="Rating" options={RATINGS} value={rating} onChange={setRating} />
      <Text tone="muted">showLabels off</Text>
      <SegmentedControl
        label="Rating"
        options={RATINGS}
        value={rating}
        onChange={setRating}
        showLabels={false}
      />
      <Text tone="muted">Rating: {rating}</Text>
    </Stack>
  );
}
