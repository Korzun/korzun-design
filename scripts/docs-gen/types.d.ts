export type PropRow = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  /** The `@default` is prose, not a value (`accepts numeric text`): shown as plain text, not code. */
  defaultProse?: boolean;
  description: string;
  deprecated?: boolean;
};

export type TypeTable = {
  name: string;
  kind: 'props' | 'object' | 'alias';
  rows: PropRow[];
  text?: string;
  /** The type's own JSDoc (on the interface or alias, not a prop), shown under its heading. */
  description?: string;
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
  /**
   * `mobile`: the demo and its overview thumbnail render at phone width (`@viewport mobile`).
   * `screen`: a full-height screen; the demo frame has a fixed height instead of sizing to fit (`@viewport screen`).
   * `desktop`: the overview thumbnail lays out at a desktop width and is scaled to fit, for a module hidden on phones (`@viewport desktop`).
   */
  viewport?: 'mobile' | 'screen' | 'desktop';
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
  /** `examples/preview.tsx`: the component alone, for the overview thumbnail; never on the component page or in the doc. */
  preview?: ExampleInfo;
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

export type Recipe = {
  /** Basename of `docs/recipes/<slug>.md`, and of its examples folder `recipes/<slug>/`. */
  slug: string;
  docPath: string;
  title: string;
  description: string;
  /** The doc's prose, with the H1 and the generated examples region stripped. */
  body: string;
  examples: ExampleInfo[];
};

export type SiteData = {
  version: string;
  modules: ModuleInfo[];
  guides: Guide[];
  recipes: Recipe[];
  changelog: { version: string; date: string; entries: ChangelogEntry[] }[];
  /** Type name -> slug of the module page that owns its table (the declaring module when several document it). */
  typePages: Record<string, string>;
};
