/** Basic
 * Rows of inputs with a remove button each and a dashed add button below. You
 * own the rows: every `onAdd`, `onRemove` and `onChange` is yours to apply, and
 * each row needs a stable `_key` made once (`crypto.randomUUID()`), never from
 * the index. Inputs have no labels, so `placeholder` says what each column is.
 */
import { Card } from '@korzun/design/component';
import { FieldList, type FieldRow } from '@korzun/design/control';
import { useState } from 'react';

export default function Basic() {
  const [identifiers, setIdentifiers] = useState<FieldRow[]>([
    { _key: crypto.randomUUID(), scheme: 'isbn', value: '9780441172719' },
  ]);
  return (
    <Card title="Identifiers">
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
    </Card>
  );
}
