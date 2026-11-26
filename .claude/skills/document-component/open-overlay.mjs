// Screenshot one example on a component page after clicking a button inside its
// demo frame, so an opened menu, popover, select or dialog is seen as a reader
// sees it (clipped by the frame or not).
//
// node .claude/skills/document-component/open-overlay.mjs <slug> <example-slug> "<button name>" <out.png> [light|dark]
//
// Needs `npm run gallery` listening on http://localhost:5173. Uses the global
// mise playwright (`mise where npm:playwright`).
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [slug, example, name, out, scheme = 'light'] = process.argv.slice(2);
if (!slug || !example || !name || !out) {
  console.error(
    'usage: open-overlay.mjs <slug> <example-slug> "<button name>" <out.png> [light|dark]'
  );
  process.exit(2);
}

const dir = execFileSync('mise', ['where', 'npm:playwright'], { encoding: 'utf8' }).trim();
const { chromium } = await import(
  pathToFileURL(join(dir, 'node_modules/playwright/index.mjs')).href
);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 2400 },
    colorScheme: scheme === 'dark' ? 'dark' : 'light',
  });
  await page.goto(`http://localhost:5173/#/components/${slug}`);
  const section = page.locator(`#example-${example}`);
  await section.waitFor({ timeout: 30000 });
  const frame = section.frameLocator('iframe');
  await frame.getByRole('button', { name, exact: true }).first().click({ timeout: 30000 });
  await page.waitForTimeout(800);
  await section.screenshot({ path: out });
  console.log('wrote ' + out);
} finally {
  await browser.close();
}
