import { Card, Heading, Page, Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState } from 'react';
import { Link } from 'react-router';

import { CATEGORIES } from '../../scripts/docs-gen/categories.mjs';
import type { ModuleInfo } from '../../scripts/docs-gen/types.js';
import { moduleOwner, siteData } from '../data.js';
import { siteColumn } from '../layout/column.js';
import { Markdown } from '../part/markdown.js';
import { Thumbnail } from '../part/thumbnail.js';
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
    gap: theme.space.xl,
    // On a phone the cards are a list: a full-width thumbnail per card ran the
    // page past 12,000px with its text scaled to 7px.
    [theme.breakpoint.mobile]: { gap: theme.space.md },
  },
  // A phone row: a small thumbnail beside the name and description.
  cardText: { minWidth: 0 },
  cardBody: {
    // Doubled, to win over Stack's own column direction.
    [theme.breakpoint.mobile]: { '&&': { flexDirection: 'row', alignItems: 'flex-start' } },
  },
  card: {
    display: 'block',
    height: '100%',
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: theme.radius.lg,
    '& > *': { height: '100%', boxSizing: 'border-box' },
    '&:hover > *': { borderColor: theme.color.border.hover },
    '&:focus-visible': { outline: `2px solid ${theme.color.border.focus}`, outlineOffset: 2 },
  },
}));

const ModuleCard = ({ mod }: { mod: ModuleInfo }) => {
  const styles = useStyle();
  return (
    <Link to={`/components/${mod.slug}`} className={styles.card}>
      <Card>
        <Stack gap="md" className={styles.cardBody}>
          <Thumbnail owner={moduleOwner(mod)} compact />
          <Stack gap="xs" className={styles.cardText}>
            <Heading level={3} size="md">
              {mod.title}
            </Heading>
            {/* Inline markdown (code spans), with links as text: the card is a link already. */}
            <Text size="sm" tone="description">
              <Markdown source={mod.description} from={mod.docPath} inline links={false} />
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
};

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
  const shown = filterModules(siteData.modules, query);
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
            <Text tone="muted">{`No components match “${query.trim()}”.`}</Text>
          )}
          {groups.map(({ category, modules }) => (
            <Stack as="section" gap="lg" key={category}>
              <Heading level={2}>{category}</Heading>
              <div className={styles.grid}>
                {modules.map((mod) => (
                  <ModuleCard key={mod.slug} mod={mod} />
                ))}
              </div>
            </Stack>
          ))}
        </Stack>
      </Page>
    </div>
  );
};
