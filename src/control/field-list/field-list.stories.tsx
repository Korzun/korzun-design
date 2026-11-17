import { FIELD_COLUMNS } from '@gallery/fixtures';
import type { Story, StoryDefault } from '@gallery/story';
import { useState, type ComponentProps } from 'react';

import { FieldList } from './index.js';

type Props = ComponentProps<typeof FieldList>;
type Rows = Props['rows'];

export default {
  title: 'Control / FieldList',
  args: { addLabel: 'Add row' },
  argTypes: { addLabel: { control: 'text' } },
} satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => {
  const [rows, setRows] = useState<Rows>([
    { _key: 'a', name: 'Alpha', qty: 1 },
    { _key: 'b', name: 'Beta', qty: 2 },
  ]);
  return (
    <FieldList
      {...args}
      columns={[...FIELD_COLUMNS]}
      rows={rows}
      onAdd={() => setRows((r) => [...r, { _key: String(Date.now()) }])}
      onChange={(rowKey, field, value) =>
        setRows((r) => r.map((row) => (row._key === rowKey ? { ...row, [field]: value } : row)))
      }
      onRemove={(rowKey) => setRows((r) => r.filter((row) => row._key !== rowKey))}
    />
  );
};
