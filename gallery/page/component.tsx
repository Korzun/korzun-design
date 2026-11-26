import { Heading, Inline, Page, Stack, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useEffect, type ReactNode } from 'react';
import { useLocation, useParams } from 'react-router';

import type { ChangelogEntry, ModuleInfo } from '../../scripts/docs-gen/types.js';
import { moduleBySlug } from '../data.js';
import { siteColumn } from '../layout/column.js';
import { NotFound } from '../not-found.js';
import { CopyButton } from '../part/copy-button.js';
import { ExampleBlock } from '../part/example-block.js';
import { IconGrid } from '../part/icon-grid.js';
import { Markdown } from '../part/markdown.js';
import { PropsTable } from '../part/props-table.js';
import { TokensTable } from '../part/tokens-table.js';

const useStyle = createUseStyles((theme: Theme) => ({
  // The shared site column, so the page lines up with the header.
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
  importBox: {
    padding: `${theme.space.md} ${theme.space.md} ${theme.space.md} ${theme.space.xl}`,
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.bg.cardHeader,
  },
  importCode: {
    flex: '1 1 0',
    minWidth: 0,
    fontFamily: theme.fontFamily.mono,
    fontSize: theme.fontSize.sm,
    overflowWrap: 'anywhere',
  },
  link: {
    color: theme.color.brand.default,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
  examples: {
    display: 'grid',
    gap: theme.space.xxxl,
    // One column: examples are tall and wide enough that two would squeeze them.
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  changes: { margin: 0, paddingLeft: theme.space.xxxl },
  change: { '& + &': { marginTop: theme.space.md } },
}));

// The usage body opens with the front-matter description; the page shows that
// under the title already, so drop it from the body.
const usageBody = (mod: ModuleInfo): string => {
  const body = mod.body.trimStart();
  return body.startsWith(mod.description) ? body.slice(mod.description.length).trimStart() : body;
};

const byVersion = (entries: ChangelogEntry[]) => {
  const groups: { version: string; date: string; entries: ChangelogEntry[] }[] = [];
  for (const entry of entries) {
    const last = groups.at(-1);
    if (last?.version === entry.version) last.entries.push(entry);
    else groups.push({ version: entry.version, date: entry.date, entries: [entry] });
  }
  return groups;
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Stack as="section" gap="xl" aria-label={title}>
    <Heading level={2} id={title.toLowerCase().replaceAll(' ', '-')}>
      {title}
    </Heading>
    {children}
  </Stack>
);

/** `#/components/<slug>`: everything about one module, from the generated site data. */
export const ComponentPage = () => {
  const styles = useStyle();
  const mod = moduleBySlug(useParams().slug ?? '');
  const { hash } = useLocation();

  // A link to a supporting type (`#/components/button#buttontypevalue`) lands on its table.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  if (!mod) return <NotFound />;
  const usage = usageBody(mod);
  const llmDoc = `${import.meta.env.BASE_URL}${mod.docPath}`;

  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle={`${mod.title} · @korzun/design`}>
        <Stack gap="xxxxxl">
          <Stack gap="xl">
            <Stack gap="sm">
              <Heading level={1}>{mod.title}</Heading>
              <Text as="p" size="lg" tone="description">
                {mod.description}
              </Text>
            </Stack>
            <Inline gap="md" align="center" className={styles.importBox}>
              <code className={styles.importCode}>{mod.importLine}</code>
              <CopyButton text={mod.importLine} label="Copy import" />
            </Inline>
            <Text size="sm" tone="description">
              {'Agents: read the '}
              <a href={llmDoc} className={styles.link}>
                LLM doc
              </a>
              {` (${mod.docPath}, also in the package under node_modules/@korzun/design/).`}
            </Text>
          </Stack>

          {usage && <Markdown source={usage} from={mod.docPath} />}

          {mod.examples.length > 0 && (
            <Section title="Examples">
              <div className={styles.examples}>
                {mod.examples.map((example) => (
                  <ExampleBlock key={example.slug} mod={mod} example={example} />
                ))}
              </div>
            </Section>
          )}

          {mod.id === 'icon' && (
            <Section title="All icons">
              <IconGrid />
            </Section>
          )}

          {mod.tables.length > 0 && (
            <Section title="Props">
              <Stack gap="xxxl">
                {mod.tables.map((table) => (
                  <PropsTable
                    key={table.name}
                    table={table}
                    tables={mod.tables}
                    from={mod.docPath}
                  />
                ))}
              </Stack>
            </Section>
          )}

          {mod.tokens.length > 0 && (
            <Section title="Tokens">
              <TokensTable tokens={mod.tokens} />
            </Section>
          )}

          {mod.changelog.length > 0 && (
            <Section title="Changelog">
              <Stack gap="xxl">
                {byVersion(mod.changelog).map((group) => (
                  <Stack gap="md" key={group.version}>
                    <Inline gap="md" align="baseline">
                      <Heading level={3} size="md">
                        {group.version}
                      </Heading>
                      <Text size="sm" tone="muted">
                        {group.date}
                      </Text>
                    </Inline>
                    <ul className={styles.changes}>
                      {group.entries.map((entry, i) => (
                        <li key={i} className={styles.change}>
                          <Markdown source={entry.text} from="CHANGELOG.md" />
                        </li>
                      ))}
                    </ul>
                  </Stack>
                ))}
              </Stack>
            </Section>
          )}
        </Stack>
      </Page>
    </div>
  );
};
