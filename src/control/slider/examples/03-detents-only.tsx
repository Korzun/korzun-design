/** Detents only: a chapter picker
 * `step={null}` stops only at the detents, which can sit anywhere: here each chapter's start in the book. The value is a position (0–100), mapped back to a chapter for the heading and `ariaValueText`. `onChange` updates the chapter as you drag; `onChangeEnd` fires once on release, the place to save.
 */
import { Space, Text } from '@korzun/design/component';
import { Slider } from '@korzun/design/control';
import { useState } from 'react';

// Where each chapter starts, as a percentage of the book; 100 is "finished".
const STARTS = [8, 19, 33, 52, 71];
const DETENTS = [{ value: 0 }, ...STARTS.map((value) => ({ value })), { value: 100 }];

const describe = (v: number) => {
  if (v <= 0) return 'Not started';
  if (v >= 100) return 'Completed';
  return `Chapter ${STARTS.indexOf(v) + 1}`;
};

export default function DetentsOnly() {
  const [position, setPosition] = useState(33);
  const [saved, setSaved] = useState(33);
  return (
    <Space direction="vertical">
      <Text weight="semibold">{describe(position)}</Text>
      <Slider
        value={position}
        onChange={setPosition}
        onChangeEnd={setSaved}
        step={null}
        detents={DETENTS}
        startLabel="Not started"
        endLabel="Completed"
        ariaLabel="Reading progress"
        ariaValueText={describe}
      />
      <Text tone="muted">Saved: {describe(saved)}</Text>
    </Space>
  );
}
