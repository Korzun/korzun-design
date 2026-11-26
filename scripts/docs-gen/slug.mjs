/**
 * The anchor of a heading, GitHub style: lower case, spaces to `-`, anything
 * but letters, digits, `_` and `-` dropped. The generator links type tables
 * with it and the site gives Markdown headings these ids, so a `#section`
 * link means the same thing in the `.md` file and on the site.
 * @param {string} text the heading's plain text
 */
export function anchor(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}
