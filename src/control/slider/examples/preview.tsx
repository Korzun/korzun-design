/** Preview */
import { Slider } from '@korzun/design/control';
import { createUseStyles } from '@korzun/design/theme';
import { useState } from 'react';

const useStyle = createUseStyles({ box: { width: 280 } });

export default function Preview() {
  const styles = useStyle();
  const [value, setValue] = useState(52);
  return (
    <div className={styles.box}>
      <Slider
        value={value}
        onChange={setValue}
        step={null}
        detents={[0, 8, 19, 33, 52, 71, 100].map((v) => ({ value: v }))}
        startLabel="Not started"
        endLabel="Completed"
        ariaLabel="Reading progress"
      />
    </div>
  );
}
