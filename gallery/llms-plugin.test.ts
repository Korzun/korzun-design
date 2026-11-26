import { CATEGORIES } from '../scripts/docs-gen/categories.mjs';
import { siteData } from './data.js';
import { buildLlmsFull, buildLlmsTxt } from './llms-plugin.js';

const site = 'https://example.test/design/';

describe('buildLlmsTxt', () => {
  const text = buildLlmsTxt(siteData, site);
  const section = (title: string) => {
    const start = text.indexOf(`\n## ${title}\n`);
    expect(start).toBeGreaterThan(-1);
    const end = text.indexOf('\n## ', start + 1);
    return text.slice(start, end === -1 ? undefined : end);
  };

  it('opens with the title and a summary written for absolute links', () => {
    const [title, blank, summary] = text.split('\n');
    expect(title).toBe('# @korzun/design');
    expect(blank).toBe('');
    expect(summary).toMatch(/^> @korzun\/design is a React 19 \+ react-jss UI component library\./);
    expect(summary).toContain('not in your training data');
    expect(summary).toContain(`(${site}llms-full.txt)`);
    expect(summary).not.toMatch(/node_modules|relative to this file/);
  });

  it('links AGENTS.md first, under Start here', () => {
    expect(section('Start here')).toContain(
      `- [Rules for coding agents](${site}AGENTS.md): setup, imports and the rules every screen must follow`
    );
  });

  it('lists Button under Actions with its doc link and description', () => {
    const button = siteData.modules.find((m) => m.slug === 'button')!;
    expect(section('Actions')).toContain(
      `- [Button](${site}docs/control/button.md): ${button.description}`
    );
  });

  it('orders Start here, the categories by the closed list, then Guides, Recipes and Optional', () => {
    const headings = text.split('\n').filter((l) => l.startsWith('## '));
    const present = CATEGORIES.filter((c) => siteData.modules.some((m) => m.category === c));
    expect(headings).toEqual(
      ['Start here', ...present, 'Guides', 'Recipes', 'Optional'].map((title) => `## ${title}`)
    );
  });

  it('lists every recipe with its doc link and description', () => {
    expect(siteData.recipes.length).toBeGreaterThan(0);
    for (const recipe of siteData.recipes)
      expect(section('Recipes')).toContain(
        `- [${recipe.title}](${site}${recipe.docPath}): ${recipe.description}`
      );
    expect(section('Recipes')).toContain(`(${site}docs/recipes/login.md)`);
  });

  it('lists every guide and the full file', () => {
    for (const guide of siteData.guides)
      expect(section('Guides')).toContain(
        `- [${guide.title}](${site}${guide.docPath}): ${guide.description}`
      );
    expect(section('Optional')).toContain(`- [Everything in one file](${site}llms-full.txt)`);
  });
});

describe('buildLlmsFull', () => {
  const docs = [
    { path: 'docs/a.md', content: '# A\n\nAlpha body.\n' },
    { path: 'docs/control/b.md', content: '# B\n\nBeta body.\n' },
  ];
  const full = buildLlmsFull('# Agents\n\nRules.\n', docs);

  it('starts with AGENTS.md', () => {
    expect(full.startsWith('# Agents\n\nRules.\n')).toBe(true);
  });

  it('contains each doc once, marked with its path', () => {
    for (const doc of docs) {
      expect(full.split(doc.content)).toHaveLength(2);
      expect(full.split(`<!-- ${doc.path} -->`)).toHaveLength(2);
      expect(full.indexOf(`<!-- ${doc.path} -->`)).toBeLessThan(full.indexOf(doc.content));
    }
  });
});
