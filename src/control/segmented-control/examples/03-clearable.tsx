/** Clearable
 * With `clearable`, clicking the checked segment, Backspace or Delete calls
 * `onChange(null)`. Once the value is `null` nothing is checked and no lens is
 * drawn. Without `clearable`, `onChange` never receives `null`.
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

export default function Clearable() {
  const [rating, setRating] = useState<(typeof RATINGS)[number]['value'] | null>('great');
  return (
    <Stack>
      <SegmentedControl
        label="Rating"
        options={RATINGS}
        value={rating}
        onChange={setRating}
        clearable
        showLabels={false}
      />
      <Text tone="muted">Rating: {rating ?? 'none'}</Text>
    </Stack>
  );
}
