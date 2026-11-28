import type { ComponentType } from 'react';

import type { ExampleInfo, ModuleInfo, Recipe, SiteData } from '../scripts/docs-gen/types.js';
import generated from './generated/site-data.json';

export const siteData: SiteData = generated as SiteData;

// Keyed by repo-relative file, the same string `ExampleInfo.file` carries:
// module examples (`src/…/examples/NN-x.tsx`) and recipe examples (`recipes/<slug>/NN-x.tsx`).
export const exampleComponents: Record<string, ComponentType> = Object.fromEntries(
  Object.entries({
    ...import.meta.glob<ComponentType>('../src/**/examples/*.tsx', {
      eager: true,
      import: 'default',
    }),
    ...import.meta.glob<ComponentType>('../recipes/*/*.tsx', { eager: true, import: 'default' }),
  }).map(([path, component]) => [path.replace(/^\.\.\//, ''), component])
);

/**
 * What owns a set of examples: a module or a recipe. `framePath` is the part of
 * the frame route before the example slug (`button`, `recipe/login`), so the two
 * namespaces never collide.
 */
export type ExampleOwner = {
  title: string;
  docPath: string;
  examples: ExampleInfo[];
  /** A module's `examples/preview.tsx`: its overview thumbnail, never listed among `examples`. */
  preview?: ExampleInfo;
  framePath: string;
};

export const moduleOwner = (m: ModuleInfo): ExampleOwner => ({
  title: m.title,
  docPath: m.docPath,
  examples: m.examples,
  ...(m.preview ? { preview: m.preview } : {}),
  framePath: m.slug,
});

export const recipeOwner = (r: Recipe): ExampleOwner => ({
  title: r.title,
  docPath: r.docPath,
  examples: r.examples,
  framePath: `recipe/${r.slug}`,
});

export const recipeBySlug = (slug: string): Recipe | undefined =>
  siteData.recipes.find((r) => r.slug === slug);

export const moduleBySlug = (slug: string): ModuleInfo | undefined =>
  siteData.modules.find((m) => m.slug === slug);

/** The modules nested under `mod` in categories.mjs (`page` has the Page action bars), in order. */
export const childrenOf = (mod: ModuleInfo): ModuleInfo[] =>
  siteData.modules.filter((m) => m.parent === mod.slug);

export const exampleFor = (
  mod: { examples: ExampleInfo[]; preview?: ExampleInfo },
  slug: string
): { info: ExampleInfo; Component: ComponentType } | undefined => {
  const info = slug === mod.preview?.slug ? mod.preview : mod.examples.find((e) => e.slug === slug);
  const Component = info && exampleComponents[info.file];
  return info && Component ? { info, Component } : undefined;
};

/**
 * Type name -> slug of the module page that owns its table, so other pages
 * link to it. The generator picks the declaring module when several document one.
 */
export const typePages: ReadonlyMap<string, string> = new Map(
  Object.entries(siteData.typePages ?? {})
);
