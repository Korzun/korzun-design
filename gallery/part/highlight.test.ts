import { highlight } from './highlight.js';

const colourOf = (html: string, word: string): string | undefined =>
  new RegExp(`<span style="color:var\\((--code-[a-z-]+)\\)">\\s*${word}</span>`).exec(html)?.[1];

describe('highlight', () => {
  const html = highlight(
    "import { Button } from '@korzun/design/control';\n" +
      'export default function Save() {\n' +
      '  return <Button type="primary" onClick={() => go(1)}>Save</Button>;\n' +
      '}'
  );

  it('colours keywords, strings, components and JSX attributes by token kind', () => {
    expect(colourOf(html, 'import')).toBe('--code-token-keyword');
    expect(colourOf(html, "'@korzun/design/control'")).toBe('--code-token-string-expression');
    expect(colourOf(html, 'Button')).toBe('--code-token-constant');
    expect(colourOf(html, 'onClick')).toBe('--code-token-function');
  });

  it('returns the inner HTML of a <code>, one .line span per source line', () => {
    expect(html).not.toMatch(/<pre|<code/);
    expect(html.match(/class="line"/g)).toHaveLength(4);
  });

  it('reads a ts fence with the same grammar', () => {
    expect(colourOf(highlight('const a: number = 1;', 'ts'), 'const')).toBe('--code-token-keyword');
  });

  it('escapes code in a language it has no grammar for', () => {
    expect(highlight('<b>&</b>', 'cobol')).toBe('&lt;b&gt;&amp;&lt;/b&gt;');
  });

  it('never lets source markup through as HTML', () => {
    expect(highlight('const s = "<img src=x onerror=alert(1)>";')).not.toContain('<img');
  });
});
