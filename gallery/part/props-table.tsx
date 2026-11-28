import { Heading, Stack, Table, type TableColumn, Tag, Text } from '@korzun/design/component';
import { createUseStyles, type Theme, useTheme } from '@korzun/design/theme';
import cx from 'classnames';
import type { MouseEvent, ReactNode } from 'react';
import { useLocation } from 'react-router';

import { anchor } from '../../scripts/docs-gen/slug.mjs';
import type { PropRow, TypeTable } from '../../scripts/docs-gen/types.js';
import { codeBlock } from '../layout/type.js';
import { Markdown } from './markdown.js';

/** The anchor id of a type's table on its component page: the generator's, so doc links land on it. */
export const tableId = (name: string): string => anchor(name);

export const useTableStyle = createUseStyles((theme: Theme) => ({
  code: {
    fontFamily: theme.fontFamily.mono,
    overflowWrap: 'break-word',
  },
  // The prop name is what a reader scans for; the type beside it steps back.
  propName: { fontWeight: theme.fontWeight.semibold, color: theme.color.text.primary },
  // On a phone the required and deprecated tags sit beside the name on the shared line.
  nameStack: {
    [theme.breakpoint.mobile]: {
      '&&': { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    },
  },
  typeText: { color: theme.color.text.muted },
  // One member of a union: it wraps inside only when it is wider than the cell.
  member: { display: 'inline-block', maxWidth: '100%' },
  deprecated: { textDecoration: 'line-through' },
  link: {
    color: theme.color.brand.default,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
  alias: {
    margin: 0,
    padding: theme.space.xl,
    overflowX: 'auto',
    ...codeBlock(theme),
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.bg.cardHeader,
    whiteSpace: 'pre-wrap',
  },
}));

const scrollTo = (event: MouseEvent, id: string) => {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const OPEN = new Set(['(', '[', '{', '<']);
const CLOSE = new Set([')', ']', '}', '>']);

/**
 * The `[start, end)` ranges of a type's top-level union members: `a | (b | c)`
 * has two. Brackets, generics and quoted strings nest; the `>` of `=>` does not close.
 */
export const unionMembers = (text: string): [number, number][] => {
  const members: [number, number][] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
    } else if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (OPEN.has(ch)) depth++;
    else if (CLOSE.has(ch) && !(ch === '>' && text[i - 1] === '=')) depth = Math.max(0, depth - 1);
    else if (ch === '|' && depth === 0) {
      members.push([start, i]);
      start = i + 1;
    }
  }
  members.push([start, text.length]);
  // Keep the spaces around each `|` outside the members, where the line may break.
  return members
    .map(([s, e]): [number, number] => {
      while (s < e && text[s] === ' ') s++;
      while (e > s && text[e - 1] === ' ') e--;
      return [s, e];
    })
    .filter(([s, e]) => e > s);
};

/**
 * Type text in code, with each name that has its own table linked to it: on
 * this page (`linkable`) or, failing that, on another module's page (`typePages`).
 * A union's members each hold together, so a long union wraps between members.
 */
const TypeText = ({
  text,
  linkable,
  typePages,
  self,
  bare = false,
  className,
}: {
  text: string;
  linkable: Set<string>;
  typePages: ReadonlyMap<string, string>;
  /** The table this text sits in: a recursive type does not link to itself. */
  self: string;
  /** Inside a `<code>` already: render the parts without a wrapper. */
  bare?: boolean;
  /** Extra class on the `<code>`. */
  className?: string;
}) => {
  const styles = useTableStyle();
  // The route already lives in the hash, so the anchor goes after it.
  const { pathname } = useLocation();

  // `text.slice(from, to)` with its linkable names as links.
  const linked = (from: number, to: number): ReactNode[] => {
    const parts: ReactNode[] = [];
    const run = text.slice(from, to);
    let last = 0;
    for (const match of run.matchAll(/[A-Za-z_$][\w$]*/g)) {
      const here = linkable.has(match[0]);
      const page = typePages.get(match[0]);
      if (match[0] === self || (!here && !page)) continue;
      parts.push(run.slice(last, match.index));
      const id = tableId(match[0]);
      const key = from + match.index;
      parts.push(
        here ? (
          <a
            key={key}
            href={`#${pathname}#${id}`}
            className={styles.link}
            onClick={(e) => scrollTo(e, id)}
          >
            {match[0]}
          </a>
        ) : (
          // Another page: the router navigates and the page scrolls to the hash.
          <a key={key} href={`#/components/${page}#${id}`} className={styles.link}>
            {match[0]}
          </a>
        )
      );
      last = match.index + match[0].length;
    }
    parts.push(run.slice(last));
    return parts;
  };

  const members = unionMembers(text);
  let parts: ReactNode[];
  if (members.length < 2) parts = linked(0, text.length);
  else {
    parts = [text.slice(0, members[0]![0])];
    members.forEach(([start, end], i) => {
      parts.push(
        <span key={`m${start}`} className={styles.member}>
          {linked(start, end)}
        </span>,
        text.slice(end, members[i + 1]?.[0] ?? text.length)
      );
    });
  }
  return bare ? <>{parts}</> : <code className={cx(styles.code, className)}>{parts}</code>;
};

export type PropsTableProps = {
  /** The table to render: a props or object type as rows, an alias as its declared text. */
  table: TypeTable;
  /** Every table on the page, so type names that have one link to it. */
  tables: TypeTable[];
  /** Type name -> slug of the module page that has its table, for types documented elsewhere. */
  typePages?: ReadonlyMap<string, string>;
  /** The doc the descriptions come from, for resolving their relative links. */
  from: string;
};

const NO_PAGES: ReadonlyMap<string, string> = new Map();

/** One generated type table, anchored by `id={tableId(name)}`. */
export const PropsTable = ({ table, tables, typePages = NO_PAGES, from }: PropsTableProps) => {
  const styles = useTableStyle();
  const linkable = new Set(tables.filter((t) => t.name !== table.name).map((t) => t.name));
  const theme = useTheme();
  // On a wide screen the table keeps readable columns and scrolls sideways.
  const minWidth = `calc(${theme.space.xxxxxl} * 20)`;
  const columns: TableColumn<PropRow>[] = [
    {
      key: 'name',
      title: 'Name',
      label: false,
      nowrap: true,
      render: (row) => (
        <Stack gap="xs" align="start" className={styles.nameStack}>
          <code className={cx(styles.code, styles.propName, row.deprecated && styles.deprecated)}>
            {row.name}
          </code>
          {row.required && (
            <Tag tone="warning" size="sm">
              required
            </Tag>
          )}
          {row.deprecated && (
            <Tag tone="neutral" size="sm">
              deprecated
            </Tag>
          )}
        </Stack>
      ),
    },
    {
      key: 'type',
      title: 'Type',
      width: '35%',
      render: (row) => (
        <TypeText
          text={row.type}
          linkable={linkable}
          typePages={typePages}
          self={table.name}
          className={styles.typeText}
        />
      ),
    },
    {
      key: 'default',
      title: 'Default',
      width: '10%',
      render: (row) =>
        row.default && row.defaultProse ? (
          <Text>{row.default}</Text>
        ) : row.default ? (
          <code className={styles.code}>{row.default}</code>
        ) : (
          <Text tone="muted">–</Text>
        ),
    },
    {
      key: 'description',
      title: 'Description',
      label: false,
      wide: true,
      render: (row) => <Markdown source={row.description} from={from} inline />,
    },
  ];
  const caption = (
    <>
      <Heading level={3} id={tableId(table.name)}>
        <code className={styles.code}>{table.name}</code>
      </Heading>
      {/* The type's own JSDoc, so a note written on the interface is not lost. */}
      {table.description && <Markdown source={table.description} from={from} />}
    </>
  );

  if (table.kind === 'alias')
    return (
      <Stack gap="md">
        {caption}
        <pre className={styles.alias}>
          <code>
            {`type ${table.name} = `}
            <TypeText
              text={table.text ?? ''}
              linkable={linkable}
              typePages={typePages}
              self={table.name}
              bare
            />
          </code>
        </pre>
      </Stack>
    );

  return (
    <Stack gap="md">
      {caption}
      <Table
        ariaLabel={table.name}
        rowKey="name"
        columns={columns}
        rows={table.rows}
        minWidth={minWidth}
      />
      {table.extends && table.extends.length > 0 && (
        <Text as="p" size="sm" tone="description">
          {'Also accepts: '}
          {table.extends.map((name, i) => (
            <span key={name}>
              {i > 0 && ', '}
              <code className={styles.code}>{name}</code>
            </span>
          ))}
          .
        </Text>
      )}
    </Stack>
  );
};
