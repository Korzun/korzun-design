import { parseSync } from 'oxc-parser';

/**
 * `parseSync`, but a syntax error throws (`<file>: <message>`) instead of
 * returning a partial program the generator would read as fewer props,
 * defaults or tokens.
 * @param {string} file used for the parser's file name and in the error
 * @param {string} source
 * @param {'ts' | 'tsx' | 'dts'} lang
 */
export function parseOrThrow(file, source, lang) {
  const result = parseSync(file, source, { lang });
  if (result.errors.length > 0) {
    throw new Error(`${file}: ${result.errors.map((e) => e.message).join('; ')}`);
  }
  return result;
}
