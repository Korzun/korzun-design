/** Loading and disabled
 * `loading` shows a spinner and "Loading…" in place of the value, and the select
 * can't open; turn it on while the options are on their way. `disabled` fades it,
 * hides the ✕ and blocks opening.
 */
import { Space } from '@korzun/design/component';
import { Select, Switch } from '@korzun/design/control';
import { useState } from 'react';

const AUTHORS = ['Ursula K. Le Guin', 'Terry Pratchett', 'N. K. Jemisin'];

export default function LoadingAndDisabled() {
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<string | undefined>('Terry Pratchett');
  return (
    <Space direction="vertical">
      <Switch name="loading" label="Loading" checked={loading} onChange={setLoading} />
      <Select
        name="author"
        label="Author"
        value={author}
        options={AUTHORS}
        loading={loading}
        onChange={setAuthor}
      />
      <Select name="locked" label="Disabled" value="N. K. Jemisin" options={AUTHORS} disabled />
    </Space>
  );
}
