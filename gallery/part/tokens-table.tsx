import { Inline, Text } from '@korzun/design/component';
import { createUseStyles, darkTheme, lightTheme, type Theme } from '@korzun/design/theme';
import cx from 'classnames';

import type { TokenRow } from '../../scripts/docs-gen/types.js';
import { useTableStyle } from './props-table.js';

const useStyle = createUseStyles((theme: Theme) => ({
  swatch: {
    display: 'block',
    width: theme.space.xl,
    height: theme.space.xl,
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.color.border.strong}`,
  },
  // A light swatch sits on the light page colour and a dark one on the dark,
  // so a translucent token reads as it does in that mode.
  backdrop: { flexShrink: 0, borderRadius: theme.radius.sm },
  onLight: { backgroundColor: lightTheme.color.bg.page },
  onDark: { backgroundColor: darkTheme.color.bg.page },
  link: {
    color: theme.color.brand.default,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
}));

const Value = ({
  value,
  color,
  mode,
}: {
  value: string | null;
  color: boolean;
  mode: 'light' | 'dark';
}) => {
  const styles = useStyle();
  const table = useTableStyle();
  if (value === null) return <Text tone="faint">–</Text>;
  return (
    <Inline gap="sm" align="center" wrap={false}>
      {color && (
        <span className={cx(styles.backdrop, mode === 'light' ? styles.onLight : styles.onDark)}>
          {/* The token's value is data, so it is the one inline style. */}
          <span className={styles.swatch} style={{ backgroundColor: value }} />
        </span>
      )}
      <code className={table.code}>{value}</code>
    </Inline>
  );
};

/** The style properties a recipe sets (the same keys in both modes). */
const recipeKeys = (path: string): string[] => {
  let cur: unknown = lightTheme;
  for (const key of path.split('.')) {
    cur = cur && typeof cur === 'object' ? (cur as Record<string, unknown>)[key] : undefined;
  }
  return cur && typeof cur === 'object' ? Object.keys(cur) : [];
};

/**
 * A recipe is a style fragment spread into a class, not one value: it links to
 * the tokens guide and lists the properties it sets, across both mode columns.
 */
const Recipe = ({ path }: { path: string }) => {
  const styles = useStyle();
  const table = useTableStyle();
  const keys = recipeKeys(path);
  return (
    <Text size="sm">
      <a href="#/guides/tokens#recipe" className={styles.link}>
        recipe
      </a>
      {keys.length > 0 && ' setting '}
      {keys.map((key, i) => (
        <span key={key}>
          {i > 0 && ', '}
          <code className={table.code}>{key}</code>
        </span>
      ))}
    </Text>
  );
};

export type TokensTableProps = {
  /** The theme tokens the component reads, with their resolved values. */
  tokens: TokenRow[];
};

/** The design tokens a component uses: path, light value and dark value, swatches for colours. */
export const TokensTable = ({ tokens }: TokensTableProps) => {
  const table = useTableStyle();
  return (
    <div className={table.scroll}>
      <table className={table.table} aria-label="Tokens">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Light</th>
            <th scope="col">Dark</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.path}>
              <td>
                <code className={table.code}>{`theme.${token.path}`}</code>
              </td>
              {token.kind === 'recipe' ? (
                <td colSpan={2}>
                  <Recipe path={token.path} />
                </td>
              ) : (
                <>
                  <td>
                    <Value value={token.light} color={token.kind === 'color'} mode="light" />
                  </td>
                  <td>
                    <Value value={token.dark} color={token.kind === 'color'} mode="dark" />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
