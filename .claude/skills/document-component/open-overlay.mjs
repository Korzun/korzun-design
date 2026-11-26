// Screenshot one example on a component page after a sequence of steps inside
// its demo frame (clicks, typing), so an opened menu, popover, select list,
// dialog, or a menu inside a dialog is seen exactly as a reader sees it.
//
// node .claude/skills/document-component/open-overlay.mjs <base-url> <slug> <example-slug> <out.png> STEP... [--theme light|dark|both] [--width <px>]
//
// STEP is one of:
//   --click "<role>:<name>"     click the element with that ARIA role and exact accessible name
//   --click "<name>"            the same with role button
//   --click "<role>:<name>#2"   the second such element (1-based), when several share the name
//   --type "<role>:<text>"      focus the first element with that role (combobox, textbox) and
//                               type; it needs no accessible name
//   --type "<role>#2:<text>"    the same into the second element with that role
//                               (a newline in <text> is typed as Enter: --type $'textbox:One\nTwo')
//   --press "<key>"             press a key on whatever has focus (ArrowDown, Enter, Escape,
//                               Backspace), so a key after --type lands in the field
//
// Steps run in order, each after the last settles. `--theme both` (the
// default) writes <out>-light.png and <out>-dark.png; light or dark writes <out>.png.
// `--width` sets the browser viewport width (default 1280), to see the page as a phone does.
// <base-url> is the running gallery, e.g. http://localhost:5191. Uses the
// global mise playwright (`mise where npm:playwright`).
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const usage =
  'usage: open-overlay.mjs <base-url> <slug> <example-slug> <out.png> (--click "[role:]name[#n]" | --type "role[#n]:text" | --press key)... [--theme light|dark|both] [--width px]';
const args = process.argv.slice(2);
const [base, slug, example, out] = args;
const steps = [];
let theme = 'both';
let width = 1280;
for (let i = 4; i < args.length; i += 2) {
  const [flag, value] = [args[i], args[i + 1]];
  if (value === undefined) fail(`${flag} needs a value`);
  if (flag === '--theme') theme = value;
  else if (flag === '--width') width = Number(value);
  else if (flag === '--click' || flag === '--type' || flag === '--press')
    steps.push({ kind: flag.slice(2), value });
  else fail(`unknown option ${flag}`);
}
if (!base || !slug || !example || !out?.endsWith('.png')) fail('missing argument');
if (!['light', 'dark', 'both'].includes(theme)) fail(`--theme ${theme}`);
if (!Number.isInteger(width) || width < 200) fail(`--width ${width}`);
if (steps.length === 0) fail('give at least one --click, --type or --press step');

function fail(message) {
  console.error(`${message}\n${usage}`);
  process.exit(2);
}

// "menuitem:Delete book" → role menuitem; "Actions" → role button. A trailing
// "#n" on the name picks the nth match (1-based); n is 1 without one.
const clickTarget = (value) => {
  const m = /^([a-z]+):([\s\S]*)$/.exec(value);
  const { role, name } = m ? { role: m[1], name: m[2] } : { role: 'button', name: value };
  const nth = /^([\s\S]*)#(\d+)$/.exec(name);
  return nth ? { role, name: nth[1], n: Number(nth[2]) } : { role, name, n: 1 };
};
// "textbox:Fi" → type "Fi" into the first textbox; "textbox#2:Fi" into the second.
const typeTarget = (value) => {
  const m = /^([a-z]+)(?:#(\d+))?:([\s\S]*)$/.exec(value);
  if (!m) fail(`--type ${value}: expected "role:text" or "role#n:text"`);
  return { role: m[1], n: m[2] ? Number(m[2]) : 1, text: m[3] };
};
const nthOf = (locator, n) => {
  if (n < 1) fail(`#${n}: matches count from 1`);
  return locator.nth(n - 1);
};

const dir = execFileSync('mise', ['where', 'npm:playwright'], { encoding: 'utf8' }).trim();
const { chromium } = await import(
  pathToFileURL(join(dir, 'node_modules/playwright/index.mjs')).href
);

const shoot = async (browser, scheme, path) => {
  const page = await browser.newPage({
    viewport: { width, height: 2400 },
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
      const { role, name, n } = clickTarget(step.value);
      await nthOf(frame.getByRole(role, { name, exact: true }), n).click({ timeout: 15000 });
    } else if (step.kind === 'type') {
      const { role, n, text } = typeTarget(step.value);
      const field = nthOf(frame.getByRole(role), n);
      await field.click({ timeout: 15000 });
      await field.pressSequentially(text, { delay: 30 });
    } else {
      // On the focused element, wherever it is: pressing on the body would move focus off a field.
      await page.keyboard.press(step.value);
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
