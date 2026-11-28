/** Preview */
import { TextArea } from '@korzun/design/control';
import { createUseStyles } from '@korzun/design/theme';
import { useState } from 'react';

const useStyle = createUseStyles({ box: { width: 320 } });

export default function Preview() {
  const styles = useStyle();
  const [note, setNote] = useState<string | undefined>('Remember to return the book.');
  return (
    <div className={styles.box}>
      <TextArea name="note" layout="vertical" label="Note" value={note} onChange={setNote} />
    </div>
  );
}
