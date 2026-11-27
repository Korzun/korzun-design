import { ThemeProvider } from '@korzun/design/theme';
import { ToastProvider } from '@korzun/design/toast';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';

import type { ModuleInfo } from '../../scripts/docs-gen/types.js';
import { moduleBySlug, siteData } from '../data.js';
import { ComponentPage } from './component.js';

const mount = (slug: string) =>
  render(
    <ThemeProvider identity="test">
      <ToastProvider>
        <MemoryRouter initialEntries={[`/components/${slug}`]}>
          <Routes>
            <Route path="/components/:slug" element={<ComponentPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </ThemeProvider>
  );

const button = moduleBySlug('button')!;

describe('ComponentPage', () => {
  beforeEach(() => localStorage.clear());

  it('renders the title, description and every section heading', () => {
    mount('button');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Button');
    expect(screen.getAllByText(button.description).length).toBeGreaterThan(0);
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    for (const section of ['Examples', 'Props', 'Tokens', 'Changelog'])
      expect(h2).toContain(section);
  });

  it('shows the type prop with its union in the props table', () => {
    mount('button');
    const table = screen.getByRole('table', { name: 'ButtonProps' });
    const row = within(table)
      .getAllByRole('row')
      .find((r) => within(r).queryAllByRole('cell')[0]?.textContent?.startsWith('type'))!;
    expect(row).toBeDefined();
    expect(within(row).getAllByRole('cell')[1]).toHaveTextContent("'primary'");
  });

  it('copies the exact import line', async () => {
    const user = userEvent.setup();
    const write = vi.spyOn(navigator.clipboard, 'writeText');
    mount('button');
    await user.click(screen.getByRole('button', { name: 'Copy import' }));
    expect(write).toHaveBeenCalledWith(button.importLine);
    expect(await screen.findByText('Copied')).toBeInTheDocument();
  });

  it('links the LLM doc to the raw markdown', () => {
    mount('button');
    const link = screen.getByRole('link', { name: 'LLM doc' });
    expect(link.getAttribute('href')).toMatch(/docs\/control\/button\.md$/);
  });

  it('reveals the example code exactly as in the site data', async () => {
    const user = userEvent.setup();
    mount('button');
    const basic = button.examples.find((e) => e.slug === 'basic')!;
    const block = screen.getByRole('region', { name: basic.title });
    expect(block.querySelector('pre code')).toBeNull();
    await user.click(within(block).getByRole('button', { name: 'Show code' }));
    expect(block.querySelector('pre code')!.textContent).toBe(basic.code);
  });

  it('embeds each example as a frame without fit=center', () => {
    mount('button');
    const frames = Array.from(document.querySelectorAll('iframe'));
    expect(frames).toHaveLength(button.examples.length);
    expect(frames[0]!.getAttribute('src')).toMatch(
      /^\/#\/frame\/button\/basic\?theme=(light|dark|auto)$/
    );
  });

  it('sizes a frame from its same-origin height message', () => {
    mount('button');
    const frame = document.querySelector('iframe')!;
    const send = (origin: string, height: number) =>
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            origin,
            source: frame.contentWindow,
            data: { type: 'gallery:height', height },
          })
        );
      });
    send('https://evil.example', 999);
    expect(frame.getAttribute('height')).not.toBe('999');
    send(window.location.origin, 321);
    expect(frame.getAttribute('height')).toBe('321');
  });

  it('rewrites relative doc links to site routes', () => {
    const { container } = mount('button');
    const corners = Array.from(container.querySelectorAll('a')).filter(
      (a) => a.textContent === 'corners'
    );
    expect(corners.length).toBeGreaterThan(0);
    for (const a of corners) expect(a.getAttribute('href')).toBe('#/guides/corners');
  });

  it('lists the tokens with light and dark values', () => {
    mount('button');
    const table = screen.getByRole('table', { name: 'Tokens' });
    const token = button.tokens.find((t) => t.kind === 'color')!;
    const row = within(table).getByText(`theme.${token.path}`).closest('tr')!;
    expect(row).toHaveTextContent(token.light!);
    expect(row).toHaveTextContent(token.dark!);
  });

  it('notes the external types a props table also accepts', () => {
    mount('stack');
    expect(screen.getByText(/Also accepts:/)).toHaveTextContent('HTMLAttributes');
  });

  it('links a nested module to its parent, and a parent to its nested modules', () => {
    mount('page-actions-bar');
    expect(screen.getByText(/^Part of/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page' })).toHaveAttribute('href', '/components/page');
  });

  it('lists the modules nested under a parent', () => {
    mount('modal');
    const line = screen.getByText(/^Goes with/);
    expect(
      within(line)
        .getAllByRole('link')
        .map((a) => a.textContent)
    ).toEqual(['ConfirmModal', 'useModal']);
  });

  it('renders not-found for an unknown slug', () => {
    mount('nope');
    expect(screen.getByRole('heading', { level: 1, name: 'Not found' })).toBeInTheDocument();
  });
});

describe('ComponentPage for the icon module', () => {
  // The real icon page arrives with its doc's front matter; a synthetic module
  // stands in so the grid wiring is covered now.
  const icon: ModuleInfo = {
    ...button,
    id: 'icon',
    slug: 'icon',
    entry: '@korzun/design/icon',
    docPath: 'docs/icon.md',
    title: 'Icons',
    category: 'Data display',
    values: ['CheckIcon'],
    types: ['IconProps'],
    importLine: "import { CheckIcon } from '@korzun/design/icon'",
    body: '',
    examples: [],
    tables: [],
    tokens: [],
    changelog: [],
  };
  beforeAll(() => siteData.modules.push(icon));
  afterAll(() => {
    siteData.modules.splice(siteData.modules.indexOf(icon), 1);
  });

  it('renders the icon grid', () => {
    mount('icon');
    const grid = screen.getByRole('list', { name: 'Icons' });
    expect(within(grid).getByText('CheckIcon')).toBeInTheDocument();
  });

  it('renders no icon grid on other pages', () => {
    mount('button');
    expect(screen.queryByRole('list', { name: 'Icons' })).toBeNull();
  });
});
