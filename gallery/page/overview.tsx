import { EmptyState, Heading, Page, Stack } from '@korzun/design/component';
import { Button, TextInput } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';

import { CATEGORIES } from '../../scripts/docs-gen/categories.mjs';
import { siteData } from '../data.js';
import { siteColumn } from '../layout/column.js';
import { ModuleGrid } from '../part/module-card.js';
import { filterModules } from '../search.js';

const useStyle = createUseStyles((theme: Theme) => ({
  // Page's own column is 800px; the overview uses the wider site column so
  // its edges line up with the header and four cards fit per row.
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
  // TextInput's inline layout sizes to its placeholder; stretch it across the column.
  search: {
    '&& > div': { display: 'flex', width: '100%' },
    '&& input': { width: '100%' },
  },
}));

const SearchBox = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const styles = useStyle();
  return (
    <div className={styles.search}>
      <TextInput
        name="search"
        ariaLabel="Search components"
        layout="inline"
        placeholder="Search by name, description or prop"
        autoComplete="off"
        value={value}
        onChange={(v) => onChange(v ?? '')}
      />
    </div>
  );
};

/** The site root: a search box, then a card per component grouped by category. */
export const OverviewPage = () => {
  const styles = useStyle();
  const [query, setQuery] = useState('');
  // A nested module (a Page action bar, a CardRow) is shown on its parent's
  // page, not here: it is only used inside the parent. A search still finds it.
  const shown =
    query.trim() === ''
      ? siteData.modules.filter((m) => !m.parent)
      : filterModules(siteData.modules, query);
  const groups = CATEGORIES.map((category) => ({
    category,
    modules: shown.filter((m) => m.category === category),
  })).filter((g) => g.modules.length > 0);

  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle="@korzun/design">
        <Stack gap="xxxxl">
          <SearchBox value={query} onChange={setQuery} />
          {groups.length === 0 && (
            <EmptyState title={`No components match “${query.trim()}”.`}>
              <Stack gap="md" align="center">
                Try a component name, a word from its description, or a prop.
                <Button onClick={() => setQuery('')}>Clear search</Button>
              </Stack>
            </EmptyState>
          )}
          {groups.map(({ category, modules }) => (
            <Stack as="section" gap="lg" key={category}>
              <Heading level={2}>{category}</Heading>
              <ModuleGrid mods={modules} />
            </Stack>
          ))}
        </Stack>
      </Page>
    </div>
  );
};
