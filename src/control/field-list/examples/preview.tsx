/** Preview */
import { FieldList, type FieldRow } from '@korzun/design/control';
import { createUseStyles } from '@korzun/design/theme';
import { useState } from 'react';

const useStyle = createUseStyles({ box: { width: 360 } });

export default function Preview() {
  const styles = useStyle();
  const [identifiers, setIdentifiers] = useState<FieldRow[]>([
    { _key: 'isbn', scheme: 'isbn', value: '9780441172719' },
  ]);
  return (
    <div className={styles.box}>
      <FieldList
        addLabel="Add identifier"
        columns={[
          { type: 'text', key: 'scheme', placeholder: 'Scheme (e.g. isbn)' },
          { type: 'text', key: 'value', placeholder: 'Value' },
        ]}
        rows={identifiers}
        onAdd={() => setIdentifiers((r) => [...r, { _key: crypto.randomUUID() }])}
        onRemove={(key) => setIdentifiers((r) => r.filter((row) => row._key !== key))}
        onChange={(key, field, value) =>
          setIdentifiers((r) =>
            r.map((row) => (row._key === key ? { ...row, [field]: value } : row))
          )
        }
      />
    </div>
  );
}
