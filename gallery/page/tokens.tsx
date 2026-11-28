import { Heading, Page, Stack } from '@korzun/design/component';
import { createUseStyles, useTheme, type Theme } from '@korzun/design/theme';
import type { ReactNode } from 'react';

import { siteColumn } from '../layout/column.js';
import { siteLink } from '../layout/link.js';
import { Lead } from '../part/lead.js';

// Preview sizes. Each is the size of a sample, not a spacing or radius token, so
// it is named here rather than read from the theme.
/** The narrowest colour swatch column; the grid fits as many as the row allows. */
const SWATCH_MIN_WIDTH = '8rem';
/** A colour swatch's height. */
const SWATCH_HEIGHT = '2.75rem';
/** The bar that previews a space or size value: its width is the value. */
const BAR_HEIGHT = '0.75rem';
/** The tile that previews a radius value. */
const RADIUS_TILE = { width: '3rem', height: '2rem' };
/** The widest a line-height sample runs, so it wraps and shows the leading. */
const LINE_SAMPLE_MAX_WIDTH = '16rem';
/** A shadow tile's height and its grid's narrowest column. */
const SHADOW_TILE_HEIGHT = '4rem';
const SHADOW_MIN_WIDTH = '11.25rem';

const useStyle = createUseStyles((theme: Theme) => ({
  // The shared site column, like the overview and component pages.
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
  section: { display: 'flex', flexDirection: 'column', gap: theme.space.xl },
  link: siteLink(theme),
  group: { margin: 0, fontSize: theme.fontSize.md, color: theme.color.text.muted },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${SWATCH_MIN_WIDTH}, 1fr))`,
    gap: theme.space.xl,
  },
  swatch: { display: 'flex', flexDirection: 'column', gap: theme.space.xs },
  chip: {
    height: SWATCH_HEIGHT,
    // Swatches and shadow boxes are tiles on the page background.
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.color.border.default}`,
  },
  path: { fontSize: theme.fontSize.xs, color: theme.color.text.muted, wordBreak: 'break-all' },
  // Name and value in two columns: the name column is as wide as the longest
  // name in the section, so a long name pushes the values over, never into them.
  rows: {
    display: 'grid',
    gridTemplateColumns: 'max-content minmax(0, 1fr)',
    columnGap: theme.space.xxxl,
    rowGap: theme.space.xl,
    alignItems: 'center',
    fontSize: theme.fontSize.md,
    // On a phone the name sits above its value.
    [theme.breakpoint.mobile]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      rowGap: theme.space.xs,
      '& > $key:not(:first-child)': { marginTop: theme.space.lg },
    },
  },
  key: { fontFamily: theme.fontFamily.mono, overflowWrap: 'anywhere' },
  cell: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.space.xl,
    minWidth: 0,
  },
  value: {
    color: theme.color.text.muted,
    fontFamily: theme.fontFamily.mono,
    overflowWrap: 'anywhere',
  },
  bar: { height: BAR_HEIGHT, maxWidth: '100%', backgroundColor: theme.color.brand.default },
  radiusTile: { ...RADIUS_TILE, backgroundColor: theme.color.brand.default },
  sample: { maxWidth: LINE_SAMPLE_MAX_WIDTH },
  box: {
    height: SHADOW_TILE_HEIGHT,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.bg.card,
  },
  boxes: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${SHADOW_MIN_WIDTH}, 1fr))`,
    gap: theme.space.xxxl,
  },
}));

type Node = { [key: string]: Node | string | number };

const isNode = (value: unknown): value is Node => typeof value === 'object' && value !== null;

/** Flattens a token value to `[path, leafValue]` pairs; a plain value is its own one leaf. */
export const leaves = (value: unknown, prefix: string): [string, string | number][] =>
  isNode(value)
    ? Object.entries(value).flatMap(([key, child]) => leaves(child, `${prefix}.${key}`))
    : [[prefix, value as string | number]];

/** Each recipe's path and the properties it sets; a group (`modal`, `card`) holds only recipes. */
export const recipeEntries = (node: Node, prefix: string): [string, string[]][] =>
  Object.entries(node).flatMap(([key, value]): [string, string[]][] => {
    if (!isNode(value)) return [];
    const children = Object.values(value);
    return children.length > 0 && children.every(isNode)
      ? recipeEntries(value, `${prefix}.${key}`)
      : [[`${prefix}.${key}`, Object.keys(value)]];
  });

/** The theme's token groups, in its own order: every key but the `colorScheme` string. */
export const tokenGroups = (theme: Theme): (keyof Theme)[] =>
  (Object.keys(theme) as (keyof Theme)[]).filter((key) => isNode(theme[key]));

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  const styles = useStyle();
  return (
    <section className={styles.section} aria-label={title}>
      <Heading level={2}>{title}</Heading>
      {children}
    </section>
  );
};

const SAMPLE = 'The quick brown fox';

export function TokensPage() {
  const styles = useStyle();
  const theme = useTheme();

  // A preview per group that has one; every other group lists its values.
  const previews: Partial<Record<keyof Theme, (value: string) => ReactNode>> = {
    space: (v) => <div className={styles.bar} style={{ width: v }} />,
    radius: (v) => <div className={styles.radiusTile} style={{ borderRadius: v }} />,
    fontSize: (v) => <span style={{ fontSize: v }}>{SAMPLE}</span>,
    fontFamily: (v) => <span style={{ fontFamily: v }}>{SAMPLE}</span>,
    fontWeight: (v) => <span style={{ fontWeight: Number(v) }}>{SAMPLE}</span>,
    lineHeight: (v) => (
      <span className={styles.sample} style={{ lineHeight: v }}>
        {`${SAMPLE} jumps over the lazy dog, and back again.`}
      </span>
    ),
  };

  const rows = (entries: [string, string][], preview?: (value: string) => ReactNode) => (
    <div className={styles.rows}>
      {entries.flatMap(([path, value]) => [
        <span key={`${path}:key`} className={styles.key}>
          {path}
        </span>,
        <span key={`${path}:value`} className={styles.cell}>
          {preview?.(value)}
          <span className={styles.value}>{value}</span>
        </span>,
      ])}
    </div>
  );

  const body = (group: keyof Theme): ReactNode => {
    const value = theme[group] as unknown as Node;
    if (group === 'color')
      return Object.entries(value).map(([name, colors]) => (
        <div key={name}>
          <h3 className={styles.group}>color.{name}</h3>
          <div className={styles.grid}>
            {leaves(colors, `color.${name}`).map(([path, color]) => (
              <div key={path} className={styles.swatch}>
                <div className={styles.chip} style={{ background: String(color) }} />
                <span className={styles.path}>{path}</span>
              </div>
            ))}
          </div>
        </div>
      ));
    if (group === 'shadow')
      return (
        <div className={styles.boxes}>
          {leaves(value, 'shadow').map(([path, shadow]) => (
            <div key={path}>
              <div className={styles.box} style={{ boxShadow: String(shadow) }} />
              <span className={styles.path}>{path}</span>
            </div>
          ))}
        </div>
      );
    if (group === 'recipe')
      return rows(recipeEntries(value, 'recipe').map(([path, keys]) => [path, keys.join(', ')]));
    return rows(
      leaves(value, group).map(([path, v]) => [path, String(v)]),
      previews[group]
    );
  };

  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle="Tokens · @korzun/design">
        <Stack gap="xxxxl">
          <Stack gap="sm">
            <Heading level={1}>Tokens</Heading>
            <Lead>
              {'Every theme value, as the current theme resolves it ('}
              <code>colorScheme: {theme.colorScheme}</code>
              {'). The '}
              <a href="#/guides/tokens" className={styles.link}>
                tokens guide
              </a>
              {' explains each group.'}
            </Lead>
          </Stack>

          {tokenGroups(theme).map((group) => (
            <Section key={group} title={group}>
              {body(group)}
            </Section>
          ))}
        </Stack>
      </Page>
    </div>
  );
}
