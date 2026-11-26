/** Loading and disabled
 * `loading` shows a spinner and "Loading…" and the select can't open; here it
 * clears when the options arrive. `disabled` fades it, hides the ✕ and blocks opening.
 */
import { Inline, Stack } from '@korzun/design/component';
import { Button, Select } from '@korzun/design/control';
import { useState } from 'react';

export default function LoadingAndDisabled() {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [author, setAuthor] = useState<string | undefined>();
  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setOptions(['Ursula K. Le Guin', 'Terry Pratchett', 'N. K. Jemisin']);
      setLoading(false);
    }, 1200);
  };
  return (
    <Stack>
      <Inline>
        <Button disabled={loading || options.length > 0} onClick={load}>
          Load authors
        </Button>
      </Inline>
      <Select
        name="author"
        label="Author"
        placeholder="No authors yet"
        value={author}
        options={options}
        loading={loading}
        onChange={setAuthor}
      />
      <Select name="locked" label="Disabled" value="Terry Pratchett" options={options} disabled />
    </Stack>
  );
}
