/** Preview */
import { ChipsInput } from '@korzun/design/control';
import { createUseStyles } from '@korzun/design/theme';
import { useState } from 'react';

const useStyle = createUseStyles({ box: { width: 300 } });

const SUBJECTS = ['Astronomy', 'Biology', 'Cooking', 'History', 'Poetry', 'Travel'];

export default function Preview() {
  const styles = useStyle();
  const [subjects, setSubjects] = useState(['History', 'Poetry']);
  return (
    <div className={styles.box}>
      <ChipsInput
        value={subjects}
        suggestions={SUBJECTS}
        onChange={setSubjects}
        placeholder="Add subject…"
      />
    </div>
  );
}
