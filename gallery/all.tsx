import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { ReactElement } from 'react';
import { Link } from 'react-router';

import { resolveArgs, stories, storyTree, type StoryEntry, type StoryGroup } from './stories.js';

const useStyle = createUseStyles((theme: Theme) => ({
  sheet: { display: 'flex', flexDirection: 'column', gap: theme.space.xxxl },
  group: { display: 'flex', flexDirection: 'column', gap: theme.space.xl },
  story: { display: 'flex', flexDirection: 'column', gap: theme.space.md },
}));

type Leaf = { path: string[]; entries: StoryEntry[] };

// Flatten nested groups to one leaf per group that holds stories directly.
const leaves = (groups: StoryGroup[], prefix: string[] = []): Leaf[] =>
  groups.flatMap((group) => {
    const path = [...prefix, group.label];
    const entries = group.children.filter((c): c is StoryEntry => !('label' in c));
    const nested = group.children.filter((c): c is StoryGroup => 'label' in c);
    return [...(entries.length > 0 ? [{ path, entries }] : []), ...leaves(nested, path)];
  });

export const AllStories = (): ReactElement => {
  const styles = useStyle();
  return (
    <div className={styles.sheet}>
      <h1>All stories</h1>
      {leaves(storyTree(stories)).map(({ path, entries }) => (
        <div key={path.join('/')} className={styles.group}>
          <h2>{path.join(' / ')}</h2>
          {entries.map((entry) => {
            const Story = entry.component;
            return (
              <section key={entry.id} data-testid="sheet-story" className={styles.story}>
                <h3>{entry.name}</h3>
                {entry.sheet === false ? (
                  <Link to={`/story/${entry.id}`}>Open {entry.name}</Link>
                ) : (
                  <Story {...resolveArgs(entry, {}, () => {})} />
                )}
              </section>
            );
          })}
        </div>
      ))}
    </div>
  );
};
