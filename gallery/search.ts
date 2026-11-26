import type { ModuleInfo } from '../scripts/docs-gen/types.js';

const haystack = (mod: ModuleInfo): string[] => [
  mod.title,
  mod.description,
  mod.category,
  ...mod.values,
  ...mod.tables.filter((t) => t.kind === 'props').flatMap((t) => t.rows.map((r) => r.name)),
];

/**
 * The overview's search: a trimmed, case-insensitive substring match over each
 * module's title, description, category, exported values and prop names.
 */
export const filterModules = (modules: ModuleInfo[], query: string): ModuleInfo[] => {
  const needle = query.trim().toLowerCase();
  if (needle === '') return modules;
  return modules.filter((mod) => haystack(mod).some((s) => s.toLowerCase().includes(needle)));
};
