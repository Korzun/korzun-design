// Full-page screenshots of one component page, taken only after every demo
// frame has loaded and sized itself (the gallery sets `data-ready` on each
// example section), so no frame is blank or half-height in the shot.
//
// node .claude/skills/document-component/shoot-page.mjs <base-url> <slug> <out.png> [--theme light|dark|both] [--width <px>]
//
// `--theme both` (the default) writes <out>-light.png and <out>-dark.png;
// light or dark writes <out>.png. `--width` sets the viewport width (default
// 1280), to see the page as a phone does (`--width 390`). <base-url> is the running gallery, e.g.
// http://localhost:5191. Uses the global mise playwright (`mise where npm:playwright`).
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const usage =
  'usage: shoot-page.mjs <base-url> <slug> <out.png> [--theme light|dark|both] [--width px]';
const [base, slug, out, ...rest] = process.argv.slice(2);
const options = { '--theme': 'both', '--width': '1280' };
for (let i = 0; i < rest.length; i += 2) {
  if (!(rest[i] in options) || rest[i + 1] === undefined) {
    console.error(usage);
    process.exit(2);
  }
  options[rest[i]] = rest[i + 1];
}
const theme = options['--theme'];
const width = Number(options['--width']);
if (!base || !slug || !out?.endsWith('.png') || !Number.isInteger(width) || width < 200) {
  console.error(usage);
  process.exit(2);
}
if (!['light', 'dark', 'both'].includes(theme)) {
  console.error(`--theme ${theme}\n${usage}`);
  process.exit(2);
}

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
  await page.getByRole('heading', { level: 1 }).waitFor({ timeout: 30000 });
  await page.waitForFunction(
    () => {
      const sections = document.querySelectorAll('section[id^="example-"]');
      return [...sections].every((s) => s.hasAttribute('data-ready'));
    },
    undefined,
    { timeout: 60000 }
  );
  const count = await page.locator('section[id^="example-"]').count();
  await page.evaluate(() => document.fonts.ready);
  // A frame may post a second height once its fonts and images settle.
  await page.waitForTimeout(500);
  await page.screenshot({ path, fullPage: true });
  console.log(`wrote ${path} (${count} examples ready)`);
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
