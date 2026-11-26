import { Heading, Page, Stack, Text } from '@korzun/design/component';
import { createUseStyles, useTheme, type Theme } from '@korzun/design/theme';
import type { ReactNode } from 'react';

import { siteColumn } from '../layout/column.js';

const useStyle = createUseStyles((theme: Theme) => ({
  // The shared site column, like the overview and component pages.
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
  section: { display: 'flex', flexDirection: 'column', gap: theme.space.xl },
  link: {
    color: theme.color.brand.default,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
  group: { margin: 0, fontSize: theme.fontSize.md, color: theme.color.text.muted },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: theme.space.xl,
  },
  swatch: { display: 'flex', flexDirection: 'column', gap: theme.space.xs },
  chip: {
    height: 44,
    // Swatches and shadow boxes are tiles on the page background.
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.color.border.default}`,
  },
  path: { fontSize: theme.fontSize.xs, color: theme.color.text.muted, wordBreak: 'break-all' },
  row: { display: 'flex', alignItems: 'center', gap: theme.space.xl, fontSize: theme.fontSize.md },
  key: { width: 160, flexShrink: 0, fontFamily: theme.fontFamily.mono },
  value: { color: theme.color.text.muted, fontFamily: theme.fontFamily.mono },
  bar: { height: 12, backgroundColor: theme.color.brand.default },
  box: {
    height: 64,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.bg.card,
  },
  boxes: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: theme.space.xxxl,
  },
}));

type Node = { [key: string]: Node | string | number };

const isNode = (value: unknown): value is Node => typeof value === 'object' && value !== null;

/** Flattens a nested token object to `[path, leafValue]` pairs. */
const leaves = (node: Node, prefix: string): [string, string | number][] =>
  Object.entries(node).flatMap(([key, value]) =>
    isNode(value) ? leaves(value, `${prefix}.${key}`) : [[`${prefix}.${key}`, value]]
  );

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  const styles = useStyle();
  return (
    <section className={styles.section}>
      <Heading level={2}>{title}</Heading>
      {children}
    </section>
  );
};

export function TokensPage() {
  const styles = useStyle();
  const theme = useTheme();

  const rows = (name: keyof Theme, render?: (key: string, value: string) => ReactNode) =>
    leaves(theme[name] as unknown as Node, name).map(([path, value]) => (
      <div key={path} className={styles.row}>
        <span className={styles.key}>{path}</span>
        {render?.(path, String(value))}
        <span className={styles.value}>{String(value)}</span>
      </div>
    ));

  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle="Tokens · @korzun/design">
        <Stack gap="xxxxl">
          <Stack gap="sm">
            <Heading level={1}>Tokens</Heading>
            <Text as="p" size="lg" tone="description">
              {'Every theme value, as the current theme resolves it ('}
              <code>colorScheme: {theme.colorScheme}</code>
              {'). The '}
              <a href="#/guides/tokens" className={styles.link}>
                tokens guide
              </a>
              {' explains each group.'}
            </Text>
          </Stack>

          <Section title="color">
            {Object.entries(theme.color).map(([group, value]) => (
              <div key={group}>
                <h3 className={styles.group}>color.{group}</h3>
                <div className={styles.grid}>
                  {leaves(value as Node, `color.${group}`).map(([path, color]) => (
                    <div key={path} className={styles.swatch}>
                      <div className={styles.chip} style={{ background: String(color) }} />
                      <span className={styles.path}>{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>

          <Section title="space">
            {rows('space', (_, v) => (
              <div className={styles.bar} style={{ width: v }} />
            ))}
          </Section>

          <Section title="radius">
            {rows('radius', (_, v) => (
              <div className={styles.bar} style={{ width: 48, height: 32, borderRadius: v }} />
            ))}
          </Section>

          <Section title="fontSize">
            {rows('fontSize', (_, v) => (
              <span style={{ fontSize: v }}>The quick brown fox</span>
            ))}
          </Section>

          <Section title="layout">{rows('layout')}</Section>
          <Section title="zIndex">{rows('zIndex')}</Section>
          <Section title="transition">{rows('transition')}</Section>

          <Section title="shadow">
            <div className={styles.boxes}>
              {Object.entries(theme.shadow).map(([key, value]) => (
                <div key={key}>
                  <div className={styles.box} style={{ boxShadow: value }} />
                  <span className={styles.path}>shadow.{key}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="breakpoint">{rows('breakpoint')}</Section>

          <Section title="recipe">
            {Object.entries(theme.recipe).map(([name, recipe]) => (
              <div key={name} className={styles.row}>
                <span className={styles.key}>recipe.{name}</span>
                <span className={styles.value}>{Object.keys(recipe).join(', ')}</span>
              </div>
            ))}
          </Section>
        </Stack>
      </Page>
    </div>
  );
}
