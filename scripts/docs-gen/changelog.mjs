// Parses CHANGELOG.md: `## X.Y.Z — YYYY-MM-DD` headings, then top-level
// bullets of the form `- [Tag, Tag] text`. Indented lines (sub-bullets and
// wrapped text) belong to the bullet above and stay in its `text`.
export const parseChangelog = (md) => {
  const versions = [];
  let current = null;
  let entry = null;
  for (const line of md.split('\n')) {
    const heading = line.match(/^## (\d+\.\d+\.\d+) — (\d{4}-\d{2}-\d{2})\s*$/);
    if (heading) {
      current = { version: heading[1], date: heading[2], entries: [] };
      versions.push(current);
      entry = null;
      continue;
    }
    if (!current) continue;
    const bullet = line.match(/^- (.*)$/);
    if (bullet) {
      const tagged = bullet[1].match(/^\[([^\]]*)\]\s*(.*)$/);
      const tags = tagged
        ? tagged[1]
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      entry = {
        version: current.version,
        date: current.date,
        tags,
        text: tagged ? tagged[2] : bullet[1],
      };
      current.entries.push(entry);
    } else if (entry && /^\s+\S/.test(line)) {
      entry.text += `\n${line}`;
    }
  }
  return versions;
};

const first = (text) => text.split('\n')[0];

export const validateTags = (versions, knownNames) => {
  const errors = [];
  for (const { version, entries } of versions) {
    for (const { tags, text } of entries) {
      if (tags.length === 0) errors.push(`${version}: untagged bullet "${first(text)}"`);
      for (const tag of tags) {
        if (tag !== 'General' && !knownNames.has(tag))
          errors.push(`${version}: unknown tag "${tag}"`);
      }
    }
  }
  return errors;
};

/**
 * Exported names that were renamed and then removed, mapped to their current
 * name. History bullets keep their original tags; this resolves them so they
 * validate and still appear on the renamed module's page.
 */
export const FORMER_NAMES = {
  CardDivider: 'Divider',
  Dialog: 'Modal',
  useModalDialog: 'useModal',
  isStandalone: 'useIsStandalone',
};

/** `versions` with each former-name tag replaced by its current name (deduplicated). */
export const currentTags = (versions) =>
  versions.map((v) => ({
    ...v,
    entries: v.entries.map((e) => ({
      ...e,
      tags: [...new Set(e.tags.map((t) => FORMER_NAMES[t] ?? t))],
    })),
  }));
