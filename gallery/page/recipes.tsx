import { Card, Heading, Page, Stack, Text } from '@korzun/design/component';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { Link, useParams } from 'react-router';

import type { Recipe } from '../../scripts/docs-gen/types.js';
import { recipeBySlug, recipeOwner, siteData } from '../data.js';
import { siteColumn } from '../layout/column.js';
import { useScrollToHash } from '../layout/scroll.js';
import { NotFound } from '../not-found.js';
import { ExampleBlock } from '../part/example-block.js';
import { Markdown } from '../part/markdown.js';
import { Thumbnail } from '../part/thumbnail.js';

const useStyle = createUseStyles((theme: Theme) => ({
  column: {
    ...siteColumn(theme),
    paddingTop: theme.space.xxxxxl,
    paddingBottom: theme.space.xxxxxl,
  },
  // The overview's card grid: a recipe card reads like a component card.
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
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

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const styles = useStyle();
  return (
    <Link to={`/recipes/${recipe.slug}`} className={styles.card}>
      <Card>
        <Stack gap="md">
          <Thumbnail owner={recipeOwner(recipe)} />
          <Stack gap="xs">
            <Heading level={2} size="md">
              {recipe.title}
            </Heading>
            {/* Inline markdown (code spans), with links as text: the card is a link already. */}
            <Text size="sm" tone="description">
              <Markdown source={recipe.description} from={recipe.docPath} inline links={false} />
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
};

/** `#/recipes`: every recipe as a card with a live thumbnail. */
export const RecipesPage = () => {
  const styles = useStyle();
  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle="Recipes · @korzun/design">
        <Stack gap="xxxl">
          <Stack gap="sm">
            <Heading level={1}>Recipes</Heading>
            <Text as="p" size="lg" tone="description">
              Library parts put together for one job: a whole screen or a common group, live and
              ready to copy.
            </Text>
          </Stack>
          <div className={styles.grid}>
            {siteData.recipes.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </Stack>
      </Page>
    </div>
  );
};

/** `#/recipes/<slug>`: a recipe's live examples, then its prose. */
export const RecipePage = () => {
  const styles = useStyle();
  const { slug } = useParams();
  useScrollToHash();
  const recipe = slug === undefined ? undefined : recipeBySlug(slug);
  if (!recipe) return <NotFound />;
  const owner = recipeOwner(recipe);
  return (
    <div className={styles.column}>
      <Page type="minimal" documentTitle={`${recipe.title} · @korzun/design`}>
        <Stack gap="xxxl">
          <Stack gap="sm">
            <Heading level={1}>{recipe.title}</Heading>
            <Text as="p" size="lg" tone="description">
              {recipe.description}
            </Text>
          </Stack>
          {recipe.examples.map((example) => (
            <ExampleBlock key={example.slug} owner={owner} example={example} />
          ))}
          <Markdown source={recipe.body} from={recipe.docPath} />
        </Stack>
      </Page>
    </div>
  );
};
