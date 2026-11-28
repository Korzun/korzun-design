/** Search field
 * `prefix` puts a decorative icon inside the field's left end; the text moves clear of it. The icon is hidden from screen readers, so name the field with `ariaLabel`. Paired with an `action` that clears, shown only while there is text, it makes a search box.
 */
import { Space, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { CircleXIcon, SearchIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function SearchField() {
  const [query, setQuery] = useState<string | undefined>(undefined);
  return (
    <Space direction="vertical">
      <TextInput
        name="search"
        ariaLabel="Search books"
        placeholder="Search by title or author"
        prefix={SearchIcon}
        value={query}
        onChange={setQuery}
        action={
          query === undefined
            ? undefined
            : { icon: CircleXIcon, ariaLabel: 'Clear search', action: () => setQuery(undefined) }
        }
      />
      <Text tone="muted">Query: {query === undefined ? 'none' : `“${query}”`}</Text>
    </Space>
  );
}
