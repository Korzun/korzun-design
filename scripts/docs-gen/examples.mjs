/** @typedef {import('./types.js').ExampleInfo} ExampleInfo */

/** `@viewport` values an example may ask for. */
const VIEWPORTS = ['mobile', 'desktop'];

/** The file name of a module's overview preview: its examples folder, no NN- prefix. */
export const PREVIEW_FILE = 'preview.tsx';

/**
 * The first comment line is the title, the rest the description. A
 * `@viewport mobile` line renders the demo (and the overview thumbnail) at
 * phone width; it is left out of the description.
 * @param {string} file
 * @param {string} source
 * @returns {ExampleInfo}
 */
export function readExample(file, source) {
  const name = file.split('/').pop();
  // `preview.tsx` is the overview thumbnail: the component alone, kept off the doc.
  const m = name === PREVIEW_FILE ? [name, '0', 'preview'] : /^(\d+)-([a-z0-9-]+)\.tsx$/.exec(name);
  if (!m) throw new Error(`Example ${file}: name must be NN-slug.tsx`);
  const c = /^\s*\/\*\*([\s\S]*?)\*\/[ \t]*\r?\n(?:[ \t]*\r?\n)?/.exec(source);
  const lines = c
    ? c[1]
        .split('\n')
        .map((l) => l.replace(/^\s*\*? ?/, '').trimEnd())
        .filter((l, i, a) => !(l === '' && (i === 0 || i === a.length - 1)))
    : [];
  if (!c || !lines[0]?.trim()) {
    throw new Error(`Example ${file}: needs a leading doc comment with a title`);
  }
  let viewport;
  const body = lines.slice(1).filter((line) => {
    const tag = /^\s*@viewport\s+(\S*)\s*$/.exec(line);
    if (!tag) return true;
    if (!VIEWPORTS.includes(tag[1])) {
      throw new Error(`Example ${file}: @viewport must be "mobile" or "desktop", not "${tag[1]}"`);
    }
    viewport = tag[1];
    return false;
  });
  return {
    file,
    slug: m[2],
    order: Number(m[1]),
    title: lines[0].trim(),
    description: body.join('\n').trim(),
    code: source.slice(c[0].length),
    ...(viewport ? { viewport } : {}),
  };
}
