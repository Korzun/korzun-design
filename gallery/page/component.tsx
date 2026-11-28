import { Heading, Inline, Page, Stack, Surface, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import cx from 'classnames';
import type { ReactNode } from 'react';
import { useParams } from 'react-router';

import type { ChangelogEntry, ModuleInfo } from '../../scripts/docs-gen/types.js';
import { moduleBySlug, moduleOwner, typePages } from '../data.js';
import { siteColumn } from '../layout/column.js';
import { useScrollToHash } from '../layout/scroll.js';
import { codeBlock } from '../layout/type.js';
import { NotFound } from '../not-found.js';
import { CopyButton } from '../part/copy-button.js';
import { ExampleBlock } from '../part/example-block.js';
import { highlight, useHighlightStyle } from '../part/highlight.js';
import { IconGrid } from '../part/icon-grid.js';
import { Lead } from '../part/lead.js';
import { createSlugger, headingTexts, Markdown } from '../part/markdown.js';
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
    ...codeBlock(theme),
    overflowWrap: 'break-word',
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

const Section = ({ title, id, children }: { title: string; id: string; children: ReactNode }) => (
  <Stack as="section" gap="xl" aria-label={title}>
    <Heading level={2} id={id}>
      {title}
    </Heading>
    {children}
  </Stack>
);

/** `#/components/<slug>`: everything about one module, from the generated site data. */
export const ComponentPage = () => {
  const styles = useStyle();
  const tokens = useHighlightStyle();
  const mod = moduleBySlug(useParams().slug ?? '');
  // A link to a supporting type (`#/components/button#buttontypevalue`) or a
  // Usage section (`#/components/popover#layers`) lands on it.
  useScrollToHash();

  if (!mod) return <NotFound />;
  const usage = usageBody(mod);
  // Heading ids in the doc's order, numbered on a repeat as GitHub does: a
  // Usage `### Actions` keeps `actions`, the example after it gets `actions-1`.
  const slug = createSlugger();
  for (const text of headingTexts(usage)) slug(text);
  const ids = {
    examples: slug('Examples'),
    example: new Map(mod.examples.map((e) => [e.slug, slug(e.title)])),
    icons: slug('All icons'),
    props: slug('Props'),
    tokens: slug('Tokens'),
    changelog: slug('Changelog'),
  };
  const llmDoc = `${import.meta.env.BASE_URL}${mod.docPath}`;

  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle={`${mod.title} · @korzun/design`}>
        <Stack gap="xxxxxl">
          <Stack gap="xl">
            <Stack gap="sm">
              <Heading level={1}>{mod.title}</Heading>
              <Lead>{mod.description}</Lead>
            </Stack>
            <Inline gap="md" align="center" className={styles.importBox}>
              <code
                className={cx(styles.importCode, tokens.tokens)}
                // highlight() escapes the line; the spans are its own.
                dangerouslySetInnerHTML={{ __html: highlight(mod.importLine) }}
              />
              {/* A hand-drawn box on the page: its Copy button sits one level in. */}
              <Surface>
                <CopyButton text={mod.importLine} label="Copy import" />
              </Surface>
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
            <Section title="Examples" id={ids.examples}>
              <div className={styles.examples}>
                {mod.examples.map((example) => (
                  <ExampleBlock
                    key={example.slug}
                    owner={moduleOwner(mod)}
                    example={example}
                    headingId={ids.example.get(example.slug)}
                  />
                ))}
              </div>
            </Section>
          )}

          {mod.id === 'icon' && (
            <Section title="All icons" id={ids.icons}>
              <IconGrid />
            </Section>
          )}

          {mod.tables.length > 0 && (
            <Section title="Props" id={ids.props}>
              <Stack gap="xxxl">
                {mod.tables.map((table) => (
                  <PropsTable
                    key={table.name}
                    table={table}
                    tables={mod.tables}
                    typePages={typePages}
                    from={mod.docPath}
                  />
                ))}
              </Stack>
            </Section>
          )}

          {mod.tokens.length > 0 && (
            <Section title="Tokens" id={ids.tokens}>
              <TokensTable tokens={mod.tokens} />
            </Section>
          )}

          {mod.changelog.length > 0 && (
            <Section title="Changelog" id={ids.changelog}>
              <Stack gap="xxxl">
                {byVersion(mod.changelog).map((group) => (
                  <Stack gap="md" key={group.version}>
                    <Inline gap="md" align="baseline">
                      <Heading level={3}>{group.version}</Heading>
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
