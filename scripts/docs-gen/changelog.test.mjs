import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { knownNames } from './barrels.mjs';
import { currentTags, parseChangelog, validateTags } from './changelog.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const sample = `# Changelog

## 0.4.0 — 2026-11-23

- [Menu] New \`Menu\`: a button that opens a list.
  - Sub-bullet detail.
  - Another detail.
- [Button, Popover] \`Button\` takes a \`ref\`.

## 0.3.0 — 2026-11-22

- [General] No code changes.
`;

test('parses heading version and date', () => {
  const versions = parseChangelog(sample);
  assert.deepEqual(
    versions.map((v) => [v.version, v.date]),
    [
      ['0.4.0', '2026-11-23'],
      ['0.3.0', '2026-11-22'],
    ]
  );
  assert.equal(versions[0].entries.length, 2);
});

test('strips the tag prefix from text and returns tags', () => {
  const [first, second] = parseChangelog(sample)[0].entries;
  assert.deepEqual(first.tags, ['Menu']);
  assert.ok(first.text.startsWith('New `Menu`'));
  assert.deepEqual(second.tags, ['Button', 'Popover']);
  assert.equal(second.text, '`Button` takes a `ref`.');
  assert.equal(first.version, '0.4.0');
  assert.equal(first.date, '2026-11-23');
});

test('sub-bullets stay in the parent text', () => {
  const [first] = parseChangelog(sample)[0].entries;
  assert.ok(first.text.includes('- Sub-bullet detail.'));
  assert.ok(first.text.includes('- Another detail.'));
});

test('validateTags reports untagged bullets and unknown tags', () => {
  const versions = parseChangelog(
    '## 0.4.0 — 2026-11-23\n\n- No tag here.\n- [Buton] Typo.\n- [General] Fine.\n'
  );
  const errors = validateTags(versions, new Set(['Button']));
  assert.deepEqual(errors, ['0.4.0: untagged bullet "No tag here."', '0.4.0: unknown tag "Buton"']);
});

test('validateTags accepts known names and General', () => {
  const versions = parseChangelog('## 0.4.0 — 2026-11-23\n\n- [Button, General] Ok.\n');
  assert.deepEqual(validateTags(versions, new Set(['Button'])), []);
});

test('the real CHANGELOG.md validates against the barrels', () => {
  const versions = currentTags(parseChangelog(readFileSync(join(repo, 'CHANGELOG.md'), 'utf8')));
  assert.ok(versions.length > 0);
  for (const v of versions) for (const e of v.entries) assert.ok(e.tags.length >= 1, v.version);
  assert.deepEqual(validateTags(versions, knownNames(repo)), []);
});

test('currentTags maps a removed former name to its current name, once', () => {
  const versions = currentTags(
    parseChangelog(
      '## 0.3.0 — 2026-11-22\n\n- [Dialog] New Dialog.\n- [Modal, Dialog, useModalDialog] Renamed.\n- [CardDivider] Old.\n- [Button] Kept.\n'
    )
  );
  assert.deepEqual(
    versions[0].entries.map((e) => e.tags),
    [['Modal'], ['Modal', 'useModal'], ['Divider'], ['Button']]
  );
  assert.deepEqual(validateTags(versions, new Set(['Modal', 'useModal', 'Divider', 'Button'])), []);
});
