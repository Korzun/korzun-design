export type PropRow = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
  deprecated?: boolean;
};

export type TypeTable = {
  name: string;
  kind: 'props' | 'object' | 'alias';
  rows: PropRow[];
  text?: string;
  /** External types left out of `rows` (React/DOM props the type also accepts). */
  extends?: string[];
};

export type TokenRow = {
  path: string;
  kind: 'color' | 'recipe' | 'value';
  light: string | null;
  dark: string | null;
};

export type ChangelogEntry = {
  version: string;
  date: string;
  tags: string[];
  text: string;
};

export type ExampleInfo = {
  file: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  code: string;
};

export type ModuleInfo = {
  id: string;
  slug: string;
  entry: string;
  docPath: string;
  title: string;
  description: string;
  category: string;
  values: string[];
  types: string[];
  importLine: string;
  body: string;
  examples: ExampleInfo[];
  tables: TypeTable[];
  tokens: TokenRow[];
  changelog: ChangelogEntry[];
};

export type Guide = {
  slug: string;
  docPath: string;
  title: string;
  description: string;
  body: string;
};

export type SiteData = {
  version: string;
  modules: ModuleInfo[];
  guides: Guide[];
  changelog: { version: string; date: string; entries: ChangelogEntry[] }[];
};
