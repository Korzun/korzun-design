/** Passing icons to components
 * Components take the icon component, never an element: `prefix={SearchIcon}`, not `prefix={<SearchIcon />}`. A Button sizes the icon to its text itself.
 */
import { Space, Text } from '@korzun/design/component';
import { Button } from '@korzun/design/control';
import { ChevronIcon, SearchIcon } from '@korzun/design/icon';
import { useState } from 'react';

export default function InComponents() {
  const [searches, setSearches] = useState(0);
  const [pages, setPages] = useState(1);
  return (
    <Space direction="vertical" gap="md" align="start">
      <Space>
        <Button prefix={SearchIcon} onClick={() => setSearches((n) => n + 1)}>
          Search
        </Button>
        <Button suffix={ChevronIcon} onClick={() => setPages((n) => n + 1)}>
          Next page
        </Button>
      </Space>
      <Text tone="muted">
        Searches: {searches}, page {pages}
      </Text>
    </Space>
  );
}
