import type { ModuleInfo } from '../scripts/docs-gen/types.js';
import { siteData } from './data.js';
import { filterModules } from './search.js';

const mod = (over: Partial<ModuleInfo>): ModuleInfo => ({
  id: 'x',
  slug: 'x',
  entry: 'component',
  docPath: 'docs/component/x.md',
  title: 'X',
  description: '',
  category: 'Layout',
  values: [],
  types: [],
  importLine: '',
  body: '',
  examples: [],
  tables: [],
  tokens: [],
  changelog: [],
  ...over,
});

const slugs = (modules: ModuleInfo[]) => modules.map((m) => m.slug);

describe('filterModules', () => {
  it('matches the title case-insensitively', () => {
    expect(slugs(filterModules(siteData.modules, 'BUTTON'))).toContain('button');
  });

  it('matches a prop name of a props table', () => {
    expect(slugs(filterModules(siteData.modules, 'loading'))).toContain('button');
    const withProp = mod({
      slug: 'p',
      tables: [
        {
          name: 'PProps',
          kind: 'props',
          rows: [{ name: 'zebraMode', type: 'boolean', required: false, description: '' }],
        },
      ],
    });
    const withAlias = mod({
      slug: 'a',
      tables: [
        {
          name: 'AValue',
          kind: 'object',
          rows: [{ name: 'zebraMode', type: 'boolean', required: false, description: '' }],
        },
      ],
    });
    expect(slugs(filterModules([withProp, withAlias], 'zebramode'))).toEqual(['p']);
  });

  it('matches description, category and value names', () => {
    const modules = [
      mod({ slug: 'd', description: 'A striped thing' }),
      mod({ slug: 'c', category: 'Feedback' }),
      mod({ slug: 'v', values: ['useZebra'] }),
    ];
    expect(slugs(filterModules(modules, 'striped'))).toEqual(['d']);
    expect(slugs(filterModules(modules, 'feedback'))).toEqual(['c']);
    expect(slugs(filterModules(modules, 'usezebra'))).toEqual(['v']);
  });

  it('returns nothing for a query that matches nothing', () => {
    expect(filterModules(siteData.modules, 'zzz')).toEqual([]);
  });

  it('returns every module for a blank query', () => {
    expect(filterModules(siteData.modules, '  ')).toEqual(siteData.modules);
  });
});
