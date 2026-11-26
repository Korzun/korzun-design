/** Parse a leading `---\nkey: value\n---\n` block; no YAML. */
export function parseFrontMatter(md) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(md);
  if (!m) return { data: {}, content: md };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 1) continue;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, content: md.slice(m[0].length) };
}
