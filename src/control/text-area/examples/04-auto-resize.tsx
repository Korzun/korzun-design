/** Auto-resize
 * With `autoResize` the field grows to fit what is typed, so it never scrolls;
 * its minimum height is 7rem. Without it the height stays at 10rem and long text
 * scrolls. Both start with the same text: add lines to each.
 */
import { Stack } from '@korzun/design/component';
import { TextArea } from '@korzun/design/control';
import { useState } from 'react';

const SAMPLE = 'One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen';

export default function AutoResize() {
  const [grows, setGrows] = useState<string | undefined>(SAMPLE);
  const [fixed, setFixed] = useState<string | undefined>(SAMPLE);
  return (
    <Stack>
      <TextArea
        name="grows"
        layout="vertical"
        label="Auto-resize"
        autoResize
        value={grows}
        onChange={setGrows}
      />
      <TextArea
        name="fixed"
        layout="vertical"
        label="Fixed height"
        value={fixed}
        onChange={setFixed}
      />
    </Stack>
  );
}
