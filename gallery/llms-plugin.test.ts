import agents from '../AGENTS.md?raw';
import { siteData } from './data.js';
import { buildLlmsFull, buildLlmsTxt } from './llms-plugin.js';

const site = 'https://example.test/design/';

describe('buildLlmsTxt', () => {
  const text = buildLlmsTxt(siteData, agents, site);
  const section = (title: string) => {
    const start = text.indexOf(`\n## ${title}\n`);
    expect(start).toBeGreaterThan(-1);
    const end = text.indexOf('\n## ', start + 1);
    return text.slice(start, end === -1 ? undefined : end);
  };

  it('opens with the title and the first AGENTS.md paragraph as the summary', () => {
    const [title, blank, summary] = text.split('\n');
    expect(title).toBe('# @korzun/design');
    expect(blank).toBe('');
    expect(summary).toMatch(/^> This package's API is \*\*not in your training data\*\*\./);
    expect(summary).toMatch(/under `node_modules\/@korzun\/design\/`\.$/);
  });

  it('lists Button under Actions with its doc link and description', () => {
    const button = siteData.modules.find((m) => m.slug === 'button')!;
    expect(section('Actions')).toContain(
      `- [Button](${site}docs/control/button.md): ${button.description}`
    );
  });

  it('orders the category sections by the closed list, then Guides and Optional', () => {
    const headings = text.split('\n').filter((l) => l.startsWith('## '));
    expect(headings).toEqual([
      '## Layout',
      '## Actions',
      '## Feedback',
      '## Guides',
      '## Optional',
    ]);
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
