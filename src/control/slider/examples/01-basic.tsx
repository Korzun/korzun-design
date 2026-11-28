/** Basic
 * A controlled value from 0 to 100 in steps of 1. Drag the thumb, press anywhere on the track, or focus it and use the arrow keys, Page Up/Down, Home and End. `onChange` gets the new number, not an event.
 */
import { Space, Text } from '@korzun/design/component';
import { Slider } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [volume, setVolume] = useState(40);
  return (
    <Space direction="vertical">
      <Slider value={volume} onChange={setVolume} ariaLabel="Volume" />
      <Text tone="muted">Volume: {volume}</Text>
    </Space>
  );
}
