// Screenshot one example on a component page after a sequence of steps inside
// its demo frame (clicks, typing), so an opened menu, popover, select list,
// dialog, or a menu inside a dialog is seen exactly as a reader sees it.
//
// node .claude/skills/document-component/open-overlay.mjs <base-url> <slug> <example-slug> <out.png> STEP... [--theme light|dark|both]
//
// STEP is one of:
//   --click "<role>:<name>"   click the element with that ARIA role and exact accessible name
//   --click "<name>"          the same with role button
//   --type "<role>:<text>"    focus the first element with that role (combobox, textbox) and type
//   --press "<key>"           press a key in the frame (ArrowDown, Enter, Escape)
//
// Steps run in order, each after the last settles. `--theme both` (the
// default) writes <out>-light.png and <out>-dark.png; light or dark writes <out>.png.
// <base-url> is the running gallery, e.g. http://localhost:5191. Uses the
// global mise playwright (`mise where npm:playwright`).
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const usage =
  'usage: open-overlay.mjs <base-url> <slug> <example-slug> <out.png> (--click "[role:]name" | --type "role:text" | --press key)... [--theme light|dark|both]';
const args = process.argv.slice(2);
const [base, slug, example, out] = args;
const steps = [];
let theme = 'both';
for (let i = 4; i < args.length; i += 2) {
  const [flag, value] = [args[i], args[i + 1]];
  if (value === undefined) fail(`${flag} needs a value`);
  if (flag === '--theme') theme = value;
  else if (flag === '--click' || flag === '--type' || flag === '--press')
    steps.push({ kind: flag.slice(2), value });
  else fail(`unknown option ${flag}`);
}
if (!base || !slug || !example || !out?.endsWith('.png')) fail('missing argument');
if (!['light', 'dark', 'both'].includes(theme)) fail(`--theme ${theme}`);
if (steps.length === 0) fail('give at least one --click, --type or --press step');

function fail(message) {
  console.error(`${message}\n${usage}`);
  process.exit(2);
}

// "menuitem:Delete book" → role menuitem; "Actions" → role button.
const target = (value, fallbackRole) => {
  const m = /^([a-z]+):(.*)$/.exec(value);
  return m ? { role: m[1], text: m[2] } : { role: fallbackRole, text: value };
};

const dir = execFileSync('mise', ['where', 'npm:playwright'], { encoding: 'utf8' }).trim();
const { chromium } = await import(
  pathToFileURL(join(dir, 'node_modules/playwright/index.mjs')).href
);

const shoot = async (browser, scheme, path) => {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 2400 },
    colorScheme: scheme,
  });
  await page.goto(`${base.replace(/\/$/, '')}/#/components/${slug}`);
  const section = page.locator(`#example-${example}`);
  await section.waitFor({ timeout: 30000 });
  // Set by the gallery once the demo frame has loaded and sized itself.
  await page.locator(`#example-${example}[data-ready]`).waitFor({ timeout: 30000 });
  const frame = section.frameLocator('iframe');
  for (const step of steps) {
    if (step.kind === 'click') {
      const { role, text } = target(step.value, 'button');
      await frame.getByRole(role, { name: text, exact: true }).first().click({ timeout: 15000 });
    } else if (step.kind === 'type') {
      const { role, text } = target(step.value, 'combobox');
      const field = frame.getByRole(role).first();
      await field.click({ timeout: 15000 });
      await field.pressSequentially(text, { delay: 30 });
    } else {
      await frame.locator('body').press(step.value);
    }
    await page.waitForTimeout(400);
  }
  // Let the frame grow to fit what opened, and the popover re-measure.
  await page.waitForTimeout(800);
  await section.screenshot({ path });
  console.log('wrote ' + path);
  await page.close();
};

const browser = await chromium.launch();
try {
  const schemes = theme === 'both' ? ['light', 'dark'] : [theme];
  for (const scheme of schemes) {
    await shoot(browser, scheme, theme === 'both' ? out.replace(/\.png$/, `-${scheme}.png`) : out);
  }
} finally {
  await browser.close();
}
