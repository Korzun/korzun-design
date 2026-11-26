/** Action
 * `action` puts an icon button inside the field's right end. Give it an
 * `ariaLabel`, since the icon alone has no name. Here it clears the search.
 */
import { Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { CircleXIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function Action() {
  const [query, setQuery] = useState<string | undefined>('Earthsea');
  return (
    <Stack>
      <TextInput
        name="query"
        label="Search"
        value={query}
        onChange={setQuery}
        action={{ icon: CircleXIcon, ariaLabel: 'Clear search', action: () => setQuery(undefined) }}
      />
      <Text tone="muted">Query: {query === undefined ? 'none' : `“${query}”`}</Text>
    </Stack>
  );
}
