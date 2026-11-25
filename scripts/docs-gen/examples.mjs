/** @typedef {import('./types.js').ExampleInfo} ExampleInfo */

/**
 * @param {string} file
 * @param {string} source
 * @returns {ExampleInfo}
 */
export function readExample(file, source) {
  const name = file.split('/').pop();
  const m = /^(\d+)-([a-z0-9-]+)\.tsx$/.exec(name);
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
  return {
    file,
    slug: m[2],
    order: Number(m[1]),
    title: lines[0].trim(),
    description: lines.slice(1).join('\n').trim(),
    code: source.slice(c[0].length),
  };
}
