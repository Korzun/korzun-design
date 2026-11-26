import { Card, Heading, Page, Stack, Text } from '@korzun/design/component';
import { TextInput } from '@korzun/design/control';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import type { ModuleInfo } from '../../scripts/docs-gen/types.js';
import { siteData } from '../data.js';
import { Thumbnail } from '../part/thumbnail.js';
import { filterModules } from '../search.js';

/** The closed category list, in display order. */
export const CATEGORIES = [
  'Layout',
  'Typography',
  'Actions',
  'Inputs',
  'Overlays',
  'Feedback',
  'Data display',
  'Navigation',
  'Theme',
];

const useStyle = createUseStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
    gap: theme.space.xl,
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
        <Stack gap="md">
          <Thumbnail mod={mod} />
          <Stack gap="xs">
            <Heading level={3} size="md">
              {mod.title}
            </Heading>
            <Text size="sm" tone="description">
              {mod.description}
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
};

// TextInput has no aria-label prop; name its input once it is in the DOM.
const SearchBox = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('input')?.setAttribute('aria-label', 'Search components');
  }, []);
  return (
    <div ref={ref}>
      <TextInput
        name="search"
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
    <Page documentTitle="@korzun/design" header={<SearchBox value={query} onChange={setQuery} />}>
      {groups.length === 0 && <Text tone="muted">{`No components match “${query.trim()}”.`}</Text>}
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
    </Page>
  );
};
