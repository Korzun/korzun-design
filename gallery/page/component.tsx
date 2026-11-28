import { CodeBlock, Heading, Inline, Page, Stack, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Fragment, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import type { ChangelogEntry, ExampleInfo, ModuleInfo } from '../../scripts/docs-gen/types.js';
import { childrenOf, moduleBySlug, moduleOwner, typePages } from '../data.js';
import { siteColumn } from '../layout/column.js';
import { useScrollToHash } from '../layout/scroll.js';
import { PROSE_WIDTH } from '../layout/type.js';
import { NotFound } from '../not-found.js';
import { ExampleBlock } from '../part/example-block.js';
import { highlight } from '../part/highlight.js';
import { IconGrid } from '../part/icon-grid.js';
import { Lead } from '../part/lead.js';
import { createSlugger, headingTexts, Markdown } from '../part/markdown.js';
import { ModuleGrid } from '../part/module-card.js';
import { PropsTable } from '../part/props-table.js';
import { TokensTable } from '../part/tokens-table.js';

const useStyle = createUseStyles((theme: Theme) => ({
  // The shared site column, so the page lines up with the header.
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
  // The import line keeps its hairline in both modes (it stands in for the
  // dark page edge) and centres Copy on a line that wraps on a phone.
  // `&&` wins over CodeBlock's own rules by specificity, not sheet order.
  importBox: {
    '&&': {
      alignItems: 'center',
      border: `1px solid ${theme.color.border.default}`,
      boxShadow: 'none',
    },
  },
  link: {
    color: theme.color.brand.default,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
  // Two columns, as Ant does: most components look stretched across the whole
  // column. Each run of examples fills the columns alternately (first left,
  // second right), and each column stacks on its own, so a tall example does
  // not leave a hole beside it. A `screen` or `desktop` example takes a row.
  examples: {
    display: 'grid',
    gap: theme.space.xxxl,
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  pair: {
    display: 'grid',
    gap: theme.space.xxxl,
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    alignItems: 'start',
    // On a phone, one column in the authored order: the column boxes drop out
    // and each example is ordered by its index in the examples grid.
    [theme.breakpoint.mobile]: { display: 'contents' },
  },
  half: {
    display: 'grid',
    gap: theme.space.xxxl,
    gridTemplateColumns: 'minmax(0, 1fr)',
    [theme.breakpoint.mobile]: { display: 'contents' },
  },
  changes: { margin: 0, paddingLeft: theme.space.xxxl, maxWidth: PROSE_WIDTH },
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

/** A list of module links: "A", "A and B", "A, B and C". */
const ModuleLinks = ({ mods }: { mods: ModuleInfo[] }) => {
  const styles = useStyle();
  return mods.map((m, i) => (
    <Fragment key={m.slug}>
      {i === 0 ? '' : i === mods.length - 1 ? ' and ' : ', '}
      <Link to={`/components/${m.slug}`} className={styles.link}>
        {m.title}
      </Link>
    </Fragment>
  ));
};

/** Under the lead: the parent a nested module belongs to, or the modules nested under this one. */
const Family = ({ mod }: { mod: ModuleInfo }) => {
  const parent = mod.parent ? moduleBySlug(mod.parent) : undefined;
  const children = childrenOf(mod);
  if (parent) {
    return (
      <Text size="sm" tone="description">
        {'Part of '}
        <ModuleLinks mods={[parent]} />.
      </Text>
    );
  }
  if (children.length === 0) return null;
  return (
    <Text size="sm" tone="description">
      {'Goes with '}
      <ModuleLinks mods={children} />.
    </Text>
  );
};

type Placed = { example: ExampleInfo; index: number };
type Row = ({ wide: true } & Placed) | { wide: false; left: Placed[]; right: Placed[] };

/**
 * The examples as rows: a `screen` or `desktop` example alone, full width; a run
 * of the others split into two columns, alternately, the first on the left.
 */
export const exampleRows = (examples: ExampleInfo[]): Row[] => {
  const rows: Row[] = [];
  let run: Placed[] = [];
  const flush = () => {
    if (run.length > 0) {
      rows.push({
        wide: false,
        left: run.filter((_, i) => i % 2 === 0),
        right: run.filter((_, i) => i % 2 === 1),
      });
    }
    run = [];
  };
  examples.forEach((example, index) => {
    if (example.viewport === 'screen' || example.viewport === 'desktop') {
      flush();
      rows.push({ wide: true, example, index });
    } else run.push({ example, index });
  });
  flush();
  return rows;
};

/** One example, ordered by its index so a phone's single column keeps the authored order. */
const Example = ({ mod, at, ids }: { mod: ModuleInfo; at: Placed; ids: Map<string, string> }) => (
  <div style={{ order: at.index, minWidth: 0 }}>
    <ExampleBlock
      owner={moduleOwner(mod)}
      example={at.example}
      headingId={ids.get(at.example.slug)}
    />
  </div>
);

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
  const parts = childrenOf(mod);
  const ids = {
    parts: slug('Parts'),
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
              <Family mod={mod} />
            </Stack>
            <CodeBlock
              code={mod.importLine}
              copyable
              copyLabel="Copy import"
              wrap
              className={styles.importBox}
            >
              {/* highlight() escapes the line; the spans are its own. */}
              <code dangerouslySetInnerHTML={{ __html: highlight(mod.importLine) }} />
            </CodeBlock>
            <Text size="sm" tone="description">
              {'Agents: read the '}
              <a href={llmDoc} className={styles.link}>
                LLM doc
              </a>
              {` (${mod.docPath}, also in the package under node_modules/@korzun/design/).`}
            </Text>
          </Stack>

          {usage && <Markdown source={usage} from={mod.docPath} />}

          {/* The modules nested under this one in categories.mjs: the overview
              leaves them out, since they are only used inside this one. */}
          {parts.length > 0 && (
            <Section title="Parts" id={ids.parts}>
              <ModuleGrid mods={parts} showParent={false} />
            </Section>
          )}

          {mod.examples.length > 0 && (
            <Section title="Examples" id={ids.examples}>
              <div className={styles.examples}>
                {exampleRows(mod.examples).map((row) =>
                  row.wide ? (
                    <Example key={row.example.slug} mod={mod} at={row} ids={ids.example} />
                  ) : (
                    <div className={styles.pair} key={row.left[0]!.example.slug}>
                      {[row.left, row.right].map(
                        (half, i) =>
                          half.length > 0 && (
                            <div className={styles.half} key={i}>
                              {half.map((at) => (
                                <Example
                                  key={at.example.slug}
                                  mod={mod}
                                  at={at}
                                  ids={ids.example}
                                />
                              ))}
                            </div>
                          )
                      )}
                    </div>
                  )
                )}
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
