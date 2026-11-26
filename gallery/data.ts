import type { ComponentType } from 'react';

import type { ExampleInfo, ModuleInfo, SiteData } from '../scripts/docs-gen/types.js';
import generated from './generated/site-data.json';

export const siteData: SiteData = generated as SiteData;

// Keyed by repo-relative file, the same string `ExampleInfo.file` carries.
export const exampleComponents: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(
    import.meta.glob<ComponentType>('../src/**/examples/*.tsx', { eager: true, import: 'default' })
  ).map(([path, component]) => [path.replace(/^\.\.\//, ''), component])
);

export const moduleBySlug = (slug: string): ModuleInfo | undefined =>
  siteData.modules.find((m) => m.slug === slug);

export const exampleFor = (
  mod: ModuleInfo,
  slug: string
): { info: ExampleInfo; Component: ComponentType } | undefined => {
  const info = mod.examples.find((e) => e.slug === slug);
  const Component = info && exampleComponents[info.file];
  return info && Component ? { info, Component } : undefined;
};
