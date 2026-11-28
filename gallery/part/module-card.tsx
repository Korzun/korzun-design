import { Card, Heading, Space, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Link } from 'react-router';

import type { ModuleInfo } from '../../scripts/docs-gen/types.js';
import { moduleBySlug, moduleOwner } from '../data.js';
import { Markdown } from './markdown.js';
import { Thumbnail } from './thumbnail.js';

const useStyle = createUseStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
    gap: theme.space.xl,
    // On a phone the cards are a list: a full-width thumbnail per card ran the
    // page past 12,000px with its text scaled to 7px.
    [theme.breakpoint.mobile]: { gap: theme.space.md },
  },
  // A phone row: a small thumbnail beside the name and description.
  cardText: {
    minWidth: 0,
    // An extra xs between the preview and the title, on top of the card's md gap.
    paddingTop: theme.space.xs,
    // On a phone the text sits beside the thumbnail, so it lines up with its top.
    [theme.breakpoint.mobile]: { paddingTop: 0 },
  },
  cardBody: {
    // Doubled, to win over Space's own column direction.
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

/**
 * A module's card: its preview, name and description, linking to its page. A
 * nested module (categories.mjs) names its parent first unless `showParent` is
 * false, as on the parent's own page.
 */
export const ModuleCard = ({
  mod,
  showParent = true,
}: {
  mod: ModuleInfo;
  showParent?: boolean;
}) => {
  const styles = useStyle();
  const parent = showParent && mod.parent ? moduleBySlug(mod.parent) : undefined;
  return (
    <Link to={`/components/${mod.slug}`} className={styles.card}>
      <Card>
        <Space direction="vertical" gap="md" className={styles.cardBody}>
          <Thumbnail owner={moduleOwner(mod)} compact />
          <Space direction="vertical" gap="xs" className={styles.cardText}>
            {parent && (
              <Text size="sm" tone="muted">
                {parent.title} /
              </Text>
            )}
            <Heading level={3} size="md">
              {mod.title}
            </Heading>
            {/* Inline markdown (code spans), with links as text: the card is a link already. */}
            <Text size="sm" tone="description">
              <Markdown source={mod.description} from={mod.docPath} inline links={false} />
            </Text>
          </Space>
        </Space>
      </Card>
    </Link>
  );
};

/** Module cards in a grid: four to a row on a wide screen, a list on a phone. */
export const ModuleGrid = ({ mods, showParent }: { mods: ModuleInfo[]; showParent?: boolean }) => {
  const styles = useStyle();
  return (
    <div className={styles.grid}>
      {mods.map((mod) => (
        <ModuleCard key={mod.slug} mod={mod} showParent={showParent} />
      ))}
    </div>
  );
};
