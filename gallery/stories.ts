import type { ReactElement } from 'react';

import { restoreClearedArgs } from './messages.js';
import type { ArgType } from './story.js';

export type StoryEntry = {
  id: string;
  title: string;
  path: string[];
  name: string;
  component: (args: Record<string, unknown>) => ReactElement;
  args: Record<string, unknown>;
  argTypes: Record<string, ArgType>;
  sheet: boolean;
};

export type StoryGroup = { label: string; children: (StoryGroup | StoryEntry)[] };

export const toKebab = (s: string): string =>
  s
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type StoryFn = StoryEntry['component'] & {
  storyName?: string;
  args?: Record<string, unknown>;
  argTypes?: Record<string, ArgType>;
};

type DefaultExport = {
  title: string;
  args?: Record<string, unknown>;
  argTypes?: Record<string, ArgType>;
  sheet?: boolean;
};

export const collectStories = (modules: Record<string, unknown>): StoryEntry[] => {
  const entries: StoryEntry[] = [];
  const seen = new Set<string>();

  for (const [file, mod] of Object.entries(modules)) {
    const { default: meta, ...exports } = mod as { default?: DefaultExport } & Record<
      string,
      unknown
    >;
    if (!meta || typeof meta.title !== 'string') {
      throw new Error(`Story file ${file}: default export needs a string title`);
    }
    const path = meta.title.split('/').map((segment) => segment.trim());
    for (const [exportName, value] of Object.entries(exports)) {
      if (typeof value !== 'function')
        throw new Error(`Story file ${file}: export ${exportName} is not a story`);
      const story = value as StoryFn;
      const id = [...path.map(toKebab), toKebab(exportName)].join('/');
      if (seen.has(id)) throw new Error(`Duplicate story id ${id}`);
      seen.add(id);
      entries.push({
        id,
        title: meta.title,
        path,
        name: story.storyName ?? toKebab(exportName).split('-').map(capitalize).join(' '),
        component: story,
        args: { ...meta.args, ...story.args },
        argTypes: { ...meta.argTypes, ...story.argTypes },
        sheet: meta.sheet ?? true,
      });
    }
  }

  return entries.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
};

export const stories: StoryEntry[] = collectStories(
  import.meta.glob('../src/**/*.stories.tsx', { eager: true })
);

export const storyById = (id: string): StoryEntry | undefined => stories.find((s) => s.id === id);

export const resolveArgs = (
  entry: StoryEntry,
  overrides: Record<string, unknown>,
  onAction: (name: string, args: unknown[]) => void
): Record<string, unknown> => {
  const args: Record<string, unknown> = { ...entry.args, ...restoreClearedArgs(overrides) };
  for (const [key, type] of Object.entries(entry.argTypes)) {
    if (type.control === 'action') args[key] = (...a: unknown[]) => onAction(key, a);
  }
  return args;
};

export const storyTree = (entries: StoryEntry[]): StoryGroup[] => {
  const root: StoryGroup = { label: '', children: [] };
  for (const entry of entries) {
    let group = root;
    for (const label of entry.path) {
      let next = group.children.find((c): c is StoryGroup => 'label' in c && c.label === label);
      if (!next) {
        next = { label, children: [] };
        group.children.push(next);
      }
      group = next;
    }
    group.children.push(entry);
  }
  const sort = (group: StoryGroup) => {
    const groups = group.children
      .filter((c): c is StoryGroup => 'label' in c)
      .sort((a, b) => a.label.localeCompare(b.label));
    groups.forEach(sort);
    group.children = [...groups, ...group.children.filter((c): c is StoryEntry => !('label' in c))];
  };
  sort(root);
  return root.children as StoryGroup[];
};
