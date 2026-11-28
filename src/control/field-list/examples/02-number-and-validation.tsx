/** Number column and validation
 * A `number` column renders a `NumberInput` and reports a `number`, or
 * `undefined` when the field is emptied; a `text` column reports a string.
 * `validate` receives the raw text: while it fails, `onChange` is not called
 * and `onValidChange` reports that field once, when validity flips.
 */
import { Card, Space, Text } from '@korzun/design/component';
import { FieldList, type FieldRow } from '@korzun/design/control';
import { useState } from 'react';

export default function NumberAndValidation() {
  const [rows, setRows] = useState<FieldRow[]>([
    { _key: crypto.randomUUID(), name: 'Dune', qty: 2 },
  ]);
  const [invalid, setInvalid] = useState<string[]>([]);
  return (
    <Card title="Order">
      <Space direction="vertical">
        <FieldList
          addLabel="Add item"
          columns={[
            {
              type: 'text',
              key: 'name',
              placeholder: 'Title (letters only)',
              validate: (text) => /^[A-Za-z ]*$/.test(text),
            },
            { type: 'number', key: 'qty', placeholder: 'Quantity' },
          ]}
          rows={rows}
          onAdd={() => setRows((r) => [...r, { _key: crypto.randomUUID() }])}
          onRemove={(key) => setRows((r) => r.filter((row) => row._key !== key))}
          onChange={(key, field, value) =>
            setRows((r) => r.map((row) => (row._key === key ? { ...row, [field]: value } : row)))
          }
          onValidChange={(field, valid) =>
            setInvalid((names) => (valid ? names.filter((n) => n !== field) : [...names, field]))
          }
        />
        <Text tone="muted">
          Stored: {rows.map((row) => `${row.name ?? '–'} × ${row.qty ?? '–'}`).join(', ') || 'none'}
        </Text>
        <Text tone={invalid.length > 0 ? 'danger' : 'muted'}>
          {invalid.length > 0
            ? `Invalid: ${invalid.map((name) => name.split('.')[1]).join(', ')}`
            : 'All fields valid'}
        </Text>
      </Space>
    </Card>
  );
}
