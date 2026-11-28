import { createCssVariablesTheme, createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import tsx from 'shiki/langs/tsx.mjs';

// Colours are CSS variables, filled from `theme.color.code` by `CodeBlock` (or
// Markdown's `codeColours` class), so one highlight serves light and dark mode.
const cssVariablesTheme = createCssVariablesTheme({ name: 'tokens', variablePrefix: '--code-' });

// The docs fence only `ts` and `tsx`; the tsx grammar reads both. The
// JavaScript regex engine runs synchronously, with no wasm to load.
const highlighter = createHighlighterCoreSync({
  themes: [cssVariablesTheme],
  langs: [tsx],
  engine: createJavaScriptRegexEngine(),
});

const LANGS: Record<string, string> = { ts: 'tsx', tsx: 'tsx', typescript: 'tsx' };

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * `code` as the inner HTML of a `<code>`: one span per token, coloured by the
 * `--code-*` variables `CodeBlock` sets. A language without a grammar
 * comes back escaped, unhighlighted.
 */
export const highlight = (code: string, lang = 'tsx'): string => {
  const grammar = LANGS[lang];
  if (!grammar) return escapeHtml(code);
  const html = highlighter.codeToHtml(code, { lang: grammar, theme: 'tokens' });
  // Keep the token spans; the caller's <pre> carries the box and background.
  return html.slice(html.indexOf('<code>') + '<code>'.length, html.lastIndexOf('</code>'));
};
