import { Heading, Stack, Tag, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { MouseEvent, ReactNode } from 'react';
import { useLocation } from 'react-router';

import type { TypeTable } from '../../scripts/docs-gen/types.js';
import { Markdown } from './markdown.js';

/** The anchor id of a type's table on its component page. */
export const tableId = (name: string): string => name.toLowerCase();

export const useTableStyle = createUseStyles((theme: Theme) => ({
  // A wide table scrolls inside its own box instead of widening the page.
  scroll: {
    overflowX: 'auto',
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.color.bg.card,
  },
  table: {
    width: '100%',
    // On a phone the table keeps readable columns and scrolls sideways.
    minWidth: `calc(${theme.space.xxxxxl} * 20)`,
    borderCollapse: 'collapse',
    fontSize: theme.fontSize.sm,
    lineHeight: theme.lineHeight.body,
    '& th, & td': {
      padding: `${theme.space.lg} ${theme.space.xl}`,
      textAlign: 'left',
      verticalAlign: 'top',
      borderBottom: `1px solid ${theme.color.border.light}`,
    },
    '& tr:last-child td': { borderBottom: 0 },
    '& th': {
      fontWeight: theme.fontWeight.semibold,
      color: theme.color.text.secondary,
      backgroundColor: theme.color.bg.cardHeader,
      whiteSpace: 'nowrap',
    },
  },
  code: {
    fontFamily: theme.fontFamily.mono,
    overflowWrap: 'break-word',
  },
  name: { whiteSpace: 'nowrap' },
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
    fontFamily: theme.fontFamily.mono,
    fontSize: theme.fontSize.sm,
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

/** Type text in code, with each name that has its own table on the page linked to it. */
const TypeText = ({
  text,
  linkable,
  bare = false,
}: {
  text: string;
  linkable: Set<string>;
  /** Inside a `<code>` already: render the parts without a wrapper. */
  bare?: boolean;
}) => {
  const styles = useTableStyle();
  // The route already lives in the hash, so the anchor goes after it.
  const { pathname } = useLocation();
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(/[A-Za-z_$][\w$]*/g)) {
    if (!linkable.has(match[0])) continue;
    parts.push(text.slice(last, match.index));
    const id = tableId(match[0]);
    parts.push(
      <a
        key={match.index}
        href={`#${pathname}#${id}`}
        className={styles.link}
        onClick={(e) => scrollTo(e, id)}
      >
        {match[0]}
      </a>
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return bare ? <>{parts}</> : <code className={styles.code}>{parts}</code>;
};

export type PropsTableProps = {
  /** The table to render: a props or object type as rows, an alias as its declared text. */
  table: TypeTable;
  /** Every table on the page, so type names that have one link to it. */
  tables: TypeTable[];
  /** The doc the descriptions come from, for resolving their relative links. */
  from: string;
};

/** One generated type table, anchored by `id={name.toLowerCase()}`. */
export const PropsTable = ({ table, tables, from }: PropsTableProps) => {
  const styles = useTableStyle();
  const linkable = new Set(tables.filter((t) => t.name !== table.name).map((t) => t.name));
  const caption = (
    <Heading level={3} size="md" id={tableId(table.name)}>
      <code className={styles.code}>{table.name}</code>
    </Heading>
  );

  if (table.kind === 'alias')
    return (
      <Stack gap="md">
        {caption}
        <pre className={styles.alias}>
          <code>
            {`type ${table.name} = `}
            <TypeText text={table.text ?? ''} linkable={linkable} bare />
          </code>
        </pre>
      </Stack>
    );

  return (
    <Stack gap="md">
      {caption}
      <div className={styles.scroll}>
        <table className={styles.table} aria-label={table.name}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.name}>
                <td className={styles.name}>
                  <Stack gap="xs" align="start">
                    <code className={row.deprecated ? styles.deprecated : styles.code}>
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
                </td>
                <td>
                  <TypeText text={row.type} linkable={linkable} />
                </td>
                <td>
                  {row.default ? (
                    <code className={styles.code}>{row.default}</code>
                  ) : (
                    <Text tone="faint">–</Text>
                  )}
                </td>
                <td>
                  <Markdown source={row.description} from={from} inline />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
