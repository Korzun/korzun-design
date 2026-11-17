import { stories, storyTree, toKebab, type StoryEntry, type StoryGroup } from '@gallery/stories';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useState, type ReactElement } from 'react';
import { NavLink, useLocation, useSearchParams } from 'react-router';

import { CollapsibleSection } from '../../src/component/collapsible-section/index.js';
import { TextInput } from '../../src/control/text-input/index.js';

const useStyle = createUseStyles((theme: Theme) => ({
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space.md,
    width: 240,
    padding: theme.space.xxl,
    borderRight: `1px solid ${theme.color.border.default}`,
    flexShrink: 0,
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  brand: { fontWeight: theme.fontWeight.bold, marginBottom: theme.space.xl },
  search: { display: 'flex', flexDirection: 'column', gap: theme.space.sm },
  searchLabel: { color: theme.color.text.secondary },
  tree: { display: 'flex', flexDirection: 'column', gap: theme.space.sm, flex: 1 },
  nested: { paddingLeft: theme.space.xl },
  footer: { display: 'flex', flexDirection: 'column', gap: theme.space.md },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  link: {
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: `${theme.space.md} ${theme.space.xl}`,
    borderRadius: theme.radius.md,
    color: theme.color.text.secondary,
    textDecoration: 'none',
    '&:hover': { backgroundColor: theme.color.bg.hover },
  },
  active: { backgroundColor: theme.color.bg.selected, color: theme.color.text.primary },
}));

const isGroup = (node: StoryGroup | StoryEntry): node is StoryGroup => 'label' in node;

export const Sidebar = ({ entries = stories }: { entries?: StoryEntry[] }): ReactElement => {
  const styles = useStyle();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const activeId = pathname.startsWith('/story/') ? pathname.slice('/story/'.length) : '';
  const needle = search.trim().toLowerCase();
  const filtered = needle
    ? entries.filter((e) => `${e.title} / ${e.name}`.toLowerCase().includes(needle))
    : entries;

  // The width preset carries over between stories; args and theme do not.
  const width = params.get('width');
  const storyQuery = width ? `?${new URLSearchParams({ width }).toString()}` : '';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  const renderNode = (node: StoryGroup | StoryEntry, prefix: string): ReactElement => {
    if (!isGroup(node)) {
      return (
        <li key={node.id}>
          <NavLink to={`/story/${node.id}${storyQuery}`} className={linkClass}>
            {node.name}
          </NavLink>
        </li>
      );
    }
    const groupId = prefix ? `${prefix}/${toKebab(node.label)}` : toKebab(node.label);
    const forced = needle !== '' || activeId.startsWith(`${groupId}/`);
    return (
      <CollapsibleSection
        key={groupId}
        title={node.label}
        open={forced || (toggled[groupId] ?? false)}
        onOpenToggle={() => setToggled((prev) => ({ ...prev, [groupId]: !prev[groupId] }))}
      >
        <div className={styles.nested}>
          <ul className={styles.list}>
            {node.children.filter((c) => !isGroup(c)).map((c) => renderNode(c, groupId))}
          </ul>
          {node.children.filter(isGroup).map((c) => renderNode(c, groupId))}
        </div>
      </CollapsibleSection>
    );
  };

  return (
    <nav aria-label="Stories" className={styles.sidebar}>
      <div className={styles.brand}>@korzun/design</div>
      {/* TextInput does not tie its label to the input (no htmlFor); this outer label names it. */}
      <label className={styles.search}>
        <span className={styles.searchLabel}>Search</span>
        <TextInput
          name="search"
          placeholder="Search stories"
          layout="inline"
          value={search}
          onChange={(v) => setSearch(v ?? '')}
        />
      </label>
      <div className={styles.tree}>{storyTree(filtered).map((g) => renderNode(g, ''))}</div>
      <div className={styles.footer}>
        <NavLink to="/all" className={linkClass}>
          All
        </NavLink>
        <NavLink to="/tokens" className={linkClass}>
          Tokens
        </NavLink>
      </div>
    </nav>
  );
};
